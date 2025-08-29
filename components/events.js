import { translations, safeChromeBookmarksCall, debounce } from "./utils.js"
import { renderFilteredBookmarks, updateUILanguage, updateTheme } from "./ui.js"
import {
  getBookmarkTree,
  moveBookmarksToFolder,
  flattenBookmarks,
  getFolders,
  isInFolder,
} from "./bookmarks.js"
import {
  uiState,
  selectedBookmarks,
  setCurrentBookmarkId,
  saveUIState,
} from "./state.js"

export function setupEventListeners(elements) {
  elements.languageSwitcher.addEventListener("change", (e) => {
    updateUILanguage(elements, e.target.value)
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
  })

  elements.themeSwitcher.addEventListener("change", (e) => {
    localStorage.setItem("appTheme", e.target.value)
    updateTheme(elements, e.target.value)
  })

  elements.fontSwitcher.addEventListener("change", (e) => {
    document.body.classList.remove("font-gohu", "font-normal")
    document.body.classList.add(`font-${e.target.value}`)
    localStorage.setItem("appFont", e.target.value)
  })

  elements.toggleCheckboxesButton.addEventListener("click", () => {
    uiState.checkboxesVisible = !uiState.checkboxesVisible
    const language = localStorage.getItem("appLanguage") || "en"
    elements.toggleCheckboxesButton.textContent = uiState.checkboxesVisible
      ? translations[language].hideCheckboxes
      : translations[language].showCheckboxes
    document
      .querySelectorAll(".bookmark-checkbox, .select-all input")
      .forEach((checkbox) => {
        checkbox.style.display = uiState.checkboxesVisible
          ? "inline-block"
          : "none"
      })
    if (!uiState.checkboxesVisible) {
      selectedBookmarks.clear()
      elements.addToFolderButton.classList.add("hidden")
      document.querySelectorAll(".bookmark-checkbox").forEach((cb) => {
        cb.checked = false
      })
    }
    saveUIState()
  })

  elements.scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  window.addEventListener("scroll", () => {
    elements.scrollToTopButton.classList.toggle("hidden", window.scrollY <= 0)
  })

  elements.renameSave.addEventListener("click", () => {
    const newTitle = elements.renameInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"
    if (newTitle && currentBookmarkId) {
      safeChromeBookmarksCall(
        "update",
        [currentBookmarkId, { title: newTitle }],
        () => {
          getBookmarkTree((bookmarkTreeNodes) => {
            if (bookmarkTreeNodes) {
              renderFilteredBookmarks(bookmarkTreeNodes, elements)
              setCurrentBookmarkId(null)
            }
            elements.renamePopup.classList.add("hidden")
          })
        }
      )
    } else if (!newTitle) {
      elements.renameInput.classList.add("error")
      elements.renameInput.placeholder = translations[language].emptyTitleError
    }
  })

  elements.renameCancel.addEventListener("click", () => {
    elements.renamePopup.classList.add("hidden")
    elements.renameInput.classList.remove("error")
    elements.renameInput.value = ""
    setCurrentBookmarkId(null)
  })

  elements.renameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      elements.renameSave.click()
    }
  })

  elements.renameInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      elements.renameCancel.click()
    }
  })

  elements.renamePopup.addEventListener("click", (e) => {
    if (e.target === elements.renamePopup) {
      elements.renameCancel.click()
    }
  })

  elements.clearRenameButton.addEventListener("click", () => {
    elements.renameInput.value = ""
    elements.renameInput.classList.remove("error")
    const language = localStorage.getItem("appLanguage") || "en"
    elements.renameInput.placeholder = translations[language].renamePlaceholder
    elements.renameInput.focus()
  })

  elements.settingsButton.addEventListener("click", (e) => {
    e.stopPropagation()
    elements.settingsMenu.classList.toggle("hidden")
  })

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest("#settings-button") &&
      !e.target.closest("#settings-menu") &&
      !e.target.closest(".dropdown-btn") &&
      !e.target.closest(".dropdown-menu")
    ) {
      elements.settingsMenu.classList.add("hidden")
      document.querySelectorAll(".dropdown-menu").forEach((menu) => {
        menu.classList.add("hidden")
      })
    }
  })

  elements.exportBookmarksOption.addEventListener("click", () => {
    const language = localStorage.getItem("appLanguage") || "en"
    const currentTheme = document.body.getAttribute("data-theme") || "dark"
    // Create popup container
    const popup = document.createElement("div")
    popup.className = "popup"
    popup.setAttribute("data-theme", currentTheme)
    popup.innerHTML = `
  <div class="popup-content">
    <h2>${translations[language].exportTitle || "Export Bookmarks"}</h2>
    <select id="exportFormat">
      <option value="json">JSON</option>
      <option value="html">HTML</option>
    </select>
    <button id="confirmExport">${
      translations[language].confirm || "Export"
    }</button>
    <button id="cancelExport">${
      translations[language].cancel || "Cancel"
    }</button>
  </div>
`

    // Append popup to body
    document.body.appendChild(popup)

    // Handle confirm export
    document.getElementById("confirmExport").addEventListener("click", () => {
      const exportChoice = document
        .getElementById("exportFormat")
        .value.toUpperCase()
      safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
        if (!bookmarkTreeNodes) {
          alert(
            translations[language].errorUnexpected ||
              "Unexpected error occurred"
          )
          document.body.removeChild(popup)
          return
        }

        const exportData = {
          timestamp: new Date().toISOString(),
          bookmarks: bookmarkTreeNodes,
        }

        if (exportChoice === "JSON") {
          const jsonString = JSON.stringify(exportData, null, 2)
          const blob = new Blob([jsonString], { type: "application/json" })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `bookmarks_${
            new Date().toISOString().split("T")[0]
          }.json`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        } else if (exportChoice === "HTML") {
          const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Bookmarks</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    .container { max-width: 1200px; margin: auto; }
    .controls { margin-bottom: 20px; }
    #searchInput { padding: 8px; width: 100%; max-width: 300px; }
    .view-toggle { margin-left: 20px; }
    .bookmark-list { list-style: none; padding: 0; }
    .bookmark-list li { padding: 10px; border-bottom: 1px solid #ddd; }
    .bookmark-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); 
      gap: 20px; 
    }
    .bookmark-grid .bookmark-item { 
      border: 1px solid #ddd; 
      padding: 15px; 
      border-radius: 5px; 
      text-align: center; 
    }
    .bookmark-item a { text-decoration: none; color: #007bff; }
    .bookmark-item a:hover { text-decoration: underline; }
    .folder { font-weight: bold; margin-top: 10px; }
    .hidden { display: none; }
  </style>
</head>
<body>
  <div class="container">
    <div class="controls">
      <input type="text" id="searchInput" placeholder="${
        translations[language].searchPlaceholder || "Search bookmarks..."
      }">
      <button class="view-toggle" onclick="toggleView('list')">List View</button>
      <button class="view-toggle" onclick="toggleView('grid')">Grid View</button>
    </div>
    <ul id="bookmarkList" class="bookmark-list"></ul>
    <div id="bookmarkGrid" class="bookmark-grid hidden"></div>
  </div>

  <script>
    const bookmarks = ${JSON.stringify(bookmarkTreeNodes)};
    const listContainer = document.getElementById("bookmarkList");
    const gridContainer = document.getElementById("bookmarkGrid");
    const searchInput = document.getElementById("searchInput");

    function renderBookmarks(nodes, parent = listContainer, gridParent = gridContainer, depth = 0) {
      nodes.forEach(node => {
        if (node.url) {
          const li = document.createElement("li");
          li.className = "bookmark-item";
          li.innerHTML = \`<a href="\${node.url}" target="_blank">\${node.title || node.url}</a>\`;
          parent.appendChild(li);

          const gridItem = document.createElement("div");
          gridItem.className = "bookmark-item";
          gridItem.innerHTML = \`<a href="\${node.url}" target="_blank">\${node.title || node.url}</a>\`;
          gridParent.appendChild(gridItem);
        }
        if (node.children) {
          const folder = document.createElement("li");
          folder.className = "folder";
          folder.textContent = node.title || "Unnamed Folder";
          parent.appendChild(folder);
          
          const gridFolder = document.createElement("div");
          gridFolder.className = "folder bookmark-item";
          gridFolder.textContent = node.title || "Unnamed Folder";
          gridParent.appendChild(gridFolder);

          renderBookmarks(node.children, parent, gridParent, depth + 1);
        }
      });
    }

    function toggleView(view) {
      if (view === "list") {
        listContainer.classList.remove("hidden");
        gridContainer.classList.add("hidden");
      } else {
        listContainer.classList.add("hidden");
        gridContainer.classList.remove("hidden");
      }
    }

    function filterBookmarks() {
      const query = searchInput.value.toLowerCase();
      const items = document.querySelectorAll(".bookmark-item");
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? "" : "none";
      });
    }

    searchInput.addEventListener("input", filterBookmarks);
    renderBookmarks(bookmarks);
  </script>
</body>
</html>
          `
          const blob = new Blob([htmlContent], { type: "text/html" })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `bookmarks_${
            new Date().toISOString().split("T")[0]
          }.html`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }

        document.body.removeChild(popup)
        elements.settingsMenu.classList.add("hidden")
      })
    })

    // Handle cancel
    document.getElementById("cancelExport").addEventListener("click", () => {
      document.body.removeChild(popup)
    })
  })

  // Popup styles
  const style = document.createElement("style")
  style.textContent = `
  .popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  .popup-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
  }
  .popup-content select, .popup-content button {
    margin: 10px;
    padding: 8px;
  }
`
  document.head.appendChild(style)

  elements.importBookmarksOption.addEventListener("click", () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"
    input.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
            const language = localStorage.getItem("appLanguage") || "en"
            alert(translations[language].importInvalidFile)
            return
          }

          safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
            if (!bookmarkTreeNodes) {
              const language = localStorage.getItem("appLanguage") || "en"
              alert(translations[language].importError)
              return
            }

            const existingBookmarks = flattenBookmarks(bookmarkTreeNodes)
            const existingUrls = new Set(existingBookmarks.map((b) => b.url))
            const bookmarksToImport = []
            const duplicateBookmarks = []
            const flattenImportedBookmarks = flattenBookmarks(data.bookmarks)
            flattenImportedBookmarks.forEach((bookmark) => {
              if (bookmark.url) {
                if (existingUrls.has(bookmark.url)) {
                  duplicateBookmarks.push(bookmark)
                } else {
                  bookmarksToImport.push(bookmark)
                }
              }
            })

            if (duplicateBookmarks.length > 0) {
              const language = localStorage.getItem("appLanguage") || "en"
              if (confirm(translations[language].importDuplicatePrompt)) {
                importNonDuplicateBookmarks(bookmarksToImport, elements)
              }
            } else {
              importNonDuplicateBookmarks(bookmarksToImport, elements)
            }
          })
        } catch (error) {
          console.error("Error parsing import file:", error)
          const language = localStorage.getItem("appLanguage") || "en"
          alert(translations[language].importInvalidFile)
        }
      }
      reader.readAsText(file)
    })
    input.click()
    elements.settingsMenu.classList.add("hidden")
  })

  function importNonDuplicateBookmarks(bookmarksToImport, elements) {
    const language = localStorage.getItem("appLanguage") || "en"
    const importPromises = bookmarksToImport.map((bookmark) => {
      return new Promise((resolve) => {
        safeChromeBookmarksCall(
          "create",
          [
            {
              parentId: bookmark.parentId || "2",
              title: bookmark.title || "",
              url: bookmark.url,
            },
          ],
          resolve
        )
      })
    })

    Promise.all(importPromises).then(() => {
      getBookmarkTree((bookmarkTreeNodes) => {
        if (bookmarkTreeNodes) {
          renderFilteredBookmarks(bookmarkTreeNodes, elements)
          alert(translations[language].importSuccess)
        } else {
          alert(translations[language].importError)
        }
      })
    })
  }

  elements.deleteFolderButton.addEventListener("click", () => {
    if (
      uiState.selectedFolderId &&
      uiState.selectedFolderId !== "1" &&
      uiState.selectedFolderId !== "2"
    ) {
      const language = localStorage.getItem("appLanguage") || "en"
      if (confirm(translations[language].deleteFolderConfirm)) {
        safeChromeBookmarksCall(
          "getSubTree",
          [uiState.selectedFolderId],
          (subTree) => {
            if (!subTree) return
            const folderNode = subTree[0]
            const bookmarksToCheck = folderNode.children
              ? folderNode.children.filter((node) => node.url)
              : []

            safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
              if (!bookmarkTreeNodes) return
              const allBookmarks = flattenBookmarks(bookmarkTreeNodes)
              const bookmarksToDelete = []
              bookmarksToCheck.forEach((bookmark) => {
                const duplicates = allBookmarks.filter(
                  (b) =>
                    b.url === bookmark.url &&
                    b.id !== bookmark.id &&
                    b.parentId !== uiState.selectedFolderId
                )
                if (duplicates.length === 0) {
                  bookmarksToDelete.push(bookmark.id)
                }
              })

              let deletePromises = bookmarksToDelete.map((bookmarkId) => {
                return new Promise((resolve) => {
                  safeChromeBookmarksCall("remove", [bookmarkId], resolve)
                })
              })

              Promise.all(deletePromises).then(() => {
                safeChromeBookmarksCall(
                  "remove",
                  [uiState.selectedFolderId],
                  () => {
                    uiState.selectedFolderId = ""
                    elements.folderFilter.value = ""
                    getBookmarkTree((bookmarkTreeNodes) => {
                      if (bookmarkTreeNodes) {
                        renderFilteredBookmarks(bookmarkTreeNodes, elements)
                      }
                    })
                  }
                )
              })
            })
          }
        )
      }
    }
  })

  elements.addToFolderButton.addEventListener("click", () => {
    if (selectedBookmarks.size > 0) {
      populateAddToFolderSelect(elements)
      elements.newFolderInput.value = ""
      elements.newFolderInput.classList.remove("error")
      const language = localStorage.getItem("appLanguage") || "en"
      elements.newFolderInput.placeholder =
        translations[language].newFolderPlaceholder
      elements.addToFolderPopup.classList.remove("hidden")
      elements.addToFolderSelect.focus()
    }
  })

  elements.createNewFolderButton.addEventListener("click", () => {
    const folderName = elements.newFolderInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"
    if (folderName) {
      safeChromeBookmarksCall(
        "create",
        [{ parentId: "2", title: folderName }],
        (newFolder) => {
          if (newFolder) {
            getBookmarkTree((bookmarkTreeNodes) => {
              if (bookmarkTreeNodes) {
                renderFilteredBookmarks(bookmarkTreeNodes, elements)
                elements.newFolderInput.value = ""
                elements.newFolderInput.classList.remove("error")
                elements.addToFolderSelect.value = newFolder.id
              }
            })
          }
        }
      )
    } else {
      elements.newFolderInput.classList.add("error")
      elements.newFolderInput.placeholder =
        translations[language].emptyFolderError
    }
  })

  elements.addToFolderSaveButton.addEventListener("click", () => {
    const targetFolderId = elements.addToFolderSelect.value
    const language = localStorage.getItem("appLanguage") || "en"
    console.log(
      "Saving bookmarks to folder:",
      targetFolderId,
      "Selected bookmarks:",
      Array.from(selectedBookmarks)
    )

    if (!targetFolderId) {
      console.log("No folder selected, showing error.")
      elements.newFolderInput.classList.add("error")
      elements.newFolderInput.placeholder =
        translations[language].selectFolderError
      elements.newFolderInput.focus()
      return
    }

    if (selectedBookmarks.size === 0) {
      console.log("No bookmarks selected, showing error.")
      alert(translations[language].errorUnexpected)
      elements.addToFolderPopup.classList.add("hidden")
      return
    }

    moveBookmarksToFolder(
      Array.from(selectedBookmarks),
      targetFolderId,
      elements,
      () => {
        elements.addToFolderPopup.classList.add("hidden")
      }
    )
  })

  elements.addToFolderCancelButton.addEventListener("click", () => {
    const folderName = elements.newFolderInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"
    if (folderName && !uiState.folders.some((f) => f.title === folderName)) {
      if (confirm(translations[language].discardFolderPrompt)) {
        elements.addToFolderPopup.classList.add("hidden")
        elements.newFolderInput.value = ""
        elements.newFolderInput.classList.remove("error")
        elements.newFolderInput.placeholder =
          translations[language].newFolderPlaceholder
      }
    } else {
      elements.addToFolderPopup.classList.add("hidden")
      elements.newFolderInput.value = ""
      elements.newFolderInput.classList.remove("error")
      elements.newFolderInput.placeholder =
        translations[language].newFolderPlaceholder
    }
  })

  elements.addToFolderPopup.addEventListener("click", (e) => {
    if (e.target === elements.addToFolderPopup) {
      elements.addToFolderCancelButton.click()
    }
  })

  elements.newFolderInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      elements.createNewFolderButton.click()
    }
  })

  elements.newFolderInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      elements.addToFolderCancelButton.click()
    }
  })

  elements.addToFolderSelect.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      elements.addToFolderSaveButton.click()
    }
  })

  elements.addToFolderSelect.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      elements.addToFolderCancelButton.click()
    }
  })

  elements.searchInput.addEventListener(
    "input",
    debounce((e) => {
      uiState.searchQuery = e.target.value.toLowerCase()
      uiState.selectedFolderId = elements.folderFilter.value
      uiState.sortType = elements.sortFilter.value || "default"
      let filtered = uiState.bookmarks
      if (uiState.selectedFolderId) {
        filtered = filtered.filter((bookmark) =>
          isInFolder(bookmark, uiState.selectedFolderId)
        )
      }
      if (uiState.searchQuery) {
        filtered = filtered.filter(
          (bookmark) =>
            bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
            bookmark.url?.toLowerCase().includes(uiState.searchQuery)
        )
      }
      renderFilteredBookmarks(uiState.bookmarkTree, elements)
      saveUIState()
    }, 150)
  )

  elements.clearSearchButton.addEventListener("click", () => {
    elements.searchInput.value = ""
    uiState.searchQuery = ""
    let filtered = uiState.bookmarks
    if (uiState.selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, uiState.selectedFolderId)
      )
    }
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
    saveUIState()
  })

  elements.folderFilter.addEventListener("change", () => {
    uiState.searchQuery = elements.searchInput.value.toLowerCase()
    uiState.selectedFolderId = elements.folderFilter.value
    uiState.sortType = elements.sortFilter.value || "default"
    let filtered = uiState.bookmarks
    if (uiState.selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, uiState.selectedFolderId)
      )
    }
    if (uiState.searchQuery) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
          bookmark.url?.toLowerCase().includes(uiState.searchQuery)
      )
    }
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
    saveUIState()
  })

  elements.sortFilter.addEventListener("change", () => {
    uiState.searchQuery = elements.searchInput.value.toLowerCase()
    uiState.selectedFolderId = elements.folderFilter.value
    uiState.sortType = elements.sortFilter.value || "default"
    let filtered = uiState.bookmarks
    if (uiState.selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, uiState.selectedFolderId)
      )
    }
    if (uiState.searchQuery) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
          bookmark.url?.toLowerCase().includes(uiState.searchQuery)
      )
    }
    renderFilteredBookmarks(uiState.bookmarkTree, elements)
    saveUIState()
  })

  // Nút mở popup tạo folder
  elements.createFolderSave.addEventListener("click", () => {
    const folderName = createFolderInput.value.trim()
    if (!folderName) {
      closeCreateFolderPopup()
      return
    }

    // Lấy cây bookmark rồi check trùng
    getBookmarkTree((bookmarkTreeNodes) => {
      if (!bookmarkTreeNodes) return

      // Tìm parent folder có id = "2"
      const parentFolder = findNodeById(bookmarkTreeNodes[0], "2")

      if (parentFolder && parentFolder.children) {
        const isDuplicate = parentFolder.children.some(
          (child) => child.title.toLowerCase() === folderName.toLowerCase()
        )

        if (isDuplicate) {
          alert("A folder with this name already exists!")
          return
        }
      }

      // Nếu không trùng thì tạo mới
      safeChromeBookmarksCall(
        "create",
        [{ parentId: "2", title: folderName }],
        () => {
          getBookmarkTree((bookmarkTreeNodes) => {
            if (bookmarkTreeNodes) {
              renderFilteredBookmarks(bookmarkTreeNodes, elements)
            }
          })
        }
      )
    })

    closeCreateFolderPopup()
  })

  // Helper: tìm node theo id trong cây
  function findNodeById(node, id) {
    if (node.id === id) return node
    if (node.children) {
      for (const child of node.children) {
        const found = findNodeById(child, id)
        if (found) return found
      }
    }
    return null
  }

  attachDropdownListeners(elements) // Initial attachment
}

export function attachDropdownListeners(elements) {
  console.log("Attaching dropdown listeners") // Debug log
  const dropdownButtons = document.querySelectorAll(".dropdown-btn")
  console.log("Found dropdown buttons:", dropdownButtons.length) // Debug log

  dropdownButtons.forEach((button) => {
    button.removeEventListener("click", handleDropdownClick) // Prevent duplicate listeners
    button.addEventListener("click", handleDropdownClick)
  })

  document.querySelectorAll(".add-to-folder").forEach((button) => {
    button.removeEventListener("click", handleAddToFolder)
    button.addEventListener("click", handleAddToFolder)
  })

  document.querySelectorAll(".delete-btn").forEach((button) => {
    button.removeEventListener("click", handleDeleteBookmark)
    button.addEventListener("click", handleDeleteBookmark)
  })

  document.querySelectorAll(".rename-btn").forEach((button) => {
    button.removeEventListener("click", handleRenameBookmark)
    button.addEventListener("click", handleRenameBookmark)
  })

  document.querySelectorAll(".bookmark-checkbox").forEach((checkbox) => {
    checkbox.removeEventListener("change", handleBookmarkCheckbox)
    checkbox.addEventListener("change", handleBookmarkCheckbox)
  })

  function handleDropdownClick(e) {
    e.stopPropagation()
    const menu = e.target.nextElementSibling
    console.log("Dropdown button clicked, menu:", menu) // Debug log
    if (!menu || !menu.classList.contains("dropdown-menu")) {
      console.error("Dropdown menu not found for button:", e.target)
      return
    }
    const isMenuOpen = !menu.classList.contains("hidden")
    console.log("Menu open status before toggle:", isMenuOpen) // Debug log

    // Close all other dropdowns
    document.querySelectorAll(".dropdown-menu").forEach((m) => {
      if (m !== menu) m.classList.add("hidden")
    })

    // Toggle the current menu
    menu.classList.toggle("hidden")
    console.log(
      "Menu open status after toggle:",
      !menu.classList.contains("hidden")
    ) // Debug log
  }

  function handleAddToFolder(e) {
    const bookmarkId = e.target.dataset.id
    selectedBookmarks.clear()
    selectedBookmarks.add(bookmarkId)
    elements.addToFolderButton.click()
  }

  function handleDeleteBookmark(e) {
    const bookmarkId = e.target.dataset.id
    const language = localStorage.getItem("appLanguage") || "en"
    if (confirm(translations[language].deleteConfirm)) {
      safeChromeBookmarksCall("remove", [bookmarkId], () => {
        getBookmarkTree((bookmarkTreeNodes) => {
          if (bookmarkTreeNodes) {
            renderFilteredBookmarks(bookmarkTreeNodes, elements)
            alert(translations[language].deleteBookmarkSuccess)
          }
        })
      })
    }
  }
  let currentBookmarkId // Optional: only if global state is needed

  function setCurrentBookmarkId(id) {
    currentBookmarkId = id // Optional: only if global state is needed
  }

  function handleRenameBookmark(e) {
    const bookmarkId = e.target.dataset.id // Use local variable
    if (!bookmarkId) {
      console.error("Bookmark ID is undefined")
      return
    }

    const language = localStorage.getItem("appLanguage") || "en"
    elements.renameInput.value = ""
    elements.renameInput.classList.remove("error")
    elements.renameInput.placeholder = translations[language].renamePlaceholder
    elements.renamePopup.classList.remove("hidden")
    elements.renameInput.focus()

    safeChromeBookmarksCall("get", [bookmarkId], (bookmark) => {
      if (bookmark && bookmark[0]) {
        elements.renameInput.value = bookmark[0].title || ""
      } else {
        console.error("Bookmark not found for ID:", bookmarkId)
      }
    })
  }

  function handleBookmarkCheckbox(e) {
    const bookmarkId = e.target.dataset.id
    if (e.target.checked) {
      selectedBookmarks.add(bookmarkId)
    } else {
      selectedBookmarks.delete(bookmarkId)
    }
    elements.addToFolderButton.classList.toggle(
      "hidden",
      selectedBookmarks.size === 0
    )
  }
}

function populateAddToFolderSelect(elements) {
  const language = localStorage.getItem("appLanguage") || "en"
  elements.addToFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
  uiState.folders.forEach((folder) => {
    const option = document.createElement("option")
    option.value = folder.id
    option.textContent = folder.title
    elements.addToFolderSelect.appendChild(option)
  })
}
//  chuẩn bị tách code add folder button lớn
const createFolderBtn = document.getElementById("create-folder")
const createFolderPopup = document.getElementById("create-folder-popup")
const createFolderInput = document.getElementById("create-folder-input")
const createFolderSave = document.getElementById("create-folder-save")
const createFolderCancel = document.getElementById("create-folder-cancel")
const clearCreateFolder = document.getElementById("clear-create-folder")

function openCreateFolderPopup(placeholder) {
  createFolderInput.value = ""
  createFolderInput.placeholder = placeholder
  createFolderPopup.classList.remove("hidden")
  createFolderInput.focus()
}

function closeCreateFolderPopup() {
  createFolderPopup.classList.add("hidden")
}

// Nút mở popup
createFolderBtn.addEventListener("click", () => {
  const language = localStorage.getItem("appLanguage") || "en"
  openCreateFolderPopup(translations[language].newFolderPlaceholder)
})

// Nút Save
createFolderSave.addEventListener("click", () => {
  const folderName = createFolderInput.value.trim()
  if (folderName) {
    safeChromeBookmarksCall(
      "create",
      [{ parentId: "2", title: folderName }],
      () => {
        getBookmarkTree((bookmarkTreeNodes) => {
          if (bookmarkTreeNodes) {
            renderFilteredBookmarks(bookmarkTreeNodes, elements)
          }
        })
      }
    )
  }
  closeCreateFolderPopup()
})

// Nút Cancel
createFolderCancel.addEventListener("click", closeCreateFolderPopup)

// Nút Clear input
clearCreateFolder.addEventListener("click", () => {
  createFolderInput.value = ""
  createFolderInput.focus()
})

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search")
  const clearSearchButton = document.getElementById("clear-search")
  const folderFilter = document.getElementById("folder-filter")
  const sortFilter = document.getElementById("sort-filter")
  const createFolderButton = document.getElementById("create-folder")
  const addToFolderButton = document.getElementById("add-to-folder")
  const deleteFolderButton = document.getElementById("delete-folder")
  const toggleCheckboxesButton = document.getElementById("toggle-checkboxes")
  const folderListDiv = document.getElementById("folder-list")
  const bookmarkCountDiv = document.getElementById("bookmark-count")
  const scrollToTopButton = document.getElementById("scroll-to-top")
  const clearRenameButton = document.getElementById("clear-rename")
  const addToFolderPopup = document.getElementById("add-to-folder-popup")
  const addToFolderSelect = document.getElementById("add-to-folder-select")
  const newFolderInput = document.getElementById("new-folder-input")
  const createNewFolderButton = document.getElementById("create-new-folder")
  const addToFolderSaveButton = document.getElementById("add-to-folder-save")
  const addToFolderCancelButton = document.getElementById(
    "add-to-folder-cancel"
  )

  let bookmarks = []
  let folders = []
  let selectedBookmarks = new Set()
  let bookmarkTree = []
  let checkboxesVisible = false
  let currentBookmarkId = null

  let uiState = {
    searchQuery: "",
    selectedFolderId: "",
    sortType: "default",
  }

  function updateTheme() {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.classList.toggle("light-theme", !isDarkMode)
    document.body.classList.toggle("dark-theme", isDarkMode)
    folderListDiv.classList.toggle("light-theme", !isDarkMode)
    folderListDiv.classList.toggle("dark-theme", isDarkMode)
    bookmarkCountDiv.classList.toggle("light-theme", !isDarkMode)
    bookmarkCountDiv.classList.toggle("dark-theme", isDarkMode)
    document.querySelectorAll(".input, .select, .button").forEach((el) => {
      el.classList.toggle("light-theme", !isDarkMode)
      el.classList.toggle("dark-theme", isDarkMode)
    })
  }
  updateTheme()
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", updateTheme)

  toggleCheckboxesButton.addEventListener("click", () => {
    checkboxesVisible = !checkboxesVisible
    toggleCheckboxesButton.textContent = checkboxesVisible
      ? "Hide Checkboxes"
      : "Show Checkboxes"
    document
      .querySelectorAll(".bookmark-checkbox, .select-all input")
      .forEach((checkbox) => {
        checkbox.style.display = checkboxesVisible ? "inline-block" : "none"
      })
    if (!checkboxesVisible) {
      selectedBookmarks.clear()
      addToFolderButton.classList.add("hidden")
      document.querySelectorAll(".bookmark-checkbox").forEach((cb) => {
        cb.checked = false
      })
    }
  })

  scrollToTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  })

  scrollToTopButton.classList.add("hidden")
  window.addEventListener("scroll", () => {
    scrollToTopButton.classList.toggle("hidden", window.scrollY <= 0)
  })

  document.getElementById("rename-save").addEventListener("click", () => {
    const renameInput = document.getElementById("rename-input")
    const newTitle = renameInput.value.trim()
    if (newTitle && currentBookmarkId) {
      chrome.bookmarks.update(currentBookmarkId, { title: newTitle }, () => {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          bookmarkTree = bookmarkTreeNodes
          bookmarks = flattenBookmarks(bookmarkTreeNodes)
          folders = getFolders(bookmarkTreeNodes)
          populateFolderFilter(folders)
          updateBookmarkCount()
          renderAllBookmarks(bookmarks)
        })
        document.getElementById("rename-popup").classList.add("hidden")
        currentBookmarkId = null
      })
    } else if (!newTitle) {
      renameInput.classList.add("error")
      renameInput.placeholder = "Title cannot be empty"
    }
  })

  document.getElementById("rename-cancel").addEventListener("click", () => {
    document.getElementById("rename-popup").classList.add("hidden")
    document.getElementById("rename-input").classList.remove("error")
    document.getElementById("rename-input").value = ""
    currentBookmarkId = null
  })

  document.getElementById("rename-input").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("rename-save").click()
    }
  })

  document.getElementById("rename-input").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.getElementById("rename-cancel").click()
    }
  })

  document.getElementById("rename-popup").addEventListener("click", (e) => {
    if (e.target === document.getElementById("rename-popup")) {
      document.getElementById("rename-cancel").click()
    }
  })

  clearRenameButton.addEventListener("click", () => {
    const renameInput = document.getElementById("rename-input")
    renameInput.value = ""
    renameInput.classList.remove("error")
    renameInput.placeholder = "Enter new name..."
    renameInput.focus()
  })

  function toggleDeleteFolderButton() {
    deleteFolderButton.classList.toggle(
      "hidden",
      !uiState.selectedFolderId ||
        uiState.selectedFolderId === "1" ||
        uiState.selectedFolderId === "2"
    )
  }

  // Cập nhật logic xóa folder
  deleteFolderButton.addEventListener("click", () => {
    if (
      uiState.selectedFolderId &&
      uiState.selectedFolderId !== "1" &&
      uiState.selectedFolderId !== "2"
    ) {
      if (
        confirm(
          "Are you sure you want to delete this folder? Bookmarks that exist in other folders will be preserved."
        )
      ) {
        chrome.bookmarks.getSubTree(uiState.selectedFolderId, (subTree) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError)
            return
          }

          const folderNode = subTree[0]
          const bookmarksToCheck = folderNode.children
            ? folderNode.children.filter((node) => node.url)
            : []

          // Lấy danh sách tất cả bookmark trong cây
          chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            const allBookmarks = flattenBookmarks(bookmarkTreeNodes)

            // Kiểm tra từng bookmark trong folder
            const bookmarksToDelete = []
            bookmarksToCheck.forEach((bookmark) => {
              // Tìm các bookmark có URL trùng lặp ở folder khác
              const duplicates = allBookmarks.filter(
                (b) =>
                  b.url === bookmark.url &&
                  b.id !== bookmark.id &&
                  b.parentId !== uiState.selectedFolderId
              )

              if (duplicates.length === 0) {
                // Nếu không có bản sao ở folder khác, đánh dấu để xóa
                bookmarksToDelete.push(bookmark.id)
              }
            })

            // Xóa từng bookmark không có bản sao
            let deletePromises = bookmarksToDelete.map((bookmarkId) => {
              return new Promise((resolve) => {
                chrome.bookmarks.remove(bookmarkId, () => {
                  if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError)
                  }
                  resolve()
                })
              })
            })

            // Sau khi xóa các bookmark, xóa folder
            Promise.all(deletePromises).then(() => {
              chrome.bookmarks.remove(uiState.selectedFolderId, () => {
                if (!chrome.runtime.lastError) {
                  uiState.selectedFolderId = ""
                  folderFilter.value = ""
                  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
                    bookmarkTree = bookmarkTreeNodes
                    bookmarks = flattenBookmarks(bookmarkTreeNodes)
                    folders = getFolders(bookmarkTreeNodes)
                    populateFolderFilter(folders)
                    updateBookmarkCount()
                    renderAllBookmarks(bookmarks)
                    toggleDeleteFolderButton()
                  })
                }
              })
            })
          })
        })
      }
    }
  })

  function populateAddToFolderSelect() {
    addToFolderSelect.innerHTML = '<option value="">Select Folder</option>'
    folders.forEach((folder) => {
      const option = document.createElement("option")
      option.value = folder.id
      option.textContent = folder.title
      addToFolderSelect.appendChild(option)
    })
  }

  addToFolderButton.addEventListener("click", () => {
    if (selectedBookmarks.size > 0) {
      populateAddToFolderSelect()
      newFolderInput.value = ""
      newFolderInput.classList.remove("error")
      addToFolderPopup.classList.remove("hidden")
      addToFolderSelect.focus()
    }
  })

  addToFolderSaveButton.addEventListener("click", () => {
    const targetFolderId = addToFolderSelect.value
    if (targetFolderId) {
      selectedBookmarks.forEach((bookmarkId) => {
        chrome.bookmarks.move(bookmarkId, { parentId: targetFolderId }, () => {
          chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            bookmarkTree = bookmarkTreeNodes
            bookmarks = flattenBookmarks(bookmarkTreeNodes)
            folders = getFolders(bookmarkTreeNodes)
            populateFolderFilter(folders)
            updateBookmarkCount()
            renderAllBookmarks(bookmarks)
            selectedBookmarks.clear()
            addToFolderButton.classList.add("hidden")
            toggleDeleteFolderButton()
          })
        })
      })
      addToFolderPopup.classList.add("hidden")
    } else {
      newFolderInput.classList.add("error")
      newFolderInput.placeholder = "Select a folder or create a new one"
    }
  })

  createNewFolderButton.addEventListener("click", () => {
    const folderName = newFolderInput.value.trim()
    if (folderName) {
      chrome.bookmarks.create(
        { parentId: "2", title: folderName },
        (newFolder) => {
          chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            bookmarkTree = bookmarkTreeNodes
            bookmarks = flattenBookmarks(bookmarkTreeNodes)
            folders = getFolders(bookmarkTreeNodes)
            populateFolderFilter(folders)
            populateAddToFolderSelect()
            newFolderInput.value = ""
            newFolderInput.classList.remove("error")
            addToFolderSelect.value = newFolder.id
          })
        }
      )
    } else {
      newFolderInput.classList.add("error")
      newFolderInput.placeholder = "Folder name cannot be empty"
    }
  })

  addToFolderCancelButton.addEventListener("click", () => {
    addToFolderPopup.classList.add("hidden")
    newFolderInput.value = ""
    newFolderInput.classList.remove("error")
    newFolderInput.placeholder = "Or enter new folder name..."
  })

  addToFolderPopup.addEventListener("click", (e) => {
    if (e.target === addToFolderPopup) {
      addToFolderCancelButton.click()
    }
  })

  newFolderInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      createNewFolderButton.click()
    }
  })

  newFolderInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      addToFolderCancelButton.click()
    }
  })

  addToFolderSelect.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addToFolderSaveButton.click()
    }
  })

  addToFolderSelect.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      addToFolderCancelButton.click()
    }
  })

  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    bookmarkTree = bookmarkTreeNodes
    bookmarks = flattenBookmarks(bookmarkTreeNodes)
    folders = getFolders(bookmarkTreeNodes)
    populateFolderFilter(folders)
    updateBookmarkCount()
    renderAllBookmarks(bookmarks)
    toggleDeleteFolderButton()
  })

  function flattenBookmarks(nodes) {
    let flat = []
    nodes.forEach((node) => {
      if (node.url) {
        flat.push(node)
      }
      if (node.children) {
        flat = flat.concat(flattenBookmarks(node.children))
      }
    })
    return flat
  }

  function getFolders(nodes) {
    let folderList = []
    nodes.forEach((node) => {
      if (node.children) {
        folderList.push({ id: node.id, title: node.title || "Unnamed Folder" })
        folderList = folderList.concat(getFolders(node.children))
      }
    })
    return folderList
  }

  function populateFolderFilter(folders) {
    folderFilter.innerHTML = '<option value="">All Bookmarks</option>'
    folders.forEach((folder) => {
      const option = document.createElement("option")
      option.value = folder.id
      option.textContent = folder.title
      folderFilter.appendChild(option)
    })
    folderFilter.value = uiState.selectedFolderId
  }

  function updateBookmarkCount() {
    const selectedFolderId = folderFilter.value
    let count
    if (selectedFolderId) {
      count = bookmarks.filter(
        (b) => b.url && isInFolder(b, selectedFolderId)
      ).length
    } else {
      count = bookmarks.filter((b) => b.url).length
    }
    bookmarkCountDiv.textContent = `Total Bookmarks: ${count}`
  }

  function findParentFolder(bookmarkId, nodes) {
    for (const node of nodes) {
      if (node.children) {
        if (node.children.some((child) => child.id === bookmarkId)) {
          return node
        }
        const found = findParentFolder(bookmarkId, node.children)
        if (found) return found
      }
    }
    return null
  }

  function sortBookmarks(bookmarksList, sortType) {
    let sorted = [...bookmarksList]
    switch (sortType) {
      case "default":
        sorted.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
        break
      case "new":
        sorted.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
        break
      case "old":
        sorted.sort((a, b) => (a.dateAdded || 0) - (b.dateAdded || 0))
        break
      case "last-opened":
        sorted.sort((a, b) => {
          const parentA = findParentFolder(a.id, bookmarkTree) || {}
          const parentB = findParentFolder(b.id, bookmarkTree) || {}
          const dateA = parentA.dateGroupModified || a.dateAdded || 0
          const dateB = parentB.dateGroupModified || b.dateAdded || 0
          return dateB - dateA
        })
        break
      case "a-z":
        sorted.sort((a, b) =>
          (a.title || a.url).localeCompare(b.title || b.url)
        )
        break
      case "z-a":
        sorted.sort((a, b) =>
          (b.title || b.url).localeCompare(a.title || b.url)
        )
        break
      default:
        sorted.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
        break
    }
    return sorted
  }

  function handleRenameBookmark(e) {
    currentBookmarkId = e.target.dataset.id
    const renamePopup = document.getElementById("rename-popup")
    const renameInput = document.getElementById("rename-input")
    renameInput.value = ""
    renameInput.classList.remove("error")
    renameInput.placeholder = "Enter new name..."
    renamePopup.classList.remove("hidden")
    renameInput.focus()
    chrome.bookmarks.get(currentBookmarkId, (bookmark) => {
      if (bookmark && bookmark[0]) {
        renameInput.value = bookmark[0].title || ""
      }
    })
  }

  function attachDropdownListeners() {
    document.querySelectorAll(".dropdown-btn").forEach((button) => {
      button.removeEventListener("click", handleDropdownClick)
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
      const menu = e.target.nextElementSibling
      if (menu) {
        menu.classList.toggle("hidden")
      }
    }

    function handleAddToFolder(e) {
      const bookmarkId = e.target.dataset.id
      selectedBookmarks.clear()
      selectedBookmarks.add(bookmarkId)
      addToFolderButton.click()
    }

    function handleDeleteBookmark(e) {
      const bookmarkId = e.target.dataset.id
      if (confirm("Are you sure you want to delete this bookmark?")) {
        chrome.bookmarks.remove(bookmarkId, () => {
          chrome.bookmarks.getTree((bookmarkTreeNodes) => {
            bookmarkTree = bookmarkTreeNodes
            bookmarks = flattenBookmarks(bookmarkTreeNodes)
            folders = getFolders(bookmarkTreeNodes)
            populateFolderFilter(folders)
            updateBookmarkCount()
            renderAllBookmarks(bookmarks)
          })
        })
      }
    }

    function handleBookmarkCheckbox(e) {
      const bookmarkId = e.target.dataset.id
      if (e.target.checked) {
        selectedBookmarks.add(bookmarkId)
      } else {
        selectedBookmarks.delete(bookmarkId)
      }
      addToFolderButton.classList.toggle("hidden", selectedBookmarks.size === 0)
    }
  }

  function createBookmarkElement(bookmark) {
    const item = document.createElement("div")
    item.className = "bookmark-item"
    const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
      new URL(bookmark.url).hostname
    }`
    item.innerHTML = `
      <input type="checkbox" class="bookmark-checkbox" data-id="${
        bookmark.id
      }" style="display: ${checkboxesVisible ? "inline-block" : "none"}">
      <img src="${favicon}" alt="favicon" class="favicon">
      <a href="${bookmark.url}" target="_blank" class="link">${
      bookmark.title || bookmark.url
    }</a>
      <div class="dropdown-btn-group">
        <button class="dropdown-btn" data-id="${bookmark.id}">⋮</button>
        <div class="dropdown-menu hidden">
          <button class="menu-item add-to-folder" data-id="${
            bookmark.id
          }">Add to Folder</button>
          <button class="menu-item delete-btn" data-id="${
            bookmark.id
          }">Delete</button>
          <button class="menu-item rename-btn" data-id="${
            bookmark.id
          }">Rename</button>
        </div>
      </div>
    `
    return item
  }

  function renderAllBookmarks(bookmarksList) {
    uiState.sortType = sortFilter.value || "default"
    uiState.searchQuery = searchInput.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value

    const sortedBookmarks = sortBookmarks(bookmarksList, uiState.sortType)

    sortedBookmarks.forEach((bookmark) => {
      if (bookmark.url) {
        const div = document.createElement("div")
        div.className = "bookmark-item"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        div.innerHTML = `
          <input type="checkbox" class="bookmark-checkbox" data-id="${
            bookmark.id
          }" ${
          selectedBookmarks.has(bookmark.id) ? "checked" : ""
        } style="display: ${checkboxesVisible ? "inline-block" : "none"}">
          <img src="${favicon}" alt="favicon" class="favicon">
          <a href="${bookmark.url}" target="_blank" class="link">${
          bookmark.title || bookmark.url
        }</a>
          <div class="dropdown-btn-group">
            <button class="dropdown-btn">⋮</button>
            <div class="dropdown-menu hidden">
              <button class="menu-item add-to-folder" data-id="${
                bookmark.id
              }">Add to Folder</button>
              <button class="menu-item delete-btn" data-id="${
                bookmark.id
              }">Delete</button>
              <button class="menu-item rename-btn" data-id="${
                bookmark.id
              }">Rename</button>
            </div>
          </div>
        `
        folderListDiv.appendChild(div)
      }
    })

    searchInput.value = uiState.searchQuery
    folderFilter.value = uiState.selectedFolderId
    sortFilter.value = uiState.sortType

    const selectAllCheckbox = document.getElementById("select-all")
    selectAllCheckbox.removeEventListener("change", handleSelectAll)
    selectAllCheckbox.addEventListener("change", handleSelectAll)

    attachDropdownListeners()
    toggleDeleteFolderButton()

    function handleSelectAll(e) {
      const checkboxes = document.querySelectorAll(".bookmark-checkbox")
      if (e.target.checked) {
        checkboxes.forEach((cb) => {
          const bookmarkId = cb.dataset.id
          cb.checked = true
          selectedBookmarks.add(bookmarkId)
        })
      } else {
        checkboxes.forEach((cb) => {
          cb.checked = false
          selectedBookmarks.clear()
        })
      }
      addToFolderButton.classList.toggle("hidden", selectedBookmarks.size === 0)
    }
  }

  function renderFolderList(nodes) {
    uiState.sortType = sortFilter.value || "default"
    uiState.searchQuery = searchInput.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value

    const sortedBookmarks = sortBookmarks(
      flattenBookmarks(nodes).filter((b) => b.url),
      uiState.sortType
    )
    folderListDiv.innerHTML = `
      <div class="select-all">
        <input type="checkbox" id="select-all" style="display: ${
          checkboxesVisible ? "inline-block" : "none"
        }">
        <label for="select-all">Select All</label>
      </div>
    `
    const topFolders = nodes.filter(
      (node) => node.children && ["1", "2"].includes(node.id)
    )
    topFolders.forEach((folder) => {
      const div = document.createElement("div")
      div.className = "folder-item"

      const folderButton = document.createElement("button")
      folderButton.className = "folder-button"
      folderButton.textContent = folder.title
      folderButton.addEventListener("click", () => {
        const dropdown = div.querySelector(".dropdown")
        if (dropdown) {
          dropdown.classList.toggle("hidden")
        }
      })

      const dropdown = document.createElement("div")
      dropdown.className = "dropdown hidden"
      sortedBookmarks.forEach((bookmark) => {
        const bookmarkDiv = document.createElement("div")
        bookmarkDiv.className = "bookmark-item"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        bookmarkDiv.innerHTML = `
          <input type="checkbox" class="bookmark-checkbox" data-id="${
            bookmark.id
          }" ${
          selectedBookmarks.has(bookmark.id) ? "checked" : ""
        } style="display: ${checkboxesVisible ? "inline-block" : "none"}">
          <img src="${favicon}" alt="favicon" class="favicon">
          <a href="${bookmark.url}" target="_blank" class="link">${
          bookmark.title || bookmark.url
        }</a>
          <div class="dropdown-btn-group">
            <button class="dropdown-btn">⋮</button>
            <div class="dropdown-menu hidden">
              <button class="menu-item add-to-folder" data-id="${
                bookmark.id
              }">Add to Folder</button>
              <button class="menu-item delete-btn" data-id="${
                bookmark.id
              }">Delete</button>
              <button class="menu-item rename-btn" data-id="${
                bookmark.id
              }">Rename</button>
            </div>
          </div>
        `
        dropdown.appendChild(bookmarkDiv)
      })

      if (!["1", "2"].includes(folder.id)) {
        const deleteFolderBtn = document.createElement("button")
        deleteFolderBtn.className = "delete-folder"
        deleteFolderBtn.textContent = "Delete Folder"
        deleteFolderBtn.addEventListener("click", () => {
          if (
            confirm(
              "Are you sure you want to delete this folder and its contents?"
            )
          ) {
            chrome.bookmarks.removeTree(folder.id, () => {
              if (!chrome.runtime.lastError) {
                chrome.bookmarks.getTree((bookmarkTreeNodes) => {
                  bookmarkTree = bookmarkTreeNodes
                  bookmarks = flattenBookmarks(bookmarkTreeNodes)
                  folders = getFolders(bookmarkTreeNodes)
                  populateFolderFilter(folders)
                  updateBookmarkCount()
                  renderAllBookmarks(bookmarks)
                })
              }
            })
          }
        })
        folderButton.appendChild(deleteFolderBtn)
      }

      div.appendChild(folderButton)
      div.appendChild(dropdown)
      folderListDiv.appendChild(div)
    })

    searchInput.value = uiState.searchQuery
    folderFilter.value = uiState.selectedFolderId
    sortFilter.value = uiState.sortType

    const selectAllCheckbox = document.getElementById("select-all")
    selectAllCheckbox.removeEventListener("change", handleSelectAll)
    selectAllCheckbox.addEventListener("change", handleSelectAll)

    attachDropdownListeners()
    toggleDeleteFolderButton()

    function handleSelectAll(e) {
      const checkboxes = document.querySelectorAll(".bookmark-checkbox")
      if (e.target.checked) {
        checkboxes.forEach((cb) => {
          const bookmarkId = cb.dataset.id
          cb.checked = true
          selectedBookmarks.add(bookmarkId)
        })
      } else {
        checkboxes.forEach((cb) => {
          cb.checked = false
          selectedBookmarks.clear()
        })
      }
      addToFolderButton.classList.toggle("hidden", selectedBookmarks.size === 0)
    }
  }

  searchInput.addEventListener("input", (e) => {
    uiState.searchQuery = e.target.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value
    uiState.sortType = sortFilter.value || "default"

    let filtered = bookmarks
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
    renderFilteredBookmarks(filtered, uiState.sortType)
    toggleDeleteFolderButton()
  })

  if (clearSearchButton) {
    clearSearchButton.addEventListener("click", () => {
      searchInput.value = ""
      uiState.searchQuery = ""
      let filtered = bookmarks
      if (uiState.selectedFolderId) {
        filtered = filtered.filter((bookmark) =>
          isInFolder(bookmark, uiState.selectedFolderId)
        )
      }
      renderFilteredBookmarks(filtered, uiState.sortType)
      toggleDeleteFolderButton()
    })
  }

  folderFilter.addEventListener("change", () => {
    uiState.searchQuery = searchInput.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value
    uiState.sortType = sortFilter.value || "default"

    let filtered = bookmarks
    if (uiState.selectedFolderId === "") {
      renderAllBookmarks(bookmarks)
    } else if (uiState.selectedFolderId) {
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
    renderFilteredBookmarks(filtered, uiState.sortType)
    updateBookmarkCount()
    toggleDeleteFolderButton()
  })

  sortFilter.addEventListener("change", () => {
    uiState.searchQuery = searchInput.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value
    uiState.sortType = sortFilter.value || "default"

    let filtered = bookmarks
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
    if (uiState.selectedFolderId || uiState.searchQuery) {
      renderFilteredBookmarks(filtered, uiState.sortType)
    } else {
      renderAllBookmarks(bookmarks)
    }
    updateBookmarkCount()
    toggleDeleteFolderButton()
  })

  createFolderButton.addEventListener("click", () => {
    const folderName = prompt("Enter folder name:")
    if (folderName) {
      chrome.bookmarks.create({ parentId: "2", title: folderName }, () => {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
          bookmarkTree = bookmarkTreeNodes
          bookmarks = flattenBookmarks(bookmarkTreeNodes)
          folders = getFolders(bookmarkTreeNodes)
          populateFolderFilter(folders)
          updateBookmarkCount()
          renderAllBookmarks(bookmarks)
          toggleDeleteFolderButton()
        })
      })
    }
  })

  function isInFolder(bookmark, folderId) {
    let node = bookmark
    while (node.parentId) {
      if (node.parentId === folderId) return true
      node = bookmarks.find((b) => b.id === node.parentId) || { parentId: null }
    }
    return false
  }

  function renderFilteredBookmarks(filtered, sortType) {
    const sortedBookmarks = sortBookmarks(filtered, sortType)
    folderListDiv.innerHTML = `
      <div class="select-all">
        <input type="checkbox" id="select-all" style="display: ${
          checkboxesVisible ? "inline-block" : "none"
        }">
        <label for="select-all">Select All</label>
      </div>
    `
    sortedBookmarks.forEach((bookmark) => {
      if (bookmark.url) {
        const div = document.createElement("div")
        div.className = "bookmark-item"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        div.innerHTML = `
          <input type="checkbox" class="bookmark-checkbox" data-id="${
            bookmark.id
          }" ${
          selectedBookmarks.has(bookmark.id) ? "checked" : ""
        } style="display: ${checkboxesVisible ? "inline-block" : "none"}">
          <img src="${favicon}" alt="favicon" class="favicon">
          <a href="${bookmark.url}" target="_blank" class="link">${
          bookmark.title || bookmark.url
        }</a>
          <div class="dropdown-btn-group">
            <button class="dropdown-btn">⋮</button>
            <div class="dropdown-menu hidden">
              <button class="menu-item add-to-folder" data-id="${
                bookmark.id
              }">Add to Folder</button>
              <button class="menu-item delete-btn" data-id="${
                bookmark.id
              }">Delete</button>
              <button class="menu-item rename-btn" data-id="${
                bookmark.id
              }">Rename</button>
            </div>
          </div>
        `
        folderListDiv.appendChild(div)
      }
    })

    searchInput.value = uiState.searchQuery
    folderFilter.value = uiState.selectedFolderId
    sortFilter.value = uiState.sortType

    const selectAllCheckbox = document.getElementById("select-all")
    selectAllCheckbox.removeEventListener("change", handleSelectAll)
    selectAllCheckbox.addEventListener("change", handleSelectAll)

    attachDropdownListeners()
    toggleDeleteFolderButton()

    function handleSelectAll(e) {
      const checkboxes = document.querySelectorAll(".bookmark-checkbox")
      if (e.target.checked) {
        checkboxes.forEach((cb) => {
          const bookmarkId = cb.dataset.id
          cb.checked = true
          selectedBookmarks.add(bookmarkId)
        })
      } else {
        checkboxes.forEach((cb) => {
          cb.checked = false
          selectedBookmarks.clear()
        })
      }
      addToFolderButton.classList.toggle("hidden", selectedBookmarks.size === 0)
    }
  }
})

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search")
  const clearSearchButton = document.getElementById("clear-search")
  const folderFilter = document.getElementById("folder-filter")
  const sortFilter = document.getElementById("sort-filter")
  const createFolderButton = document.getElementById("create-folder")
  const addToFolderButton = document.getElementById("add-to-folder")
  const folderListDiv = document.getElementById("folder-list")
  const bookmarkCountDiv = document.getElementById("bookmark-count")

  let bookmarks = []
  let folders = []
  let selectedBookmarks = new Set()
  let bookmarkTree = []

  // Store UI state
  let uiState = {
    searchQuery: "",
    selectedFolderId: "",
    sortType: "default",
  }

  // Detect and apply system theme
  function updateTheme() {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.classList.toggle("light-theme", !isDarkMode)
    document.body.classList.toggle("dark-theme", isDarkMode)
    folderListDiv.classList.toggle("light-theme", !isDarkMode)
    folderListDiv.classList.toggle("dark-theme", isDarkMode)
    bookmarkCountDiv.classList.toggle("light-theme", !isDarkMode)
    bookmarkCountDiv.classList.toggle("dark-theme", isDarkMode)
    // Apply theme to input and select elements
    document.querySelectorAll(".input, .select, .button").forEach((el) => {
      el.classList.toggle("light-theme", !isDarkMode)
      el.classList.toggle("dark-theme", isDarkMode)
    })
  }
  updateTheme()
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", updateTheme)

  // Fetch bookmarks from Chrome API
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    bookmarkTree = bookmarkTreeNodes
    bookmarks = flattenBookmarks(bookmarkTreeNodes)
    folders = getFolders(bookmarkTreeNodes)
    populateFolderFilter(folders)
    updateBookmarkCount()
    renderAllBookmarks(bookmarks)
  })

  // Flatten bookmarks for search
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

  // Get all folders
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

  // Populate folder dropdown
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

  // Update bookmark count based on selected folder
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

  // Find parent folder for a bookmark
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

  // Sort bookmarks
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

  // Attach event listeners to dropdown buttons
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
      const folderSelectDiv = document.createElement("div")
      folderSelectDiv.className = "relative dropdown-btn-group"
      folderSelectDiv.innerHTML = `
        <select class="select small">
          <option value="">Select Folder</option>
          ${folders
            .map((f) => `<option value="${f.id}">${f.title}</option>`)
            .join("")}
        </select>
        <button class="button back">←</button>
      `
      const folderSelect = folderSelectDiv.querySelector(".select")
      const backButton = folderSelectDiv.querySelector(".back")

      folderSelect.addEventListener("change", (e) => {
        if (e.target.value) {
          chrome.bookmarks.move(
            bookmarkId,
            { parentId: e.target.value },
            () => {
              chrome.bookmarks.getTree((bookmarkTreeNodes) => {
                bookmarkTree = bookmarkTreeNodes
                bookmarks = flattenBookmarks(bookmarkTreeNodes)
                folders = getFolders(bookmarkTreeNodes)
                populateFolderFilter(folders)
                updateBookmarkCount()
                renderAllBookmarks(bookmarks)
                const parentDiv = folderSelectDiv
                parentDiv.innerHTML = `
                <button class="dropdown-btn">⋮</button>
                <div class="dropdown-menu hidden">
                  <button class="menu-item add-to-folder" data-id="${bookmarkId}">Add to Folder</button>
                  <button class="menu-item delete-btn" data-id="${bookmarkId}">Delete</button>
                  <button class="menu-item rename-btn" data-id="${bookmarkId}">Rename</button>
                </div>
              `
                attachDropdownListeners()
              })
            }
          )
        }
      })

      backButton.addEventListener("click", () => {
        const parentDiv = folderSelectDiv
        parentDiv.innerHTML = `
          <button class="dropdown-btn">⋮</button>
          <div class="dropdown-menu hidden">
            <button class="menu-item add-to-folder" data-id="${bookmarkId}">Add to Folder</button>
            <button class="menu-item delete-btn" data-id="${bookmarkId}">Delete</button>
            <button class="menu-item rename-btn" data-id="${bookmarkId}">Rename</button>
          </div>
        `
        attachDropdownListeners()
      })

      const parentDiv = e.target.closest(".dropdown-btn-group")
      if (parentDiv) {
        parentDiv.replaceWith(folderSelectDiv)
      }
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

    function handleRenameBookmark(e) {
      const bookmarkId = e.target.dataset.id
      const newTitle = prompt("Enter new title:")
      if (newTitle) {
        chrome.bookmarks.update(bookmarkId, { title: newTitle }, () => {
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

  // Render all bookmarks
  function renderAllBookmarks(bookmarksList) {
    uiState.sortType = sortFilter.value || "default"
    uiState.searchQuery = searchInput.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value

    const sortedBookmarks = sortBookmarks(bookmarksList, uiState.sortType)
    folderListDiv.innerHTML = `
      <div class="select-all">
        <input type="checkbox" id="select-all">
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
          }" ${selectedBookmarks.has(bookmark.id) ? "checked" : ""}>
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

  // Render folder list with dropdown
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
        <input type="checkbox" id="select-all">
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
          }" ${selectedBookmarks.has(bookmark.id) ? "checked" : ""}>
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

  // Search functionality
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
  })

  // Clear search input
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
    })
  }

  // Folder filter functionality
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
  })

  // Sort filter functionality
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
  })

  // Create new folder
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
        })
      })
    }
  })

  // Check if bookmark is in folder
  function isInFolder(bookmark, folderId) {
    let node = bookmark
    while (node.parentId) {
      if (node.parentId === folderId) return true
      node = bookmarks.find((b) => b.id === node.parentId) || { parentId: null }
    }
    return false
  }

  // Render filtered bookmarks
  function renderFilteredBookmarks(filtered, sortType) {
    const sortedBookmarks = sortBookmarks(filtered, sortType)
    folderListDiv.innerHTML = `
      <div class="select-all">
        <input type="checkbox" id="select-all">
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
          }" ${selectedBookmarks.has(bookmark.id) ? "checked" : ""}>
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

  // Add to folder for selected bookmarks
  addToFolderButton.addEventListener("click", () => {
    if (selectedBookmarks.size > 0) {
      const targetFolderId = prompt(
        "Enter folder ID to move selected bookmarks:"
      )
      if (targetFolderId && folders.some((f) => f.id === targetFolderId)) {
        selectedBookmarks.forEach((bookmarkId) => {
          chrome.bookmarks.move(
            bookmarkId,
            { parentId: targetFolderId },
            () => {
              chrome.bookmarks.getTree((bookmarkTreeNodes) => {
                bookmarkTree = bookmarkTreeNodes
                bookmarks = flattenBookmarks(bookmarkTreeNodes)
                folders = getFolders(bookmarkTreeNodes)
                populateFolderFilter(folders)
                updateBookmarkCount()
                renderAllBookmarks(bookmarks)
                selectedBookmarks.clear()
                addToFolderButton.classList.add("hidden")
              })
            }
          )
        })
      }
    }
  })
})

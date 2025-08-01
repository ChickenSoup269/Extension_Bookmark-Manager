document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search")
  const folderFilter = document.getElementById("folder-filter")
  const sortFilter = document.getElementById("sort-filter")
  const createFolderButton = document.getElementById("create-folder")
  const addToFolderButton = document.getElementById("add-to-folder")
  const folderListDiv = document.getElementById("folder-list")
  const bookmarkCountDiv = document.getElementById("bookmark-count")
  let bookmarks = []
  let folders = []
  let selectedBookmarks = new Set()

  // Detect and apply system theme
  function updateTheme() {
    const isDarkMode = window.matchMedia("(prefers-color-scheme: dark)").matches
    document.body.classList.toggle("light-theme", !isDarkMode)
    document.body.classList.toggle("dark-theme", isDarkMode)
    folderListDiv.classList.toggle("light-theme", !isDarkMode)
    folderListDiv.classList.toggle("dark-theme", isDarkMode)
    searchInput.classList.toggle("light-theme", !isDarkMode)
    searchInput.classList.toggle("dark-theme", isDarkMode)
    folderFilter.classList.toggle("light-theme", !isDarkMode)
    folderFilter.classList.toggle("dark-theme", isDarkMode)
    sortFilter.classList.toggle("light-theme", !isDarkMode)
    sortFilter.classList.toggle("dark-theme", isDarkMode)
    createFolderButton.classList.toggle("light-theme", !isDarkMode)
    createFolderButton.classList.toggle("dark-theme", isDarkMode)
    addToFolderButton.classList.toggle("light-theme", !isDarkMode)
    addToFolderButton.classList.toggle("dark-theme", isDarkMode)
    bookmarkCountDiv.classList.toggle("light-theme", !isDarkMode)
    bookmarkCountDiv.classList.toggle("dark-theme", isDarkMode)
  }
  updateTheme()
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", updateTheme)

  // Fetch bookmarks from Chrome API
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    bookmarks = flattenBookmarks(bookmarkTreeNodes)
    folders = getFolders(bookmarkTreeNodes)
    populateFolderFilter(folders)
    updateBookmarkCount()
    renderAllBookmarks(bookmarks) // Auto render all bookmarks on load
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
  }

  // Update bookmark count
  function updateBookmarkCount() {
    const count = bookmarks.filter((b) => b.url).length
    bookmarkCountDiv.textContent = `Total Bookmarks: ${count}`
  }

  // Sort bookmarks
  function sortBookmarks(bookmarksList, sortType) {
    let sorted = [...bookmarksList]
    switch (sortType) {
      case "new":
        sorted.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0))
        break
      case "old":
        sorted.sort((a, b) => (a.dateAdded || 0) - (b.dateAdded || 0))
        break
      case "last-opened":
        sorted.sort(
          (a, b) => (b.dateGroupModified || 0) - (a.dateGroupModified || 0)
        )
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
        // Default: No sorting, keep original order
        break
    }
    return sorted
  }

  // Render all bookmarks
  function renderAllBookmarks(bookmarksList) {
    const sortType = sortFilter.value
    const sortedBookmarks = sortBookmarks(bookmarksList, sortType)
    folderListDiv.innerHTML = `
      <div class="select-all"></div>
    `
    sortedBookmarks.forEach((bookmark) => {
      if (bookmark.url) {
        const div = document.createElement("div")
        div.className = "bookmark-item"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        div.innerHTML = `
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

    // Add event listeners for dropdown buttons
    document.querySelectorAll(".dropdown-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const menu = e.target.nextElementSibling
        menu.classList.toggle("hidden")
      })
    })

    document.querySelectorAll(".add-to-folder").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        const folderSelectDiv = document.createElement("div")
        folderSelectDiv.className = "relative"
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
                  bookmarks = flattenBookmarks(bookmarkTreeNodes)
                  folders = getFolders(bookmarkTreeNodes)
                  populateFolderFilter(folders)
                  updateBookmarkCount()
                  renderAllBookmarks(bookmarks)
                })
              }
            )
          }
        })
        backButton.addEventListener("click", () => {
          e.target.parentElement.parentElement.innerHTML = `
            <button class="dropdown-btn">⋮</button>
            <div class="dropdown-menu hidden">
              <button class="menu-item add-to-folder" data-id="${bookmarkId}">Add to Folder</button>
              <button class="menu-item delete-btn" data-id="${bookmarkId}">Delete</button>
              <button class="menu-item rename-btn" data-id="${bookmarkId}">Rename</button>
            </div>
          `
          document.querySelectorAll(".dropdown-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              const menu = ev.target.nextElementSibling
              menu.classList.toggle("hidden")
            })
          })
          document.querySelectorAll(".add-to-folder").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
          document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
          document.querySelectorAll(".rename-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
        })
        e.target.parentElement.parentElement.replaceWith(folderSelectDiv)
      })
    })

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        if (confirm("Are you sure you want to delete this bookmark?")) {
          chrome.bookmarks.remove(bookmarkId, () => {
            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              renderAllBookmarks(bookmarks)
            })
          })
        }
      })
    })

    document.querySelectorAll(".rename-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        const newTitle = prompt("Enter new title:")
        if (newTitle) {
          chrome.bookmarks.update(bookmarkId, { title: newTitle }, () => {
            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              renderAllBookmarks(bookmarks)
            })
          })
        }
      })
    })
  }

  // Render folder list with dropdown
  function renderFolderList(nodes) {
    const sortType = sortFilter.value
    const sortedBookmarks = sortBookmarks(
      flattenBookmarks(nodes).filter((b) => b.url),
      sortType
    )
    folderListDiv.innerHTML = `
      <div class="select-all"></div>
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
              chrome.runtime.lastError
              chrome.bookmarks.getTree((bookmarkTreeNodes) => {
                bookmarks = flattenBookmarks(bookmarkTreeNodes)
                folders = getFolders(bookmarkTreeNodes)
                populateFolderFilter(folders)
                updateBookmarkCount()
                renderAllBookmarks(bookmarks)
              })
            })
          }
        })
        folderButton.appendChild(deleteFolderBtn)
      }

      div.appendChild(folderButton)
      div.appendChild(dropdown)
      folderListDiv.appendChild(div)
    })

    document.querySelectorAll(".dropdown-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const menu = e.target.nextElementSibling
        menu.classList.toggle("hidden")
      })
    })

    document.querySelectorAll(".add-to-folder").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        const folderSelectDiv = document.createElement("div")
        folderSelectDiv.className = "relative"
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
                  bookmarks = flattenBookmarks(bookmarkTreeNodes)
                  folders = getFolders(bookmarkTreeNodes)
                  populateFolderFilter(folders)
                  updateBookmarkCount()
                  renderAllBookmarks(bookmarks)
                })
              }
            )
          }
        })
        backButton.addEventListener("click", () => {
          e.target.parentElement.parentElement.innerHTML = `
            <button class="dropdown-btn">⋮</button>
            <div class="dropdown-menu hidden">
              <button class="menu-item add-to-folder" data-id="${bookmarkId}">Add to Folder</button>
              <button class="menu-item delete-btn" data-id="${bookmarkId}">Delete</button>
              <button class="menu-item rename-btn" data-id="${bookmarkId}">Rename</button>
            </div>
          `
          document.querySelectorAll(".dropdown-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              const menu = ev.target.nextElementSibling
              menu.classList.toggle("hidden")
            })
          })
          document.querySelectorAll(".add-to-folder").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
          document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
          document.querySelectorAll(".rename-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
        })
        e.target.parentElement.parentElement.replaceWith(folderSelectDiv)
      })
    })

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        if (confirm("Are you sure you want to delete this bookmark?")) {
          chrome.bookmarks.remove(bookmarkId, () => {
            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              renderAllBookmarks(bookmarks)
            })
          })
        }
      })
    })

    document.querySelectorAll(".rename-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        const newTitle = prompt("Enter new title:")
        if (newTitle) {
          chrome.bookmarks.update(bookmarkId, { title: newTitle }, () => {
            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              renderAllBookmarks(bookmarks)
            })
          })
        }
      })
    })
  }

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase()
    const selectedFolderId = folderFilter.value
    const sortType = sortFilter.value

    let filtered = bookmarks
    if (selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, selectedFolderId)
      )
    }
    if (query) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(query) ||
          bookmark.url?.toLowerCase().includes(query)
      )
    }
    renderFilteredBookmarks(filtered, sortType)
  })

  // Folder filter functionality
  folderFilter.addEventListener("change", () => {
    const query = searchInput.value.toLowerCase()
    const selectedFolderId = folderFilter.value
    const sortType = sortFilter.value

    let filtered = bookmarks
    if (selectedFolderId === "") {
      renderAllBookmarks(bookmarks)
    } else if (selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, selectedFolderId)
      )
    }
    if (query) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(query) ||
          bookmark.url?.toLowerCase().includes(query)
      )
    }
    renderFilteredBookmarks(filtered, sortType)
  })

  // Sort filter functionality
  sortFilter.addEventListener("change", () => {
    const query = searchInput.value.toLowerCase()
    const selectedFolderId = folderFilter.value
    const sortType = sortFilter.value

    let filtered = bookmarks
    if (selectedFolderId) {
      filtered = filtered.filter((bookmark) =>
        isInFolder(bookmark, selectedFolderId)
      )
    }
    if (query) {
      filtered = filtered.filter(
        (bookmark) =>
          bookmark.title?.toLowerCase().includes(query) ||
          bookmark.url?.toLowerCase().includes(query)
      )
    }
    if (selectedFolderId || query) {
      renderFilteredBookmarks(filtered, sortType)
    } else {
      renderAllBookmarks(bookmarks)
    }
  })

  // Create new folder
  createFolderButton.addEventListener("click", () => {
    const folderName = prompt("Enter folder name:")
    if (folderName) {
      chrome.bookmarks.create({ parentId: "2", title: folderName }, () => {
        chrome.bookmarks.getTree((bookmarkTreeNodes) => {
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
      <div class="select-all"></div>
    `
    sortedBookmarks.forEach((bookmark) => {
      if (bookmark.url) {
        const div = document.createElement("div")
        div.className = "bookmark-item"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        div.innerHTML = `
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

    document.querySelectorAll(".dropdown-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const menu = e.target.nextElementSibling
        menu.classList.toggle("hidden")
      })
    })

    document.querySelectorAll(".add-to-folder").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        const folderSelectDiv = document.createElement("div")
        folderSelectDiv.className = "relative"
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
                  bookmarks = flattenBookmarks(bookmarkTreeNodes)
                  folders = getFolders(bookmarkTreeNodes)
                  populateFolderFilter(folders)
                  updateBookmarkCount()
                  renderAllBookmarks(bookmarks)
                })
              }
            )
          }
        })
        backButton.addEventListener("click", () => {
          e.target.parentElement.parentElement.innerHTML = `
            <button class="dropdown-btn">⋮</button>
            <div class="dropdown-menu hidden">
              <button class="menu-item add-to-folder" data-id="${bookmarkId}">Add to Folder</button>
              <button class="menu-item delete-btn" data-id="${bookmarkId}">Delete</button>
              <button class="menu-item rename-btn" data-id="${bookmarkId}">Rename</button>
            </div>
          `
          document.querySelectorAll(".dropdown-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              const menu = ev.target.nextElementSibling
              menu.classList.toggle("hidden")
            })
          })
          document.querySelectorAll(".add-to-folder").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
          document.querySelectorAll(".delete-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
          document.querySelectorAll(".rename-btn").forEach((btn) => {
            btn.addEventListener("click", (ev) => {
              /* ... */
            })
          })
        })
        e.target.parentElement.parentElement.replaceWith(folderSelectDiv)
      })
    })

    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        if (confirm("Are you sure you want to delete this bookmark?")) {
          chrome.bookmarks.remove(bookmarkId, () => {
            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              renderAllBookmarks(bookmarks)
            })
          })
        }
      })
    })

    document.querySelectorAll(".rename-btn").forEach((button) => {
      button.addEventListener("click", (e) => {
        const bookmarkId = e.target.dataset.id
        const newTitle = prompt("Enter new title:")
        if (newTitle) {
          chrome.bookmarks.update(bookmarkId, { title: newTitle }, () => {
            chrome.bookmarks.getTree((bookmarkTreeNodes) => {
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              renderAllBookmarks(bookmarks)
            })
          })
        }
      })
    })
  }

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

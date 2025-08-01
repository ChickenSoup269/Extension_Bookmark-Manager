document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search")
  const folderFilter = document.getElementById("folder-filter")
  const createFolderButton = document.getElementById("create-folder")
  const addToFolderButton = document.getElementById("add-to-folder")
  const folderListDiv = document.getElementById("folder-list")
  const bookmarkCountDiv = document.getElementById("bookmark-count")
  let bookmarks = []
  let folders = []
  let selectedBookmarks = new Set()

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

  // Render all bookmarks
  function renderAllBookmarks(bookmarksList) {
    folderListDiv.innerHTML = ""
    bookmarksList.forEach((bookmark) => {
      if (bookmark.url) {
        const div = document.createElement("div")
        div.className = "p-2 flex items-center border-b border-gray-200"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        div.innerHTML = `
          <input type="checkbox" class="mr-2" data-id="${bookmark.id}">
          <img src="${favicon}" alt="favicon" class="w-5 h-5 mr-2">
          <a href="${
            bookmark.url
          }" target="_blank" class="text-blue-600 hover:underline flex-grow">${
          bookmark.title || bookmark.url
        }</a>
          <div class="dropdown-btn-group">
            <button class="dropdown-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">⋮</button>
            <div class="dropdown-menu hidden absolute bg-white border border-gray-200 rounded mt-1 p-1">
              <button class="add-to-folder block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Add to Folder</button>
              <button class="delete-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Delete</button>
              <button class="rename-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Rename</button>
            </div>
          </div>
        `
        folderListDiv.appendChild(div)
      }
    })

    // Add event listeners for checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const bookmarkId = e.target.dataset.id
        if (e.target.checked) {
          selectedBookmarks.add(bookmarkId)
        } else {
          selectedBookmarks.delete(bookmarkId)
        }
        addToFolderButton.classList.toggle(
          "hidden",
          selectedBookmarks.size === 0
        )
      })
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
          <select class="p-1 border rounded ml-2">
            <option value="">Select Folder</option>
            ${folders
              .map((f) => `<option value="${f.id}">${f.title}</option>`)
              .join("")}
          </select>
          <button class="back-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 ml-2">←</button>
        `
        const folderSelect = folderSelectDiv.querySelector("select")
        const backButton = folderSelectDiv.querySelector(".back-btn")
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
            <button class="dropdown-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">⋮</button>
            <div class="dropdown-menu hidden absolute bg-white border border-gray-200 rounded mt-1 p-1">
              <button class="add-to-folder block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Add to Folder</button>
              <button class="delete-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Delete</button>
              <button class="rename-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Rename</button>
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
    folderListDiv.innerHTML = ""
    const topFolders = nodes.filter(
      (node) => node.children && ["1", "2"].includes(node.id)
    ) // "Bookmarks bar" (1) and "Other Bookmarks" (2)
    topFolders.forEach((folder) => {
      const div = document.createElement("div")
      div.className = "mb-2"

      const folderButton = document.createElement("button")
      folderButton.className =
        "w-full text-left p-2 bg-gray-200 rounded hover:bg-gray-300 flex justify-between items-center"
      folderButton.textContent = folder.title
      folderButton.addEventListener("click", () => {
        const dropdown = div.querySelector(".dropdown")
        if (dropdown) {
          dropdown.classList.toggle("hidden")
        }
      })

      const dropdown = document.createElement("div")
      dropdown.className =
        "dropdown hidden bg-white border border-gray-200 rounded mt-1 p-2"
      const bookmarksInFolder = flattenBookmarks([folder]).filter((b) => b.url)
      bookmarksInFolder.forEach((bookmark) => {
        const bookmarkDiv = document.createElement("div")
        bookmarkDiv.className = "p-1 flex items-center"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        bookmarkDiv.innerHTML = `
          <input type="checkbox" class="mr-2" data-id="${bookmark.id}">
          <img src="${favicon}" alt="favicon" class="w-5 h-5 mr-2">
          <a href="${
            bookmark.url
          }" target="_blank" class="text-blue-600 hover:underline flex-grow">${
          bookmark.title || bookmark.url
        }</a>
          <div class="dropdown-btn-group">
            <button class="dropdown-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">⋮</button>
            <div class="dropdown-menu hidden absolute bg-white border border-gray-200 rounded mt-1 p-1">
              <button class="add-to-folder block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Add to Folder</button>
              <button class="delete-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Delete</button>
              <button class="rename-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Rename</button>
            </div>
          </div>
        `
        dropdown.appendChild(bookmarkDiv)
      })

      // Add delete button for folder (except fixed ones)
      if (!["1", "2"].includes(folder.id)) {
        const deleteFolderBtn = document.createElement("button")
        deleteFolderBtn.className =
          "text-sm bg-red-200 px-2 py-1 rounded hover:bg-red-300 ml-2"
        deleteFolderBtn.textContent = "Delete Folder"
        deleteFolderBtn.addEventListener("click", () => {
          if (
            confirm(
              "Are you sure you want to delete this folder and its contents?"
            )
          ) {
            chrome.bookmarks.removeTree(folder.id, () => {
              chrome.runtime.lastError // Suppress the error silently
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

    // Add event listeners for checkboxes in folders
    document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        const bookmarkId = e.target.dataset.id
        if (e.target.checked) {
          selectedBookmarks.add(bookmarkId)
        } else {
          selectedBookmarks.delete(bookmarkId)
        }
        addToFolderButton.classList.toggle(
          "hidden",
          selectedBookmarks.size === 0
        )
      })
    })

    // Add event listeners for dropdown buttons in folders
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
          <select class="p-1 border rounded ml-2">
            <option value="">Select Folder</option>
            ${folders
              .map((f) => `<option value="${f.id}">${f.title}</option>`)
              .join("")}
          </select>
          <button class="back-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 ml-2">←</button>
        `
        const folderSelect = folderSelectDiv.querySelector("select")
        const backButton = folderSelectDiv.querySelector(".back-btn")
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
            <button class="dropdown-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">⋮</button>
            <div class="dropdown-menu hidden absolute bg-white border border-gray-200 rounded mt-1 p-1">
              <button class="add-to-folder block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Add to Folder</button>
              <button class="delete-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Delete</button>
              <button class="rename-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Rename</button>
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

    renderFilteredBookmarks(filtered)
  })

  // Folder filter functionality
  folderFilter.addEventListener("change", () => {
    const query = searchInput.value.toLowerCase()
    const selectedFolderId = folderFilter.value

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

    if (selectedFolderId && selectedFolderId !== "") {
      renderFilteredBookmarks(filtered)
    }
  })

  // Create new folder
  createFolderButton.addEventListener("click", () => {
    const folderName = prompt("Enter folder name:")
    if (folderName) {
      chrome.bookmarks.create(
        {
          parentId: "2", // Default to "Other Bookmarks"
          title: folderName,
        },
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
  function renderFilteredBookmarks(filtered) {
    folderListDiv.innerHTML = ""
    filtered.forEach((bookmark) => {
      if (bookmark.url) {
        const div = document.createElement("div")
        div.className = "p-2 flex items-center border-b border-gray-200"
        const favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
          new URL(bookmark.url).hostname
        }`
        div.innerHTML = `
          <input type="checkbox" class="mr-2" data-id="${bookmark.id}">
          <img src="${favicon}" alt="favicon" class="w-5 h-5 mr-2">
          <a href="${
            bookmark.url
          }" target="_blank" class="text-blue-600 hover:underline flex-grow">${
          bookmark.title || bookmark.url
        }</a>
          <div class="dropdown-btn-group">
            <button class="dropdown-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">⋮</button>
            <div class="dropdown-menu hidden absolute bg-white border border-gray-200 rounded mt-1 p-1">
              <button class="add-to-folder block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Add to Folder</button>
              <button class="delete-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Delete</button>
              <button class="rename-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${
                bookmark.id
              }">Rename</button>
            </div>
          </div>
        `
        folderListDiv.appendChild(div)
      }
    })

    // Reattach event listeners for dropdown buttons
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
          <select class="p-1 border rounded ml-2">
            <option value="">Select Folder</option>
            ${folders
              .map((f) => `<option value="${f.id}">${f.title}</option>`)
              .join("")}
          </select>
          <button class="back-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300 ml-2">←</button>
        `
        const folderSelect = folderSelectDiv.querySelector("select")
        const backButton = folderSelectDiv.querySelector(".back-btn")
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
            <button class="dropdown-btn text-sm bg-gray-200 px-2 py-1 rounded hover:bg-gray-300">⋮</button>
            <div class="dropdown-menu hidden absolute bg-white border border-gray-200 rounded mt-1 p-1">
              <button class="add-to-folder block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Add to Folder</button>
              <button class="delete-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Delete</button>
              <button class="rename-btn block w-full text-left p-1 hover:bg-gray-100" data-id="${bookmarkId}">Rename</button>
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

// // events.js
// import {
//   translations,
//   safeChromeBookmarksCall,
//   debounce,
//   showCustomPopup,
//   showCustomConfirm,
// } from "./utils.js"
// import { renderFilteredBookmarks, updateUILanguage, updateTheme } from "./ui.js"
// import {
//   getBookmarkTree,
//   moveBookmarksToFolder,
//   flattenBookmarks,
//   isInFolder,
// } from "./bookmarks.js"
// import {
//   uiState,
//   selectedBookmarks,
//   setCurrentBookmarkId,
//   currentBookmarkId,
//   saveUIState,
// } from "./state.js"

// export function setupEventListeners(elements) {
//   // Nút mở popup
//   elements.createFolderBtn.addEventListener("click", () => {
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.createFolderInput.value = ""
//     elements.createFolderInput.classList.remove("error")
//     elements.createFolderInput.placeholder =
//       translations[language].newFolderPlaceholder
//     elements.createFolderPopup.classList.remove("hidden")
//     elements.createFolderInput.focus()
//   })

//   // Nút Save
//   elements.createFolderSave.addEventListener("click", () => {
//     const folderName = elements.createFolderInput.value.trim()
//     const language = localStorage.getItem("appLanguage") || "en"

//     if (!folderName) {
//       elements.createFolderInput.classList.add("error")
//       elements.createFolderInput.placeholder =
//         translations[language].emptyFolderError
//       elements.createFolderInput.focus()
//       return
//     }

//     // Check duplicate trong folder gốc (id: "2")
//     safeChromeBookmarksCall("getChildren", ["2"], (siblings) => {
//       if (siblings) {
//         const isDuplicate = siblings.some(
//           (sibling) => sibling.title.toLowerCase() === folderName.toLowerCase()
//         )
//         if (isDuplicate) {
//           elements.createFolderInput.classList.add("error")
//           elements.createFolderInput.placeholder =
//             translations[language].duplicateTitleError
//           elements.createFolderInput.focus()
//           return
//         }

//         // Tạo folder mới
//         safeChromeBookmarksCall(
//           "create",
//           [{ parentId: "2", title: folderName }],
//           (newFolder) => {
//             if (newFolder) {
//               getBookmarkTree((bookmarkTreeNodes) => {
//                 if (bookmarkTreeNodes) {
//                   // Cập nhật UI
//                   uiState.bookmarkTree = bookmarkTreeNodes
//                   uiState.folders = getFolders(bookmarkTreeNodes)
//                   uiState.selectedFolderId = newFolder.id
//                   renderFilteredBookmarks(bookmarkTreeNodes, elements)

//                   // ✅ Thông báo thành công
//                   showCustomPopup(
//                     translations[language].createFolderSuccess,
//                     "success",
//                     true
//                   )

//                   // Reset input
//                   elements.createFolderInput.value = ""
//                   elements.createFolderInput.classList.remove("error")
//                   elements.createFolderInput.placeholder =
//                     translations[language].newFolderPlaceholder

//                   // Đóng popup
//                   elements.createFolderPopup.classList.add("hidden")

//                   saveUIState()
//                 } else {
//                   showCustomPopup(
//                     translations[language].errorUnexpected,
//                     "error",
//                     false
//                   )
//                 }
//               })
//             } else {
//               showCustomPopup(
//                 translations[language].errorUnexpected,
//                 "error",
//                 false
//               )
//             }
//           }
//         )
//       } else {
//         showCustomPopup(translations[language].errorUnexpected, "error", false)
//       }
//     })
//   })

//   // Nút Cancel
//   elements.createFolderCancel.addEventListener("click", () => {
//     elements.createFolderPopup.classList.add("hidden")
//     elements.createFolderInput.classList.remove("error")
//     elements.createFolderInput.value = ""
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.createFolderInput.placeholder =
//       translations[language].newFolderPlaceholder
//   })

//   // Clear Create Folder Input
//   elements.clearCreateFolder.addEventListener("click", () => {
//     elements.createFolderInput.value = ""
//     elements.createFolderInput.classList.remove("error")
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.createFolderInput.placeholder =
//       translations[language].newFolderPlaceholder
//     elements.createFolderInput.focus()
//   })

//   // Enter = Save, Escape = Cancel
//   elements.createFolderInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       elements.createFolderSave.click()
//     }
//   })
//   elements.createFolderInput.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       elements.createFolderCancel.click()
//     }
//   })

//   // Click ngoài popup = đóng
//   elements.createFolderPopup.addEventListener("click", (e) => {
//     if (e.target === elements.createFolderPopup) {
//       elements.createFolderCancel.click()
//     }
//   })
//   // Rename Folder Button
//   elements.renameFolderButton.addEventListener("click", () => {
//     const language = localStorage.getItem("appLanguage") || "en"
//     if (
//       !uiState.selectedFolderId ||
//       uiState.selectedFolderId === "1" ||
//       uiState.selectedFolderId === "2"
//     ) {
//       showCustomPopup(
//         translations[language].selectFolderError ||
//           "Please select a valid folder to rename",
//         "error",
//         false
//       )
//       return
//     }
//     populateRenameFolderSelect(elements)
//     elements.renameFolderInput.value = ""
//     elements.renameFolderInput.classList.remove("error")
//     elements.renameFolderInput.placeholder =
//       translations[language].renamePlaceholder
//     elements.renameFolderSelect.value = uiState.selectedFolderId
//     elements.renameFolderPopup.classList.remove("hidden")
//     elements.renameFolderSelect.focus()
//   })

//   // Rename Folder Save
//   elements.renameFolderSave.addEventListener("click", () => {
//     const folderId = elements.renameFolderSelect.value
//     const newFolderName = elements.renameFolderInput.value.trim()
//     const language = localStorage.getItem("appLanguage") || "en"

//     if (!folderId) {
//       elements.renameFolderSelect.classList.add("error")
//       showCustomPopup(
//         translations[language].selectFolderError || "Please select a folder",
//         "error",
//         false
//       )
//       return
//     }

//     if (!newFolderName) {
//       elements.renameFolderInput.classList.add("error")
//       elements.renameFolderInput.placeholder =
//         translations[language].emptyFolderError
//       elements.renameFolderInput.focus()
//       return
//     }

//     // Check for duplicate folder name in the parent folder
//     safeChromeBookmarksCall("get", [folderId], (folder) => {
//       if (folder && folder[0]) {
//         const parentId = folder[0].parentId
//         safeChromeBookmarksCall("getChildren", [parentId], (siblings) => {
//           const isDuplicate = siblings.some(
//             (sibling) =>
//               sibling.id !== folderId &&
//               sibling.title.toLowerCase() === newFolderName.toLowerCase()
//           )
//           if (isDuplicate) {
//             elements.renameFolderInput.classList.add("error")
//             elements.renameFolderInput.placeholder =
//               translations[language].duplicateTitleError
//             elements.renameFolderInput.focus()
//             return
//           }

//           // Update folder name
//           safeChromeBookmarksCall(
//             "update",
//             [folderId, { title: newFolderName }],
//             (result) => {
//               if (result) {
//                 getBookmarkTree((bookmarkTreeNodes) => {
//                   if (bookmarkTreeNodes) {
//                     renderFilteredBookmarks(bookmarkTreeNodes, elements)
//                     showCustomPopup(
//                       translations[language].renameSuccess ||
//                         "Folder renamed successfully!",
//                       "success"
//                     )
//                     elements.renameFolderPopup.classList.add("hidden")
//                     elements.renameFolderInput.value = ""
//                     elements.renameFolderInput.classList.remove("error")
//                     elements.renameFolderInput.placeholder =
//                       translations[language].renamePlaceholder
//                   } else {
//                     showCustomPopup(
//                       translations[language].errorUnexpected,
//                       "error",
//                       false
//                     )
//                   }
//                 })
//               } else {
//                 showCustomPopup(
//                   translations[language].errorUnexpected,
//                   "error",
//                   false
//                 )
//               }
//             }
//           )
//         })
//       } else {
//         showCustomPopup(translations[language].errorUnexpected, "error", false)
//         elements.renameFolderPopup.classList.add("hidden")
//       }
//     })
//   })

//   // Rename Folder Cancel
//   elements.renameFolderCancel.addEventListener("click", () => {
//     elements.renameFolderPopup.classList.add("hidden")
//     elements.renameFolderInput.classList.remove("error")
//     elements.renameFolderInput.value = ""
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.renameFolderInput.placeholder =
//       translations[language].renamePlaceholder
//   })

//   // Clear Rename Folder Input
//   elements.clearRenameFolder.addEventListener("click", () => {
//     elements.renameFolderInput.value = ""
//     elements.renameFolderInput.classList.remove("error")
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.renameFolderInput.placeholder =
//       translations[language].renamePlaceholder
//     elements.renameFolderInput.focus()
//   })

//   // Handle Enter and Escape keys for rename folder popup
//   elements.renameFolderInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       elements.renameFolderSave.click()
//     }
//   })

//   elements.renameFolderInput.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       elements.renameFolderCancel.click()
//     }
//   })

//   elements.renameFolderSelect.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       elements.renameFolderSave.click()
//     }
//   })

//   elements.renameFolderSelect.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       elements.renameFolderCancel.click()
//     }
//   })

//   // Close popup when clicking outside
//   elements.renameFolderPopup.addEventListener("click", (e) => {
//     if (e.target === elements.renameFolderPopup) {
//       elements.renameFolderCancel.click()
//     }
//   })

//   //  --------------------------------------

//   elements.languageSwitcher.addEventListener("change", (e) => {
//     updateUILanguage(elements, e.target.value)
//     renderFilteredBookmarks(uiState.bookmarkTree, elements)
//   })

//   elements.themeSwitcher.addEventListener("change", (e) => {
//     localStorage.setItem("appTheme", e.target.value)
//     updateTheme(elements, e.target.value)
//   })

//   elements.fontSwitcher.addEventListener("change", (e) => {
//     document.body.classList.remove("font-gohu", "font-normal")
//     document.body.classList.add(`font-${e.target.value}`)
//     localStorage.setItem("appFont", e.target.value)
//   })

//   elements.toggleCheckboxesButton.addEventListener("click", () => {
//     uiState.checkboxesVisible = !uiState.checkboxesVisible
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.toggleCheckboxesButton.textContent = uiState.checkboxesVisible
//       ? translations[language].hideCheckboxes
//       : translations[language].showCheckboxes
//     document
//       .querySelectorAll(".bookmark-checkbox, .select-all input")
//       .forEach((checkbox) => {
//         checkbox.style.display = uiState.checkboxesVisible
//           ? "inline-block"
//           : "none"
//       })
//     if (!uiState.checkboxesVisible) {
//       selectedBookmarks.clear()
//       elements.addToFolderButton.classList.add("hidden")
//       document.querySelectorAll(".bookmark-checkbox").forEach((cb) => {
//         cb.checked = false
//       })
//     }
//     saveUIState()
//   })

//   elements.scrollToTopButton.addEventListener("click", () => {
//     window.scrollTo({ top: 0, behavior: "smooth" })
//   })

//   window.addEventListener("scroll", () => {
//     elements.scrollToTopButton.classList.toggle("hidden", window.scrollY <= 0)
//   })

//   elements.renameSave.addEventListener("click", () => {
//     const newTitle = elements.renameInput.value.trim()
//     const language = localStorage.getItem("appLanguage") || "en"
//     console.log(
//       "renameSave clicked, currentBookmarkId:",
//       currentBookmarkId,
//       "newTitle:",
//       newTitle
//     )
//     if (newTitle && currentBookmarkId) {
//       safeChromeBookmarksCall("get", [currentBookmarkId], (bookmark) => {
//         if (bookmark && bookmark[0]) {
//           const parentId = bookmark[0].parentId
//           safeChromeBookmarksCall("getChildren", [parentId], (siblings) => {
//             const isDuplicate = siblings.some(
//               (sibling) =>
//                 sibling.id !== currentBookmarkId && sibling.title === newTitle
//             )
//             if (isDuplicate) {
//               console.log("Duplicate title detected:", newTitle)
//               elements.renameInput.classList.add("error")
//               elements.renameInput.placeholder =
//                 translations[language].duplicateTitleError
//               return
//             }
//             safeChromeBookmarksCall(
//               "update",
//               [currentBookmarkId, { title: newTitle }],
//               (result) => {
//                 if (result) {
//                   console.log("Bookmark renamed successfully:", result)
//                   getBookmarkTree((bookmarkTreeNodes) => {
//                     if (bookmarkTreeNodes) {
//                       renderFilteredBookmarks(bookmarkTreeNodes, elements)
//                       showCustomPopup(
//                         translations[language].renameSuccess,
//                         "success"
//                       )
//                       setCurrentBookmarkId(null)
//                       elements.renamePopup.classList.add("hidden")
//                     } else {
//                       console.error(
//                         "Failed to fetch bookmark tree after rename"
//                       )
//                       showCustomPopup(
//                         translations[language].errorUnexpected,
//                         "error",
//                         false
//                       )
//                     }
//                   })
//                 } else {
//                   console.error("Failed to update bookmark title")
//                   showCustomPopup(
//                     translations[language].errorUnexpected,
//                     "error",
//                     false
//                   )
//                 }
//               }
//             )
//           })
//         } else {
//           console.error("Bookmark not found for ID:", currentBookmarkId)
//           showCustomPopup(
//             translations[language].errorUnexpected,
//             "error",
//             false
//           )
//           elements.renamePopup.classList.add("hidden")
//         }
//       })
//     } else if (!newTitle) {
//       console.log("Empty title entered")
//       elements.renameInput.classList.add("error")
//       elements.renameInput.placeholder = translations[language].emptyTitleError
//     } else {
//       console.error("currentBookmarkId is undefined")
//       showCustomPopup(translations[language].errorUnexpected, "error", false)
//       elements.renamePopup.classList.add("hidden")
//     }
//   })

//   elements.renameCancel.addEventListener("click", () => {
//     elements.renamePopup.classList.add("hidden")
//     elements.renameInput.classList.remove("error")
//     elements.renameInput.value = ""
//     setCurrentBookmarkId(null)
//   })

//   elements.renameInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       elements.renameSave.click()
//     }
//   })

//   elements.renameInput.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       elements.renameCancel.click()
//     }
//   })

//   elements.renamePopup.addEventListener("click", (e) => {
//     if (e.target === elements.renamePopup) {
//       elements.renameCancel.click()
//     }
//   })

//   elements.clearRenameButton.addEventListener("click", () => {
//     elements.renameInput.value = ""
//     elements.renameInput.classList.remove("error")
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.renameInput.placeholder = translations[language].renamePlaceholder
//     elements.renameInput.focus()
//   })

//   elements.settingsButton.addEventListener("click", (e) => {
//     e.stopPropagation()
//     elements.settingsMenu.classList.toggle("hidden")
//   })

//   document.addEventListener("click", (e) => {
//     if (
//       !e.target.closest("#settings-button") &&
//       !e.target.closest("#settings-menu") &&
//       !e.target.closest(".dropdown-btn") &&
//       !e.target.closest(".dropdown-menu")
//     ) {
//       elements.settingsMenu.classList.add("hidden")
//       document.querySelectorAll(".dropdown-menu").forEach((menu) => {
//         menu.classList.add("hidden")
//       })
//     }
//   })

//   elements.exportBookmarksOption.addEventListener("click", () => {
//     const language = localStorage.getItem("appLanguage") || "en"
//     const currentTheme = document.body.getAttribute("data-theme") || "dark"
//     // Create popup container
//     const popup = document.createElement("div")
//     popup.className = "popup"
//     popup.setAttribute("data-theme", currentTheme)
//     popup.innerHTML = `
//   <div class="popup-content">
//     <h2>${translations[language].exportTitle || "Export Bookmarks"}</h2>
//     <select id="exportFormat">
//       <option value="json">JSON</option>
//       <option value="html">HTML</option>
//     </select>
//     <button id="confirmExport">${
//       translations[language].confirm || "Export"
//     }</button>
//     <button id="cancelExport">${
//       translations[language].cancel || "Cancel"
//     }</button>
//   </div>
// `

//     // Append popup to body
//     document.body.appendChild(popup)

//     // Handle confirm export
//     document.getElementById("confirmExport").addEventListener("click", () => {
//       const exportChoice = document
//         .getElementById("exportFormat")
//         .value.toUpperCase()
//       safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
//         if (!bookmarkTreeNodes) {
//           showCustomPopup(
//             translations[language].errorUnexpected ||
//               "Unexpected error occurred",
//             "error",
//             false
//           )
//           document.body.removeChild(popup)
//           return
//         }

//         const exportData = {
//           timestamp: new Date().toISOString(),
//           bookmarks: bookmarkTreeNodes,
//         }

//         if (exportChoice === "JSON") {
//           const jsonString = JSON.stringify(exportData, null, 2)
//           const blob = new Blob([jsonString], { type: "application/json" })
//           const url = URL.createObjectURL(blob)
//           const link = document.createElement("a")
//           link.href = url
//           link.download = `bookmarks_${
//             new Date().toISOString().split("T")[0]
//           }.json`
//           document.body.appendChild(link)
//           link.click()
//           document.body.removeChild(link)
//           URL.revokeObjectURL(url)
//         } else if (exportChoice === "HTML") {
//           const htmlContent = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//   <meta charset="UTF-8">
//   <meta name="viewport" content="width=device-width, initial-scale=1.0">
//   <title>Exported Bookmarks</title>
//   <style>
//     body { font-family: Arial, sans-serif; margin: 20px; }
//     .container { max-width: 1200px; margin: auto; }
//     .controls { margin-bottom: 20px; }
//     #searchInput { padding: 8px; width: 100%; max-width: 300px; }
//     .view-toggle { margin-left: 20px; }
//     .bookmark-list { list-style: none; padding: 0; }
//     .bookmark-list li { padding: 10px; border-bottom: 1px solid #ddd; }
//     .bookmark-grid {
//       display: grid;
//       grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
//       gap: 20px;
//     }
//     .bookmark-grid .bookmark-item {
//       border: 1px solid #ddd;
//       padding: 15px;
//       border-radius: 5px;
//       text-align: center;
//     }
//     .bookmark-item a { text-decoration: none; color: #007bff; }
//     .bookmark-item a:hover { text-decoration: underline; }
//     .folder { font-weight: bold; margin-top: 10px; }
//     .hidden { display: none; }
//   </style>
// </head>
// <body>
//   <div class="container">
//     <div class="controls">
//       <input type="text" id="searchInput" placeholder="${
//         translations[language].searchPlaceholder || "Search bookmarks..."
//       }">
//       <button class="view-toggle" onclick="toggleView('list')">List View</button>
//       <button class="view-toggle" onclick="toggleView('grid')">Grid View</button>
//     </div>
//     <ul id="bookmarkList" class="bookmark-list"></ul>
//     <div id="bookmarkGrid" class="bookmark-grid hidden"></div>
//   </div>

//   <script>
//     const bookmarks = ${JSON.stringify(bookmarkTreeNodes)};
//     const listContainer = document.getElementById("bookmarkList");
//     const gridContainer = document.getElementById("bookmarkGrid");
//     const searchInput = document.getElementById("searchInput");

//     function renderBookmarks(nodes, parent = listContainer, gridParent = gridContainer, depth = 0) {
//       nodes.forEach(node => {
//         if (node.url) {
//           const li = document.createElement("li");
//           li.className = "bookmark-item";
//           li.innerHTML = \`<a href="\${node.url}" target="_blank">\${node.title || node.url}</a>\`;
//           parent.appendChild(li);

//           const gridItem = document.createElement("div");
//           gridItem.className = "bookmark-item";
//           gridItem.innerHTML = \`<a href="\${node.url}" target="_blank">\${node.title || node.url}</a>\`;
//           gridParent.appendChild(gridItem);
//         }
//         if (node.children) {
//           const folder = document.createElement("li");
//           folder.className = "folder";
//           folder.textContent = node.title || "Unnamed Folder";
//           parent.appendChild(folder);

//           const gridFolder = document.createElement("div");
//           gridFolder.className = "folder bookmark-item";
//           gridFolder.textContent = node.title || "Unnamed Folder";
//           gridParent.appendChild(gridFolder);

//           renderBookmarks(node.children, parent, gridParent, depth + 1);
//         }
//       });
//     }

//     function toggleView(view) {
//       if (view === "list") {
//         listContainer.classList.remove("hidden");
//         gridContainer.classList.add("hidden");
//       } else {
//         listContainer.classList.add("hidden");
//         gridContainer.classList.remove("hidden");
//       }
//     }

//     function filterBookmarks() {
//       const query = searchInput.value.toLowerCase();
//       const items = document.querySelectorAll(".bookmark-item");
//       items.forEach(item => {
//         const text = item.textContent.toLowerCase();
//         item.style.display = text.includes(query) ? "" : "none";
//       });
//     }

//     searchInput.addEventListener("input", filterBookmarks);
//     renderBookmarks(bookmarks);
//   </script>
// </body>
// </html>
//           `
//           const blob = new Blob([htmlContent], { type: "text/html" })
//           const url = URL.createObjectURL(blob)
//           const link = document.createElement("a")
//           link.href = url
//           link.download = `bookmarks_${
//             new Date().toISOString().split("T")[0]
//           }.html`
//           document.body.appendChild(link)
//           link.click()
//           document.body.removeChild(link)
//           URL.revokeObjectURL(url)
//         }

//         document.body.removeChild(popup)
//         elements.settingsMenu.classList.add("hidden")
//       })
//     })

//     // Handle cancel
//     document.getElementById("cancelExport").addEventListener("click", () => {
//       document.body.removeChild(popup)
//     })
//   })

//   // Popup styles
//   const style = document.createElement("style")
//   style.textContent = `
//   .popup {
//     position: fixed;
//     top: 0;
//     left: 0;
//     width: 100%;
//     height: 100%;
//     background: rgba(0, 0, 0, 0.5);
//     display: flex;
//     justify-content: center;
//     align-items: center;
//     z-index: 1000;
//   }
//   .popup-content {
//     background: white;
//     padding: 20px;
//     border-radius: 5px;
//     text-align: center;
//   }
//   .popup-content select, .popup-content button {
//     margin: 10px;
//     padding: 8px;
//   }
// `
//   document.head.appendChild(style)

//   elements.importBookmarksOption.addEventListener("click", () => {
//     const input = document.createElement("input")
//     input.type = "file"
//     input.accept = "application/json"
//     input.addEventListener("change", (e) => {
//       const file = e.target.files[0]
//       if (!file) return
//       const reader = new FileReader()
//       reader.onload = (event) => {
//         try {
//           const data = JSON.parse(event.target.result)
//           if (!data.bookmarks || !Array.isArray(data.bookmarks)) {
//             const language = localStorage.getItem("appLanguage") || "en"
//             showCustomPopup(
//               translations[language].importInvalidFile || "Invalid file format",
//               "error",
//               false
//             )
//             return
//           }

//           safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
//             if (!bookmarkTreeNodes) {
//               const language = localStorage.getItem("appLanguage") || "en"
//               showCustomPopup(
//                 translations[language].importError ||
//                   "Failed to fetch bookmark tree",
//                 "error",
//                 false
//               )
//               return
//             }

//             const existingBookmarks = flattenBookmarks(bookmarkTreeNodes)
//             const existingUrls = new Set(existingBookmarks.map((b) => b.url))

//             const bookmarksToImport = []
//             const duplicateBookmarks = []
//             const flattenImportedBookmarks = flattenBookmarks(data.bookmarks)

//             flattenImportedBookmarks.forEach((bookmark) => {
//               if (bookmark.url) {
//                 if (existingUrls.has(bookmark.url)) {
//                   duplicateBookmarks.push(bookmark)
//                 } else {
//                   bookmarksToImport.push(bookmark)
//                 }
//               }
//             })

//             const language = localStorage.getItem("appLanguage") || "en"

//             if (duplicateBookmarks.length > 0) {
//               const language = localStorage.getItem("appLanguage") || "en"
//               showCustomPopup(
//                 `${
//                   translations[language].importDuplicatePrompt ||
//                   "Duplicate bookmarks found"
//                 }: ${duplicateBookmarks.length}`,
//                 "warning",
//                 true, // cho hiện confirm
//                 () => importNonDuplicateBookmarks(bookmarksToImport) // chỉ chạy khi bấm OK
//               )
//             } else {
//               importNonDuplicateBookmarks(bookmarksToImport)
//             }
//           })
//         } catch (error) {
//           console.error("Error parsing import file:", error)
//           const language = localStorage.getItem("appLanguage") || "en"
//           showCustomPopup(
//             translations[language].importInvalidFile || "Invalid file format",
//             "error",
//             false
//           )
//         }
//       }
//       reader.readAsText(file)
//     })
//     input.click()
//     settingsMenu.classList.add("hidden")
//   })

//   function populateRenameFolderSelect(elements) {
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.renameFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
//     uiState.folders.forEach((folder) => {
//       // Exclude root folders (ids "1" and "2")
//       if (folder.id !== "1" && folder.id !== "2") {
//         const option = document.createElement("option")
//         option.value = folder.id
//         option.textContent = folder.title
//         elements.renameFolderSelect.appendChild(option)
//       }
//     })
//   }

//   // Hàm nhập các bookmark không trùng lặp
//   function importNonDuplicateBookmarks(bookmarksToImport) {
//     const language = localStorage.getItem("appLanguage") || "en"
//     const importPromises = bookmarksToImport.map((bookmark) => {
//       return new Promise((resolve) => {
//         safeChromeBookmarksCall(
//           "create",
//           [
//             {
//               parentId: bookmark.parentId || "2",
//               title: bookmark.title || "",
//               url: bookmark.url,
//             },
//           ],
//           resolve
//         )
//       })
//     })

//     Promise.all(importPromises).then(() => {
//       safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
//         if (bookmarkTreeNodes) {
//           bookmarkTree = bookmarkTreeNodes
//           bookmarks = flattenBookmarks(bookmarkTreeNodes)
//           folders = getFolders(bookmarkTreeNodes)
//           populateFolderFilter(folders)
//           updateBookmarkCount()
//           let filtered = bookmarks
//           if (uiState.selectedFolderId) {
//             filtered = filtered.filter((bookmark) =>
//               isInFolder(bookmark, uiState.selectedFolderId)
//             )
//           }
//           if (uiState.searchQuery) {
//             filtered = filtered.filter(
//               (bookmark) =>
//                 bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
//                 bookmark.url?.toLowerCase().includes(uiState.searchQuery)
//             )
//           }
//           renderFilteredBookmarks(filtered, uiState.sortType)
//           toggleDeleteFolderButton()
//           saveUIState()
//           showCustomPopup(
//             translations[language].importSuccess ||
//               "Bookmarks imported successfully!",
//             "success"
//           )
//         } else {
//           showCustomPopup(
//             translations[language].importError || "Failed to update bookmarks",
//             "error",
//             false
//           )
//         }
//       })
//     })
//   }

//   elements.deleteFolderButton.addEventListener("click", () => {
//     if (
//       uiState.selectedFolderId &&
//       uiState.selectedFolderId !== "1" &&
//       uiState.selectedFolderId !== "2"
//     ) {
//       const language = localStorage.getItem("appLanguage") || "en"
//       if (confirm(translations[language].deleteFolderConfirm)) {
//         safeChromeBookmarksCall(
//           "getSubTree",
//           [uiState.selectedFolderId],
//           (subTree) => {
//             if (!subTree) return
//             const folderNode = subTree[0]
//             const bookmarksToCheck = folderNode.children
//               ? folderNode.children.filter((node) => node.url)
//               : []

//             safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
//               if (!bookmarkTreeNodes) return
//               const allBookmarks = flattenBookmarks(bookmarkTreeNodes)
//               const bookmarksToDelete = []
//               bookmarksToCheck.forEach((bookmark) => {
//                 const duplicates = allBookmarks.filter(
//                   (b) =>
//                     b.url === bookmark.url &&
//                     b.id !== bookmark.id &&
//                     b.parentId !== uiState.selectedFolderId
//                 )
//                 if (duplicates.length === 0) {
//                   bookmarksToDelete.push(bookmark.id)
//                 }
//               })

//               let deletePromises = bookmarksToDelete.map((bookmarkId) => {
//                 return new Promise((resolve) => {
//                   safeChromeBookmarksCall("remove", [bookmarkId], resolve)
//                 })
//               })

//               Promise.all(deletePromises).then(() => {
//                 safeChromeBookmarksCall(
//                   "remove",
//                   [uiState.selectedFolderId],
//                   () => {
//                     uiState.selectedFolderId = ""
//                     elements.folderFilter.value = ""
//                     getBookmarkTree((bookmarkTreeNodes) => {
//                       if (bookmarkTreeNodes) {
//                         renderFilteredBookmarks(bookmarkTreeNodes, elements)
//                       }
//                     })
//                   }
//                 )
//               })
//             })
//           }
//         )
//       }
//     }
//   })

//   elements.addToFolderButton.addEventListener("click", () => {
//     if (selectedBookmarks.size > 0) {
//       populateAddToFolderSelect(elements)
//       elements.newFolderInput.value = ""
//       elements.newFolderInput.classList.remove("error")
//       const language = localStorage.getItem("appLanguage") || "en"
//       elements.newFolderInput.placeholder =
//         translations[language].newFolderPlaceholder
//       elements.addToFolderPopup.classList.remove("hidden")
//       elements.addToFolderSelect.focus()
//     }
//   })

//   elements.createNewFolderButton.addEventListener("click", () => {
//     const folderName = elements.newFolderInput.value.trim()
//     const language = localStorage.getItem("appLanguage") || "en"
//     if (folderName) {
//       safeChromeBookmarksCall(
//         "create",
//         [{ parentId: "2", title: folderName }],
//         (newFolder) => {
//           if (newFolder) {
//             getBookmarkTree((bookmarkTreeNodes) => {
//               if (bookmarkTreeNodes) {
//                 renderFilteredBookmarks(bookmarkTreeNodes, elements)
//                 elements.newFolderInput.value = ""
//                 elements.newFolderInput.classList.remove("error")
//                 elements.addToFolderSelect.value = newFolder.id
//               }
//             })
//           }
//         }
//       )
//     } else {
//       elements.newFolderInput.classList.add("error")
//       elements.newFolderInput.placeholder =
//         translations[language].emptyFolderError
//     }
//   })

//   // events.js (add-to-folder-save listener)
//   elements.addToFolderSaveButton.addEventListener("click", () => {
//     const targetFolderId = elements.addToFolderSelect.value
//     const language = localStorage.getItem("appLanguage") || "en"
//     console.log(
//       "Saving bookmarks to folder:",
//       targetFolderId,
//       "Selected bookmarks:",
//       Array.from(selectedBookmarks)
//     )
//     if (!targetFolderId) {
//       console.log("No folder selected, showing error.")
//       elements.newFolderInput.classList.add("error")
//       elements.newFolderInput.placeholder =
//         translations[language].selectFolderError
//       elements.newFolderInput.focus()
//       return
//     }
//     if (selectedBookmarks.size === 0) {
//       console.log("No bookmarks selected, showing error.")
//       showCustomPopup(translations[language].errorUnexpected, "error", false)
//       elements.addToFolderPopup.classList.add("hidden")
//       return
//     }
//     moveBookmarksToFolder(
//       Array.from(selectedBookmarks),
//       targetFolderId,
//       elements,
//       () => {
//         elements.addToFolderPopup.classList.add("hidden")
//       }
//     )
//   })

//   elements.addToFolderSaveButton.addEventListener("click", () => {
//     const targetFolderId = elements.addToFolderSelect.value
//     const newFolderName = elements.newFolderInput.value.trim()
//     const language = localStorage.getItem("appLanguage") || "en"
//     console.log(
//       "add-to-folder-save clicked, targetFolderId:",
//       targetFolderId,
//       "newFolderName:",
//       newFolderName,
//       "selectedBookmarks:",
//       Array.from(selectedBookmarks)
//     )

//     if (!targetFolderId && !newFolderName) {
//       console.log("No folder selected or new folder name entered")
//       elements.newFolderInput.classList.add("error")
//       elements.newFolderInput.placeholder =
//         translations[language].emptyFolderError
//       elements.newFolderInput.focus()
//       return
//     }

//     if (selectedBookmarks.size === 0) {
//       console.log("No bookmarks selected")
//       showCustomPopup(
//         translations[language].noBookmarksSelected,
//         "error",
//         false
//       )
//       elements.addToFolderPopup.classList.add("hidden")
//       return
//     }
//     if (newFolderName) {
//       // Create a new folder
//       safeChromeBookmarksCall(
//         "create",
//         [{ parentId: "2", title: newFolderName }],
//         (newFolder) => {
//           if (newFolder) {
//             console.log("New folder created:", newFolder)
//             getBookmarkTree((bookmarkTreeNodes) => {
//               if (bookmarkTreeNodes) {
//                 uiState.bookmarkTree = bookmarkTreeNodes
//                 uiState.folders = getFolders(bookmarkTreeNodes)
//                 populateAddToFolderSelect(elements)
//                 elements.addToFolderSelect.value = newFolder.id
//                 moveBookmarksToFolder(
//                   Array.from(selectedBookmarks),
//                   newFolder.id,
//                   elements,
//                   () => {
//                     elements.addToFolderPopup.classList.add("hidden")
//                     elements.newFolderInput.value = ""
//                     elements.newFolderInput.classList.remove("error")
//                     elements.newFolderInput.placeholder =
//                       translations[language].newFolderPlaceholder
//                     showCustomPopup(
//                       translations[language].addToFolderSuccess,
//                       "success"
//                     )
//                   }
//                 )
//               } else {
//                 console.error(
//                   "Failed to fetch bookmark tree after creating folder"
//                 )
//                 showCustomPopup(
//                   translations[language].errorUnexpected,
//                   "error",
//                   false
//                 )
//               }
//             })
//           } else {
//             console.error("Failed to create new folder")
//             showCustomPopup(
//               translations[language].errorUnexpected,
//               "error",
//               false
//             )
//           }
//         }
//       )
//     } else {
//       // Move to existing folder
//       moveBookmarksToFolder(
//         Array.from(selectedBookmarks),
//         targetFolderId,
//         elements,
//         () => {
//           elements.addToFolderPopup.classList.add("hidden")
//           elements.newFolderInput.value = ""
//           elements.newFolderInput.classList.remove("error")
//           elements.newFolderInput.placeholder =
//             translations[language].newFolderPlaceholder
//           showCustomPopup(translations[language].addToFolderSuccess, "success")
//         }
//       )
//     }
//   })

//   elements.addToFolderCancel.addEventListener("click", () => {
//     elements.addToFolderPopup.classList.add("hidden")
//     elements.newFolderInput.classList.remove("error")
//     elements.newFolderInput.value = ""
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.newFolderInput.placeholder =
//       translations[language].newFolderPlaceholder
//   })

//   elements.createNewFolder.addEventListener("click", () => {
//     const folderName = elements.newFolderInput.value.trim()
//     const language = localStorage.getItem("appLanguage") || "en"
//     console.log("create-new-folder clicked, folderName:", folderName)
//     if (!folderName) {
//       elements.newFolderInput.classList.add("error")
//       elements.newFolderInput.placeholder =
//         translations[language].emptyFolderError
//       elements.newFolderInput.focus()
//       return
//     }
//     safeChromeBookmarksCall(
//       "create",
//       [{ parentId: "2", title: folderName }],
//       (newFolder) => {
//         if (newFolder) {
//           console.log("New folder created:", newFolder)
//           getBookmarkTree((bookmarkTreeNodes) => {
//             if (bookmarkTreeNodes) {
//               uiState.bookmarkTree = bookmarkTreeNodes
//               uiState.folders = getFolders(bookmarkTreeNodes)
//               populateAddToFolderSelect(elements)
//               elements.addToFolderSelect.value = newFolder.id
//               elements.newFolderInput.value = ""
//               elements.newFolderInput.classList.remove("error")
//               elements.newFolderInput.placeholder =
//                 translations[language].newFolderPlaceholder
//               showCustomPopup(
//                 translations[language].createFolderSuccess,
//                 "success"
//               )
//             } else {
//               console.error(
//                 "Failed to fetch bookmark tree after creating folder"
//               )
//               showCustomPopup(
//                 translations[language].errorUnexpected,
//                 "error",
//                 false
//               )
//             }
//           })
//         } else {
//           console.error("Failed to create new folder")
//           showCustomPopup(
//             translations[language].errorUnexpected,
//             "error",
//             false
//           )
//         }
//       }
//     )
//   })

//   elements.addToFolderPopup.addEventListener("click", (e) => {
//     if (e.target === elements.addToFolderPopup) {
//       elements.addToFolderCancelButton.click()
//     }
//   })

//   elements.newFolderInput.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       elements.createNewFolderButton.click()
//     }
//   })

//   elements.newFolderInput.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       elements.addToFolderCancelButton.click()
//     }
//   })

//   elements.addToFolderSelect.addEventListener("keypress", (e) => {
//     if (e.key === "Enter") {
//       elements.addToFolderSaveButton.click()
//     }
//   })

//   elements.addToFolderSelect.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//       elements.addToFolderCancelButton.click()
//     }
//   })

//   elements.searchInput.addEventListener(
//     "input",
//     debounce((e) => {
//       uiState.searchQuery = e.target.value.toLowerCase()
//       uiState.selectedFolderId = elements.folderFilter.value
//       uiState.sortType = elements.sortFilter.value || "default"
//       let filtered = uiState.bookmarks
//       if (uiState.selectedFolderId) {
//         filtered = filtered.filter((bookmark) =>
//           isInFolder(bookmark, uiState.selectedFolderId)
//         )
//       }
//       if (uiState.searchQuery) {
//         filtered = filtered.filter(
//           (bookmark) =>
//             bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
//             bookmark.url?.toLowerCase().includes(uiState.searchQuery)
//         )
//       }
//       renderFilteredBookmarks(uiState.bookmarkTree, elements)
//       saveUIState()
//     }, 150)
//   )

//   elements.clearSearchButton.addEventListener("click", () => {
//     elements.searchInput.value = ""
//     uiState.searchQuery = ""
//     let filtered = uiState.bookmarks
//     if (uiState.selectedFolderId) {
//       filtered = filtered.filter((bookmark) =>
//         isInFolder(bookmark, uiState.selectedFolderId)
//       )
//     }
//     renderFilteredBookmarks(uiState.bookmarkTree, elements)
//     saveUIState()
//   })

//   elements.folderFilter.addEventListener("change", () => {
//     uiState.searchQuery = elements.searchInput.value.toLowerCase()
//     uiState.selectedFolderId = elements.folderFilter.value
//     uiState.sortType = elements.sortFilter.value || "default"
//     let filtered = uiState.bookmarks
//     if (uiState.selectedFolderId) {
//       filtered = filtered.filter((bookmark) =>
//         isInFolder(bookmark, uiState.selectedFolderId)
//       )
//     }
//     if (uiState.searchQuery) {
//       filtered = filtered.filter(
//         (bookmark) =>
//           bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
//           bookmark.url?.toLowerCase().includes(uiState.searchQuery)
//       )
//     }
//     renderFilteredBookmarks(uiState.bookmarkTree, elements)
//     saveUIState()
//   })

//   elements.sortFilter.addEventListener("change", () => {
//     uiState.searchQuery = elements.searchInput.value.toLowerCase()
//     uiState.selectedFolderId = elements.folderFilter.value
//     uiState.sortType = elements.sortFilter.value || "default"
//     let filtered = uiState.bookmarks
//     if (uiState.selectedFolderId) {
//       filtered = filtered.filter((bookmark) =>
//         isInFolder(bookmark, uiState.selectedFolderId)
//       )
//     }
//     if (uiState.searchQuery) {
//       filtered = filtered.filter(
//         (bookmark) =>
//           bookmark.title?.toLowerCase().includes(uiState.searchQuery) ||
//           bookmark.url?.toLowerCase().includes(uiState.searchQuery)
//       )
//     }
//     renderFilteredBookmarks(uiState.bookmarkTree, elements)
//     saveUIState()
//   })

//   // Nút mở popup tạo folder
//   elements.createFolderSave.addEventListener("click", () => {
//     const folderName = createFolderInput.value.trim()
//     if (!folderName) {
//       closeCreateFolderPopup()
//       return
//     }

//     // Lấy cây bookmark rồi check trùng
//     getBookmarkTree((bookmarkTreeNodes) => {
//       if (!bookmarkTreeNodes) return

//       // Tìm parent folder có id = "2"
//       const parentFolder = findNodeById(bookmarkTreeNodes[0], "2")

//       if (parentFolder && parentFolder.children) {
//         const isDuplicate = parentFolder.children.some(
//           (child) => child.title.toLowerCase() === folderName.toLowerCase()
//         )

//         if (isDuplicate) {
//           alert("A folder with this name already exists!")
//           return
//         }
//       }

//       // Nếu không trùng thì tạo mới
//       safeChromeBookmarksCall(
//         "create",
//         [{ parentId: "2", title: folderName }],
//         () => {
//           getBookmarkTree((bookmarkTreeNodes) => {
//             if (bookmarkTreeNodes) {
//               renderFilteredBookmarks(bookmarkTreeNodes, elements)
//             }
//           })
//         }
//       )
//     })

//     closeCreateFolderPopup()
//   })

//   // Helper: tìm node theo id trong cây
//   function findNodeById(node, id) {
//     if (node.id === id) return node
//     if (node.children) {
//       for (const child of node.children) {
//         const found = findNodeById(child, id)
//         if (found) return found
//       }
//     }
//     return null
//   }

//   attachDropdownListeners(elements)
// }

// export function attachDropdownListeners(elements) {
//   console.log("Attaching dropdown listeners")
//   const dropdownButtons = document.querySelectorAll(".dropdown-btn")
//   console.log("Found dropdown buttons:", dropdownButtons.length)

//   dropdownButtons.forEach((button) => {
//     button.removeEventListener("click", handleDropdownClick)
//     button.addEventListener("click", handleDropdownClick)
//   })

//   document.querySelectorAll(".add-to-folder").forEach((button) => {
//     button.removeEventListener("click", handleAddToFolder)
//     button.addEventListener("click", (e) => handleAddToFolder(e, elements))
//   })

//   document.querySelectorAll(".delete-btn").forEach((button) => {
//     button.removeEventListener("click", handleDeleteBookmark)
//     button.addEventListener("click", (e) => handleDeleteBookmark(e, elements))
//   })

//   document.querySelectorAll(".rename-btn").forEach((button, index) => {
//     button.removeEventListener("click", handleRenameBookmark)
//     button.addEventListener("click", (e) => {
//       console.log(
//         `rename-btn ${index} clicked at ${new Date().toISOString()}, dataset.id: ${
//           e.target.dataset.id
//         }`
//       )
//       handleRenameBookmark(e, elements)
//     })
//   })

//   document.querySelectorAll(".bookmark-checkbox").forEach((checkbox) => {
//     checkbox.removeEventListener("change", handleBookmarkCheckbox)
//     checkbox.addEventListener("change", (e) =>
//       handleBookmarkCheckbox(e, elements)
//     )
//   })

//   function handleDropdownClick(e) {
//     e.stopPropagation()
//     const menu = e.target.nextElementSibling
//     console.log("Dropdown button clicked, menu:", menu)
//     if (!menu || !menu.classList.contains("dropdown-menu")) {
//       console.error("Dropdown menu not found for button:", e.target)
//       return
//     }
//     const isMenuOpen = !menu.classList.contains("hidden")
//     document.querySelectorAll(".dropdown-menu").forEach((m) => {
//       if (m !== menu) m.classList.add("hidden")
//     })
//     menu.classList.toggle("hidden")
//     console.log(
//       "Menu open status after toggle:",
//       !menu.classList.contains("hidden")
//     )
//   }

//   function handleAddToFolder(e, elements) {
//     const bookmarkId = e.target.dataset.id
//     if (!bookmarkId) {
//       console.error("Bookmark ID is undefined")
//       return
//     }
//     selectedBookmarks.clear()
//     selectedBookmarks.add(bookmarkId)
//     const language = localStorage.getItem("appLanguage") || "en"
//     populateAddToFolderSelect(elements)
//     elements.newFolderInput.value = ""
//     elements.newFolderInput.classList.remove("error")
//     elements.newFolderInput.placeholder =
//       translations[language].newFolderPlaceholder
//     elements.addToFolderPopup.classList.remove("hidden")
//     elements.addToFolderSelect.focus()
//   }

//   function handleDeleteBookmark(e, elements) {
//     const bookmarkId = e.target.dataset.id
//     const language = localStorage.getItem("appLanguage") || "en"
//     showCustomConfirm(translations[language].deleteConfirm, () => {
//       safeChromeBookmarksCall("remove", [bookmarkId], () => {
//         getBookmarkTree((bookmarkTreeNodes) => {
//           if (bookmarkTreeNodes) {
//             renderFilteredBookmarks(bookmarkTreeNodes, elements)
//             showCustomPopup(
//               translations[language].deleteBookmarkSuccess,
//               "success"
//             )
//           }
//         })
//       })
//     })
//   }

//   function handleRenameBookmark(e, elements) {
//     const bookmarkId = e.target.dataset.id
//     console.log(`handleRenameBookmark called with bookmarkId: ${bookmarkId}`)
//     if (!bookmarkId) {
//       console.error("Bookmark ID is undefined")
//       const language = localStorage.getItem("appLanguage") || "en"
//       showCustomPopup(translations[language].errorUnexpected, "error", false)
//       return
//     }
//     console.log("Setting currentBookmarkId:", bookmarkId)
//     setCurrentBookmarkId(bookmarkId)
//     const language = localStorage.getItem("appLanguage") || "en"
//     elements.renameInput.value = ""
//     elements.renameInput.classList.remove("error")
//     elements.renameInput.placeholder = translations[language].renamePlaceholder
//     elements.renamePopup.classList.remove("hidden")
//     elements.renameInput.focus()
//     safeChromeBookmarksCall("get", [bookmarkId], (bookmark) => {
//       if (bookmark && bookmark[0]) {
//         console.log("Bookmark title retrieved:", bookmark[0].title)
//         elements.renameInput.value = bookmark[0].title || ""
//       } else {
//         console.error("Bookmark not found for ID:", bookmarkId)
//         showCustomPopup(translations[language].errorUnexpected, "error", false)
//       }
//     })
//   }

//   function handleBookmarkCheckbox(e, elements) {
//     const bookmarkId = e.target.dataset.id
//     if (e.target.checked) {
//       selectedBookmarks.add(bookmarkId)
//     } else {
//       selectedBookmarks.delete(bookmarkId)
//     }
//     elements.addToFolderButton.classList.toggle(
//       "hidden",
//       selectedBookmarks.size === 0
//     )
//   }
// }

// function populateAddToFolderSelect(elements) {
//   const language = localStorage.getItem("appLanguage") || "en"
//   elements.addToFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
//   uiState.folders.forEach((folder) => {
//     const option = document.createElement("option")
//     option.value = folder.id
//     option.textContent = folder.title
//     elements.addToFolderSelect.appendChild(option)
//   })
// }

// ./components/events.js

import { setupCreateFolderListeners } from "./controller/createFolder.js"
import { setupRenameFolderListeners } from "./controller/renameFolder.js"
import { setupAddToFolderListeners } from "./controller/addToFolder.js"
import { setupDeleteFolderListeners } from "./controller/deleteFolder.js"
import { setupExportImportListeners } from "./controller/exportImport.js"
import { setupBookmarkActionListeners } from "./controller/bookmarkActions.js"
import { setupUIControlListeners } from "./controller/uiControls.js"
import { attachDropdownListeners } from "./controller/dropdown.js"

export function setupEventListeners(elements) {
  setupCreateFolderListeners(elements)
  setupRenameFolderListeners(elements)
  setupAddToFolderListeners(elements)
  setupDeleteFolderListeners(elements)
  setupExportImportListeners(elements)
  setupBookmarkActionListeners(elements)
  setupUIControlListeners(elements)
  attachDropdownListeners(elements)
}

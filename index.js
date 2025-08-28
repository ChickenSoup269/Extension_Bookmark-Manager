const translations = {
  en: {
    allBookmarks: "All Bookmarks",
    sortDefault: "Sort: Default",
    sortNew: "New to Old",
    sortOld: "Old to New",
    sortLastOpened: "By Last Opened",
    sortAZ: "A to Z",
    sortZA: "Z to A",
    createFolder: "Create Folder",
    addToFolder: "Add to Folder",
    deleteFolder: "Delete Folder",
    settings: "Settings",
    exportBookmarks: "Export Bookmarks",
    importBookmarks: "Import Bookmarks",
    selectAll: "Select All",
    showCheckboxes: "Show Checkboxes",
    hideCheckboxes: "Hide Checkboxes",
    searchPlaceholder: "Search bookmarks...",
    renameTitle: "Rename",
    renamePlaceholder: "Enter new name...",
    addToFolderTitle: "Add to Folder",
    selectFolder: "Select Folder",
    newFolderPlaceholder: "Name folder want to add",
    createNewFolder: "Create",
    save: "Save",
    cancel: "Cancel",
    totalBookmarks: "Total Bookmarks",
    scrollToTop: "Scroll to Top",
    clear: "Clear",
    deleteConfirm: "Are you sure you want to delete this bookmark?",
    deleteFolderConfirm:
      "Are you sure you want to delete this folder? Bookmarks that exist in other folders will be preserved.",
    discardFolderPrompt:
      "You entered a folder name but didn't save. Discard it?",
    noBookmarks: "No bookmarks found. Please check permissions.",
    emptyTitleError: "Title cannot be empty",
    emptyFolderError: "Folder name cannot be empty",
    selectFolderError: "Select a folder or create a new one",
    errorUnexpected: "Unexpected error occurred. Please try again.",
    clearRenameAria: "Clear rename input",
    clearSearchAria: "Clear search input",
    settingsButtonAria: "Open settings menu",
    addToFolderOption: "Add to Folder",
    deleteBookmarkOption: "Delete",
    renameBookmarkOption: "Rename",
    importSuccess: "Bookmarks imported successfully!",
    importDuplicatePrompt:
      "Some bookmarks already exist (same URL). Do you want to import the non-duplicate bookmarks?",
    importInvalidFile:
      "Invalid file format. Please select a valid JSON bookmark file.",
    importError: "Failed to import bookmarks. Please try again.",
    addToFolderSuccess: "Bookmark(s) added to folder successfully!",
    deleteBookmarkSuccess: "Bookmark deleted successfully!",
    exportPrompt:
      "Choose export format: JSON or HTML (data will be saved as JSON).",
  },
  vi: {
    allBookmarks: "Tất cả Dấu trang",
    sortDefault: "Sắp xếp: Mặc định",
    sortNew: "Mới đến Cũ",
    sortOld: "Cũ đến Mới",
    sortLastOpened: "Theo Lần Mở Cuối",
    sortAZ: "A đến Z",
    sortZA: "Z đến A",
    createFolder: "Tạo Thư mục",
    addToFolder: "Thêm vào Thư mục",
    deleteFolder: "Xóa Thư mục",
    settings: "Cài đặt",
    exportBookmarks: "Xuất Dấu trang",
    importBookmarks: "Nhập Dấu trang",
    selectAll: "Chọn Tất cả",
    showCheckboxes: "Hiển thị Hộp kiểm",
    hideCheckboxes: "Ẩn Hộp kiểm",
    searchPlaceholder: "Tìm kiếm dấu trang...",
    renameTitle: "Đổi tên",
    renamePlaceholder: "Nhập tên mới...",
    addToFolderTitle: "Thêm vào Thư mục",
    selectFolder: "Chọn Thư mục",
    newFolderPlaceholder: "Nhập tên thư mục muốn thêm",
    createNewFolder: "Tạo",
    save: "Lưu",
    cancel: "Hủy",
    totalBookmarks: "Tổng số Dấu trang",
    scrollToTop: "Cuộn lên Đầu",
    clear: "Xóa",
    deleteConfirm: "Bạn có chắc chắn muốn xóa dấu trang này không?",
    deleteFolderConfirm:
      "Bạn có chắc chắn muốn xóa thư mục này không? Các dấu trang có trong thư mục khác sẽ được giữ lại.",
    discardFolderPrompt: "Bạn đã nhập tên thư mục nhưng chưa lưu. Hủy bỏ nó?",
    noBookmarks: "Không tìm thấy dấu trang. Vui lòng kiểm tra quyền truy cập.",
    emptyTitleError: "Tiêu đề không được để trống",
    emptyFolderError: "Tên thư mục không được để trống",
    selectFolderError: "Chọn một thư mục hoặc tạo mới",
    errorUnexpected: "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.",
    clearRenameAria: "Xóa nội dung nhập đổi tên",
    clearSearchAria: "Xóa nội dung tìm kiếm",
    settingsButtonAria: "Mở menu cài đặt",
    addToFolderOption: "Thêm vào Thư mục",
    deleteBookmarkOption: "Xóa",
    renameBookmarkOption: "Đổi tên",
    importSuccess: "Dấu trang đã được nhập thành công!",
    importDuplicatePrompt:
      "Một số dấu trang đã tồn tại (cùng URL). Bạn có muốn nhập các dấu trang không trùng lặp không?",
    importInvalidFile:
      "Định dạng tệp không hợp lệ. Vui lòng chọn tệp JSON dấu trang hợp lệ.",
    importError: "Không thể nhập dấu trang. Vui lòng thử lại.",
    addToFolderSuccess: "Dấu trang đã được thêm vào thư mục thành công!",
    deleteBookmarkSuccess: "Dấu trang đã được xóa thành công!",
    exportPrompt:
      "Chọn định dạng xuất: JSON hoặc HTML (dữ liệu sẽ được lưu dưới dạng JSON).",
  },
}

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
  const settingsButton = document.getElementById("settings-button")
  const settingsMenu = document.getElementById("settings-menu")
  const exportBookmarksOption = document.getElementById(
    "export-bookmarks-option"
  )
  const languageSwitcher = document.getElementById("language-switcher")

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

  // Thêm tùy chọn import vào menu settings
  const importBookmarksOption = document.createElement("button")
  importBookmarksOption.id = "import-bookmarks-option"
  importBookmarksOption.className = "menu-item"
  importBookmarksOption.textContent =
    translations[localStorage.getItem("appLanguage") || "en"].importBookmarks
  settingsMenu.appendChild(importBookmarksOption)

  // Hàm cập nhật giao diện ngôn ngữ
  function updateUILanguage(language) {
    const t = translations[language] || translations.en

    document
      .getElementById("folder-filter")
      .querySelector('option[value=""]').textContent = t.allBookmarks
    document.getElementById("sort-filter").innerHTML = `
      <option value="default">${t.sortDefault}</option>
      <option value="new">${t.sortNew}</option>
      <option value="old">${t.sortOld}</option>
      <option value="last-opened">${t.sortLastOpened}</option>
      <option value="a-z">${t.sortAZ}</option>
      <option value="z-a">${t.sortZA}</option>
    `
    document.getElementById("create-folder").textContent = t.createFolder
    document.getElementById("add-to-folder").textContent = t.addToFolder
    document.getElementById("delete-folder").textContent = t.deleteFolder
    document.getElementById("export-bookmarks-option").textContent =
      t.exportBookmarks
    document.getElementById("import-bookmarks-option").textContent =
      t.importBookmarks
    document.querySelector('label[for="select-all"]').textContent = t.selectAll
    document.getElementById("toggle-checkboxes").textContent = checkboxesVisible
      ? t.hideCheckboxes
      : t.showCheckboxes
    document.getElementById("search").placeholder = t.searchPlaceholder
    document.getElementById("rename-title").textContent = t.renameTitle
    document.getElementById("rename-input").placeholder = t.renamePlaceholder
    document.getElementById("add-to-folder-title").textContent =
      t.addToFolderTitle
    document
      .getElementById("add-to-folder-select")
      .querySelector('option[value=""]').textContent = t.selectFolder
    document.getElementById("new-folder-input").placeholder =
      t.newFolderPlaceholder
    document.getElementById("create-new-folder").textContent = t.createNewFolder
    document.getElementById("add-to-folder-save").textContent = t.save
    document.getElementById("add-to-folder-cancel").textContent = t.cancel
    document.getElementById("rename-save").textContent = t.save
    document.getElementById("rename-cancel").textContent = t.cancel
    document.getElementById("bookmark-count").textContent = `${
      t.totalBookmarks
    }: ${
      document
        .getElementById("bookmark-count")
        .textContent.match(/\d+$/)?.[0] || 0
    }`
    document.getElementById("scroll-to-top").title = t.scrollToTop
    document
      .getElementById("scroll-to-top")
      .setAttribute("aria-label", t.scrollToTop)
    document
      .getElementById("clear-rename")
      .setAttribute("aria-label", t.clearRenameAria)
    document
      .getElementById("clear-search")
      .setAttribute("aria-label", t.clearSearchAria)
    document
      .getElementById("settings-button")
      .setAttribute("aria-label", t.settingsButtonAria)

    document.getElementById("rename-input").dataset.errorPlaceholder =
      t.emptyTitleError
    document.getElementById("new-folder-input").dataset.errorPlaceholder =
      t.emptyFolderError
    document.getElementById("new-folder-input").dataset.selectFolderError =
      t.selectFolderError

    localStorage.setItem("appLanguage", language)
    renderFilteredBookmarks(bookmarks, uiState.sortType)
  }

  // Hàm lưu trạng thái
  function saveUIState() {
    const state = {
      uiState: {
        searchQuery: uiState.searchQuery,
        selectedFolderId: uiState.selectedFolderId,
        sortType: uiState.sortType,
      },
      checkboxesVisible: checkboxesVisible,
    }
    chrome.storage.local.set(state, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving state:", chrome.runtime.lastError)
      }
    })
  }

  // Hàm khôi phục trạng thái
  function restoreUIState(callback) {
    chrome.storage.local.get(["uiState", "checkboxesVisible"], (data) => {
      if (chrome.runtime.lastError) {
        console.error("Error restoring state:", chrome.runtime.lastError)
        callback()
        return
      }
      if (data.uiState) {
        uiState.searchQuery = data.uiState.searchQuery || ""
        uiState.selectedFolderId = data.uiState.selectedFolderId || ""
        uiState.sortType = data.uiState.sortType || "default"
      }
      checkboxesVisible = data.checkboxesVisible || false
      const savedLanguage = localStorage.getItem("appLanguage") || "en"
      languageSwitcher.value = savedLanguage
      updateUILanguage(savedLanguage)
      applyUIState()
      callback()
    })

    function applyUIState() {
      searchInput.value = uiState.searchQuery
      folderFilter.value = uiState.selectedFolderId
      sortFilter.value = uiState.sortType
      const language = localStorage.getItem("appLanguage") || "en"
      toggleCheckboxesButton.textContent = checkboxesVisible
        ? translations[language].hideCheckboxes
        : translations[language].showCheckboxes
      document
        .querySelectorAll(".bookmark-checkbox, .select-all input")
        .forEach((checkbox) => {
          checkbox.style.display = checkboxesVisible ? "inline-block" : "none"
        })
    }
  }

  // Hàm xử lý lỗi API
  function safeChromeBookmarksCall(method, args, callback) {
    try {
      chrome.bookmarks[method](...args, (result) => {
        if (chrome.runtime.lastError) {
          console.error(`Error in ${method}:`, chrome.runtime.lastError)
          const language = localStorage.getItem("appLanguage") || "en"
          alert(`Error: ${chrome.runtime.lastError.message}`)
          callback(null)
          return
        }
        callback(result)
      })
    } catch (error) {
      console.error(`Error in ${method}:`, error)
      const language = localStorage.getItem("appLanguage") || "en"
      alert(translations[language].errorUnexpected)
      callback(null)
    }
  }

  // Hàm cập nhật theme
  function updateTheme() {
    const savedTheme = localStorage.getItem("appTheme") || "system"
    const isDarkMode =
      savedTheme === "dark" ||
      (savedTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
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

  // Khởi tạo theme và theo dõi thay đổi hệ thống
  updateTheme()
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      if (localStorage.getItem("appTheme") === "system") {
        updateTheme()
      }
    })

  // Xử lý thay đổi theme
  document.getElementById("theme-switcher").addEventListener("change", (e) => {
    localStorage.setItem("appTheme", e.target.value)
    updateTheme()
  })

  // Load theme đã lưu
  const savedTheme = localStorage.getItem("appTheme") || "system"
  document.getElementById("theme-switcher").value = savedTheme
  updateTheme()

  // Xử lý thay đổi font
  document.getElementById("font-switcher").addEventListener("change", (e) => {
    document.body.classList.remove("font-gohu", "font-normal")
    document.body.classList.add(`font-${e.target.value}`)
    localStorage.setItem("appFont", e.target.value)
  })

  // Load font đã lưu
  const savedFont = localStorage.getItem("appFont") || "normal"
  document.body.classList.add(`font-${savedFont}`)
  document.getElementById("font-switcher").value = savedFont

  // Xử lý đổi ngôn ngữ
  languageSwitcher.addEventListener("change", (e) => {
    updateUILanguage(e.target.value)
  })

  toggleCheckboxesButton.addEventListener("click", () => {
    checkboxesVisible = !checkboxesVisible
    const language = localStorage.getItem("appLanguage") || "en"
    toggleCheckboxesButton.textContent = checkboxesVisible
      ? translations[language].hideCheckboxes
      : translations[language].showCheckboxes
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
    saveUIState()
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
    const language = localStorage.getItem("appLanguage") || "en"
    if (newTitle && currentBookmarkId) {
      safeChromeBookmarksCall(
        "update",
        [currentBookmarkId, { title: newTitle }],
        () => {
          safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
            if (bookmarkTreeNodes) {
              bookmarkTree = bookmarkTreeNodes
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              let filtered = bookmarks
              if (uiState.selectedFolderId) {
                filtered = filtered.filter((bookmark) =>
                  isInFolder(bookmark, uiState.selectedFolderId)
                )
              }
              if (uiState.searchQuery) {
                filtered = filtered.filter(
                  (bookmark) =>
                    bookmark.title
                      ?.toLowerCase()
                      .includes(uiState.searchQuery) ||
                    bookmark.url?.toLowerCase().includes(uiState.searchQuery)
                )
              }
              renderFilteredBookmarks(filtered, uiState.sortType)
              toggleDeleteFolderButton()
              saveUIState()
            }
            document.getElementById("rename-popup").classList.add("hidden")
            currentBookmarkId = null
          })
        }
      )
    } else if (!newTitle) {
      renameInput.classList.add("error")
      renameInput.placeholder = translations[language].emptyTitleError
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
    const language = localStorage.getItem("appLanguage") || "en"
    renameInput.placeholder = translations[language].renamePlaceholder
    renameInput.focus()
  })

  settingsButton.addEventListener("click", (e) => {
    e.stopPropagation()
    settingsMenu.classList.toggle("hidden")
  })

  document.addEventListener("click", (e) => {
    if (
      !e.target.closest("#settings-button") &&
      !e.target.closest("#settings-menu")
    ) {
      settingsMenu.classList.add("hidden")
    }
  })

  exportBookmarksOption.addEventListener("click", () => {
    const language = localStorage.getItem("appLanguage") || "en"

    // Tạo dropdown modal
    const modal = document.createElement("div")
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 10000;
    font-family: Arial, sans-serif;
  `

    const dropdown = document.createElement("div")
    dropdown.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    text-align: center;
    min-width: 300px;
  `

    dropdown.innerHTML = `
    <h3 style="margin: 0 0 20px 0; color: #333;">Export Bookmarks</h3>
    <p style="margin: 0 0 20px 0; color: #666;">Choose export format:</p>
    <div style="margin-bottom: 20px;">
      <select id="formatSelect" style="
        padding: 10px 15px;
        font-size: 16px;
        border: 2px solid #ddd;
        border-radius: 5px;
        background: white;
        color: #333;
        cursor: pointer;
        width: 200px;
      ">
        <option value="JSON">JSON </option>
        <option value="HTML">HTML </option>
      </select>
    </div>
    <div>
      <button id="exportBtn" style="
        background: green;
        color: white;
        border: none;
        padding: 12px 24px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
        margin-right: 10px;
      ">Export</button>
      <button id="cancelBtn" style="
        background: #6c757d;
        color: white;
        border: none;
        padding: 12px 24px;
        font-size: 16px;
        border-radius: 5px;
        cursor: pointer;
      ">Cancel</button>
    </div>
  `

    // Add CSS styles for modal
    const modalCSS = document.createElement("style")
    modalCSS.textContent = `
    .export-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10000;
    }
    
    .export-dropdown {
      background: var(--bg-color, #fff);
      color: var(--text-color, #333);
      border: 1px solid var(--border-color, #ddd);
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      text-align: center;
      min-width: 320px;
      max-width: 400px;
    }
    
    .export-dropdown h3 {
      margin: 0 0 15px 0;
      font-size: 18px;
      font-weight: 600;
    }
    
    .export-dropdown p {
      margin: 0 0 20px 0;
      opacity: 0.8;
    }
    
    .select-container {
      margin-bottom: 25px;
    }
    
    .button-container {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    
    .export-dropdown .select {
      width: 220px;
      padding: 10px 15px;
      font-size: 14px;
      border-radius: 4px;
    }
    
    .export-dropdown .button {
      padding: 10px 20px;
      font-size: 14px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    
    .export-dropdown .button.primary {
      background: var(--primary-color, #007bff);
      color: white;
    }
    
    .export-dropdown .button.primary:hover {
      background: var(--primary-hover, #0056b3);
    }
    
    .export-dropdown .button.secondary {
      background: var(--secondary-color, #6c757d);
      color: white;
    }
    
    .export-dropdown .button.secondary:hover {
      background: var(--secondary-hover, #5a6268);
    }
    
    /* Dark theme */
    .dark-theme .export-dropdown {
      --bg-color: #2d2d2d;
      --text-color: #fff;
      --border-color: #555;
      --primary-color: #0d6efd;
      --primary-hover: #0b5ed7;
      --secondary-color: #6c757d;
      --secondary-hover: #5c636a;
    }
    
    /* Light theme */
    .light-theme .export-dropdown {
      --bg-color: #fff;
      --text-color: #333;
      --border-color: #ddd;
      --primary-color: #007bff;
      --primary-hover: #0056b3;
      --secondary-color: #6c757d;
      --secondary-hover: #5a6268;
    }
  `
    document.head.appendChild(modalCSS)

    modal.appendChild(dropdown)
    document.body.appendChild(modal)

    // Apply theme to modal
    const savedTheme = localStorage.getItem("appTheme") || "system"
    const isDarkMode =
      savedTheme === "dark" ||
      (savedTheme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)

    dropdown.classList.toggle("light-theme", !isDarkMode)
    dropdown.classList.toggle("dark-theme", isDarkMode)
    dropdown.querySelectorAll(".select, .button").forEach((el) => {
      el.classList.toggle("light-theme", !isDarkMode)
      el.classList.toggle("dark-theme", isDarkMode)
    })

    // Focus vào select
    const formatSelect = dropdown.querySelector("#formatSelect")
    formatSelect.focus()

    // Xử lý events
    dropdown.querySelector("#exportBtn").addEventListener("click", () => {
      const format = formatSelect.value
      document.body.removeChild(modal)

      // Tiếp tục với logic export
      processBookmarkExport(format)
    })

    dropdown.querySelector("#cancelBtn").addEventListener("click", () => {
      document.body.removeChild(modal)
    })

    // Đóng modal khi click outside
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal)
      }
    })

    // Xử lý keyboard
    modal.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        document.body.removeChild(modal)
      } else if (e.key === "Enter") {
        dropdown.querySelector("#exportBtn").click()
      }
    })

    function processBookmarkExport(format) {
      safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
        if (!bookmarkTreeNodes) {
          alert(translations[language].errorUnexpected)
          return
        }
        if (format === "JSON") {
          // JSON export
          const exportData = {
            timestamp: new Date().toISOString(),
            bookmarks: bookmarkTreeNodes,
          }
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
        } else if (format === "HTML") {
          // HTML export với pixel style
          function getFaviconUrl(url) {
            try {
              const domain = new URL(url).hostname
              return `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
            } catch {
              return null
            }
          }

          function bookmarksToHTML(nodes, level = 0) {
            let html = '<ul class="bookmark-list">\n'
            for (const node of nodes) {
              if (node.url) {
                const faviconUrl = getFaviconUrl(node.url)
                const faviconHtml = faviconUrl
                  ? `<img class="favicon" src="${faviconUrl}" alt="" onerror="this.style.display='none'">`
                  : '<span class="no-favicon">●</span>'

                html += `<li class="bookmark-item">
                <a href="${node.url}" class="bookmark-link">
                  ${faviconHtml}
                  <span class="bookmark-title">${node.title || node.url}</span>
                </a>
              </li>\n`
              } else {
                html += `<li class="folder-item">
                <details class="folder-details" ${level < 2 ? "open" : ""}>
                  <summary class="folder-title">
                    <span class="folder-icon">▶</span>
                    ${node.title || "Folder"}
                  </summary>`
                if (node.children && node.children.length > 0) {
                  html += bookmarksToHTML(node.children, level + 1)
                }
                html += `</details>
              </li>\n`
              }
            }
            html += "</ul>\n"
            return html
          }

          // Determine theme for HTML export
          const savedTheme = localStorage.getItem("appTheme") || "system"
          const isDarkMode =
            savedTheme === "dark" ||
            (savedTheme === "system" &&
              window.matchMedia("(prefers-color-scheme: dark)").matches)

          const cleanCSS = `
<style>
  * {
    box-sizing: border-box;
  }
  
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    font-size: 14px;
    line-height: 1.6;
    background: ${isDarkMode ? "#1a1a1a" : "#ffffff"};
    color: ${isDarkMode ? "#e0e0e0" : "#333333"};
    margin: 0;
    padding: 30px;
    min-height: 100vh;
  }
  
  h1 {
    font-size: 28px;
    text-align: center;
    margin-bottom: 40px;
    padding: 25px;
    background: ${isDarkMode ? "#2d2d2d" : "#f8f9fa"};
    color: ${isDarkMode ? "#ffffff" : "#212529"};
    border: 1px solid ${isDarkMode ? "#444" : "#dee2e6"};
    border-radius: 8px;
    font-weight: 600;
  }
  
  .bookmark-list {
    list-style: none;
    padding: 0;
    margin: 0 0 0 25px;
  }
  
  .bookmark-list:first-child {
    margin-left: 0;
  }
  
  .bookmark-item,
  .folder-item {
    margin: 6px 0;
  }
  
  .bookmark-link {
    display: flex;
    align-items: center;
    color: ${isDarkMode ? "#e0e0e0" : "#333333"};
    text-decoration: none;
    padding: 10px 15px;
    background: ${isDarkMode ? "#2d2d2d" : "#ffffff"};
    border: 1px solid ${isDarkMode ? "#444" : "#e0e0e0"};
    border-radius: 6px;
    transition: all 0.2s ease;
    margin: 4px 0;
  }
  
  .bookmark-link:hover {
    background: ${isDarkMode ? "#3d3d3d" : "#f8f9fa"};
    border-color: ${isDarkMode ? "#666" : "#007bff"};
    transform: translateY(-1px);
    box-shadow: 0 2px 8px ${
      isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,123,255,0.15)"
    };
  }
  
  .favicon {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    border-radius: 2px;
    background: ${isDarkMode ? "#404040" : "#f0f0f0"};
  }
  
  .no-favicon {
    width: 16px;
    height: 16px;
    margin-right: 12px;
    display: inline-block;
    text-align: center;
    background: ${isDarkMode ? "#404040" : "#f0f0f0"};
    color: ${isDarkMode ? "#888" : "#666"};
    font-size: 10px;
    line-height: 16px;
    border-radius: 2px;
  }
  
  .bookmark-title {
    word-break: break-word;
    flex: 1;
    font-weight: 400;
  }
  
  .folder-details {
    background: ${isDarkMode ? "#232323" : "#fafafa"};
    border: 1px solid ${isDarkMode ? "#404040" : "#e5e5e5"};
    border-radius: 6px;
    padding: 8px;
    margin: 8px 0;
  }
  
  .folder-details[open] {
    border-color: ${isDarkMode ? "#555" : "#007bff"};
  }
  
  .folder-title {
    font-size: 14px;
    color: ${isDarkMode ? "#ffffff" : "#212529"};
    cursor: pointer;
    padding: 12px 15px;
    background: ${isDarkMode ? "#2d2d2d" : "#ffffff"};
    border: 1px solid ${isDarkMode ? "#444" : "#dee2e6"};
    border-radius: 4px;
    list-style: none;
    display: flex;
    align-items: center;
    user-select: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }
  
  .folder-title:hover {
    background: ${isDarkMode ? "#3d3d3d" : "#f8f9fa"};
    border-color: ${isDarkMode ? "#666" : "#007bff"};
  }
  
  .folder-title::-webkit-details-marker {
    display: none;
  }
  
  .folder-icon {
    margin-right: 10px;
    font-size: 12px;
    transition: transform 0.2s ease;
    display: inline-block;
    width: 16px;
    color: ${isDarkMode ? "#888" : "#666"};
  }
  
  .folder-details[open] .folder-icon {
    transform: rotate(90deg);
  }
  
  .export-info {
    background: ${isDarkMode ? "#2d2d2d" : "#f8f9fa"};
    border: 1px solid ${isDarkMode ? "#444" : "#dee2e6"};
    border-radius: 6px;
    padding: 20px;
    margin-bottom: 30px;
    font-size: 13px;
    color: ${isDarkMode ? "#b0b0b0" : "#6c757d"};
  }
  
  .export-info strong {
    color: ${isDarkMode ? "#ffffff" : "#212529"};
  }
  
  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: ${isDarkMode ? "#1a1a1a" : "#f1f1f1"};
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${isDarkMode ? "#555" : "#c1c1c1"};
    border-radius: 4px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${isDarkMode ? "#777" : "#a8a8a8"};
  }
  
  /* Print styles */
  @media print {
    body {
      background: #fff !important;
      color: #000 !important;
      font-size: 12px;
    }
    
    .bookmark-link {
      background: #f9f9f9 !important;
      border-color: #ddd !important;
      color: #000 !important;
    }
    
    .folder-title {
      background: #f5f5f5 !important;
      color: #000 !important;
    }
  }
  
  /* Mobile responsive */
  @media (max-width: 768px) {
    body {
      padding: 20px 15px;
      font-size: 13px;
    }
    
    h1 {
      font-size: 24px;
      padding: 20px;
    }
    
    .bookmark-link {
      padding: 8px 12px;
    }
    
    .bookmark-list {
      margin-left: 15px;
    }
  }
</style>
        `

          const header = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bookmarks Export</title>
  ${cleanCSS}
</head>
<body>
  <h1>📚 My Bookmarks</h1>
  <div class="export-info">
    <strong>EXPORTED:</strong> ${new Date().toLocaleString()}<br>
    <strong>THEME:</strong> ${isDarkMode ? "Dark Mode" : "Light Mode"}<br>
    <strong>TOTAL:</strong> Loading bookmarks...
  </div>
`

          const footer = `
  <script>
    // Count total bookmarks
    const bookmarkCount = document.querySelectorAll('.bookmark-link').length;
    const folderCount = document.querySelectorAll('.folder-title').length;
    const exportInfo = document.querySelector('.export-info');
    exportInfo.innerHTML = exportInfo.innerHTML.replace('Loading bookmarks...', 
      bookmarkCount + ' bookmarks in ' + folderCount + ' folders');
    
    // Add click sound effect
    document.addEventListener('click', function(e) {
      if (e.target.closest('.bookmark-link') || e.target.closest('.folder-title')) {
        // You can add a beep sound here if needed
        console.log('🔊 Click!');
      }
    });
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.folder-title')) {
          e.target.closest('details').toggleAttribute('open');
        }
      }
    });
  </script>
</body>
</html>`

          const htmlString =
            header + bookmarksToHTML(bookmarkTreeNodes) + footer
          const blob = new Blob([htmlString], {
            type: "text/html; charset=utf-8",
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement("a")
          link.href = url
          link.download = `pixel_bookmarks_${
            new Date().toISOString().split("T")[0]
          }.html`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        }
        settingsMenu.classList.add("hidden")
      })
    }
  })

  // Xử lý import bookmarks
  importBookmarksOption.addEventListener("click", () => {
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
                importNonDuplicateBookmarks(bookmarksToImport)
              }
            } else {
              importNonDuplicateBookmarks(bookmarksToImport)
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
    settingsMenu.classList.add("hidden")
  })

  // Hàm nhập các bookmark không trùng lặp
  function importNonDuplicateBookmarks(bookmarksToImport) {
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
      safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
        if (bookmarkTreeNodes) {
          bookmarkTree = bookmarkTreeNodes
          bookmarks = flattenBookmarks(bookmarkTreeNodes)
          folders = getFolders(bookmarkTreeNodes)
          populateFolderFilter(folders)
          updateBookmarkCount()
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
          saveUIState()
          alert(translations[language].importSuccess)
        } else {
          alert(translations[language].importError)
        }
      })
    })
  }

  function toggleDeleteFolderButton() {
    deleteFolderButton.classList.toggle(
      "hidden",
      !uiState.selectedFolderId ||
        uiState.selectedFolderId === "1" ||
        uiState.selectedFolderId === "2"
    )
  }

  deleteFolderButton.addEventListener("click", () => {
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
                    folderFilter.value = ""
                    safeChromeBookmarksCall(
                      "getTree",
                      [],
                      (bookmarkTreeNodes) => {
                        if (bookmarkTreeNodes) {
                          bookmarkTree = bookmarkTreeNodes
                          bookmarks = flattenBookmarks(bookmarkTreeNodes)
                          folders = getFolders(bookmarkTreeNodes)
                          populateFolderFilter(folders)
                          updateBookmarkCount()
                          let filtered = bookmarks
                          if (uiState.searchQuery) {
                            filtered = filtered.filter(
                              (bookmark) =>
                                bookmark.title
                                  ?.toLowerCase()
                                  .includes(uiState.searchQuery) ||
                                bookmark.url
                                  ?.toLowerCase()
                                  .includes(uiState.searchQuery)
                            )
                          }
                          renderFilteredBookmarks(filtered, uiState.sortType)
                          toggleDeleteFolderButton()
                          saveUIState()
                        }
                      }
                    )
                  }
                )
              })
            })
          }
        )
      }
    }
  })

  function populateAddToFolderSelect() {
    const language = localStorage.getItem("appLanguage") || "en"
    addToFolderSelect.innerHTML = `<option value="">${translations[language].selectFolder}</option>`
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
      const language = localStorage.getItem("appLanguage") || "en"
      newFolderInput.placeholder = translations[language].newFolderPlaceholder
      addToFolderPopup.classList.remove("hidden")
      addToFolderSelect.focus()
    }
  })

  createNewFolderButton.addEventListener("click", () => {
    const folderName = newFolderInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"
    if (folderName) {
      safeChromeBookmarksCall(
        "create",
        [{ parentId: "2", title: folderName }],
        (newFolder) => {
          if (newFolder) {
            safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
              if (bookmarkTreeNodes) {
                bookmarkTree = bookmarkTreeNodes
                bookmarks = flattenBookmarks(bookmarkTreeNodes)
                folders = getFolders(bookmarkTreeNodes)
                populateFolderFilter(folders)
                populateAddToFolderSelect()
                let filtered = bookmarks
                if (uiState.selectedFolderId) {
                  filtered = filtered.filter((bookmark) =>
                    isInFolder(bookmark, uiState.selectedFolderId)
                  )
                }
                if (uiState.searchQuery) {
                  filtered = filtered.filter(
                    (bookmark) =>
                      bookmark.title
                        ?.toLowerCase()
                        .includes(uiState.searchQuery) ||
                      bookmark.url?.toLowerCase().includes(uiState.searchQuery)
                  )
                }
                renderFilteredBookmarks(filtered, uiState.sortType)
                newFolderInput.value = ""
                newFolderInput.classList.remove("error")
                addToFolderSelect.value = newFolder.id
                saveUIState()
              }
            })
          }
        }
      )
    } else {
      newFolderInput.classList.add("error")
      newFolderInput.placeholder = translations[language].emptyFolderError
    }
  })

  addToFolderSaveButton.addEventListener("click", () => {
    const targetFolderId = addToFolderSelect.value
    const language = localStorage.getItem("appLanguage") || "en"
    if (targetFolderId) {
      const movePromises = Array.from(selectedBookmarks).map((bookmarkId) => {
        return new Promise((resolve) => {
          safeChromeBookmarksCall(
            "move",
            [bookmarkId, { parentId: targetFolderId }],
            resolve
          )
        })
      })

      Promise.all(movePromises).then(() => {
        safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
          if (bookmarkTreeNodes) {
            bookmarkTree = bookmarkTreeNodes
            bookmarks = flattenBookmarks(bookmarkTreeNodes)
            folders = getFolders(bookmarkTreeNodes)
            populateFolderFilter(folders)
            updateBookmarkCount()
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
            selectedBookmarks.clear()
            addToFolderButton.classList.add("hidden")
            toggleDeleteFolderButton()
            saveUIState()
            alert(translations[language].addToFolderSuccess) // Thông báo thành công
          }
          addToFolderPopup.classList.add("hidden")
        })
      })
    } else {
      newFolderInput.classList.add("error")
      newFolderInput.placeholder = translations[language].selectFolderError
    }
  })

  addToFolderCancelButton.addEventListener("click", () => {
    const folderName = newFolderInput.value.trim()
    const language = localStorage.getItem("appLanguage") || "en"
    if (folderName && !folders.some((f) => f.title === folderName)) {
      if (confirm(translations[language].discardFolderPrompt)) {
        addToFolderPopup.classList.add("hidden")
        newFolderInput.value = ""
        newFolderInput.classList.remove("error")
        newFolderInput.placeholder = translations[language].newFolderPlaceholder
      }
    } else {
      addToFolderPopup.classList.add("hidden")
      newFolderInput.value = ""
      newFolderInput.classList.remove("error")
      newFolderInput.placeholder = translations[language].newFolderPlaceholder
    }
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

  // Khởi động với trạng thái khôi phục
  restoreUIState(() => {
    safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
      if (bookmarkTreeNodes) {
        bookmarkTree = bookmarkTreeNodes
        bookmarks = flattenBookmarks(bookmarkTreeNodes)
        folders = getFolders(bookmarkTreeNodes)
        populateFolderFilter(folders)
        if (
          uiState.selectedFolderId &&
          !folders.some((f) => f.id === uiState.selectedFolderId)
        ) {
          uiState.selectedFolderId = ""
          folderFilter.value = ""
        }
        updateBookmarkCount()
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
      } else {
        const language = localStorage.getItem("appLanguage") || "en"
        folderListDiv.innerHTML = `<p>${translations[language].noBookmarks}</p>`
      }
    })
  })

  function flattenBookmarks(nodes) {
    console.log("Flattening bookmarks, nodes count:", nodes.length)
    let flat = []
    nodes.forEach((node) => {
      if (node.url) flat.push(node)
      if (node.children) flat = flat.concat(flattenBookmarks(node.children))
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
    const language = localStorage.getItem("appLanguage") || "en"
    folderFilter.innerHTML = `<option value="">${translations[language].allBookmarks}</option>`
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
    const language = localStorage.getItem("appLanguage") || "en"
    let count
    if (selectedFolderId) {
      count = bookmarks.filter(
        (b) => b.url && isInFolder(b, selectedFolderId)
      ).length
    } else {
      count = bookmarks.filter((b) => b.url).length
    }
    bookmarkCountDiv.textContent = `${translations[language].totalBookmarks}: ${count}`
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
    const language = localStorage.getItem("appLanguage") || "en"
    renameInput.value = ""
    renameInput.classList.remove("error")
    renameInput.placeholder = translations[language].renamePlaceholder
    renamePopup.classList.remove("hidden")
    renameInput.focus()
    safeChromeBookmarksCall("get", [currentBookmarkId], (bookmark) => {
      if (bookmark && bookmark[0]) {
        renameInput.value = bookmark[0].title || ""
      }
    })
  }

  function createBookmarkElement(bookmark) {
    const language = localStorage.getItem("appLanguage") || "en"
    console.log("Rendering bookmark:", bookmark.id, bookmark.title)
    const div = document.createElement("div")
    div.className = "bookmark-item"
    let favicon
    try {
      favicon = `https://www.google.com/s2/favicons?sz=32&domain=${
        new URL(bookmark.url).hostname
      }`
    } catch (error) {
      favicon = "./images/default-favicon.png" // Favicon mặc định nếu URL không hợp lệ
    }
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
        <button class="dropdown-btn" aria-label="Bookmark options">⋮</button>
        <div class="dropdown-menu hidden">
          <button class="menu-item add-to-folder" data-id="${bookmark.id}">${
      translations[language].addToFolderOption
    }</button>
          <button class="menu-item delete-btn" data-id="${bookmark.id}">${
      translations[language].deleteBookmarkOption
    }</button>
          <button class="menu-item rename-btn" data-id="${bookmark.id}">${
      translations[language].renameBookmarkOption
    }</button>
        </div>
      </div>
    `
    // Gắn sự kiện trực tiếp cho nút Add to Folder
    const addToFolderBtn = div.querySelector(".add-to-folder")
    addToFolderBtn.addEventListener("click", () => {
      selectedBookmarks.clear()
      selectedBookmarks.add(bookmark.id)
      populateAddToFolderSelect()
      newFolderInput.value = ""
      newFolderInput.classList.remove("error")
      const lang = localStorage.getItem("appLanguage") || "en"
      newFolderInput.placeholder = translations[lang].newFolderPlaceholder
      addToFolderPopup.classList.remove("hidden")
      addToFolderSelect.focus()
    })
    return div
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

    document.removeEventListener("click", handleDocumentClick)
    document.addEventListener("click", handleDocumentClick)

    function handleDropdownClick(e) {
      e.stopPropagation()
      const menu = e.target.nextElementSibling
      const isMenuOpen = menu && !menu.classList.contains("hidden")

      document.querySelectorAll(".dropdown-menu").forEach((m) => {
        m.classList.add("hidden")
      })

      if (menu && !isMenuOpen) {
        menu.classList.remove("hidden")
      }
    }

    function handleDocumentClick(e) {
      if (
        !e.target.closest(".dropdown-btn") &&
        !e.target.closest(".dropdown-menu") &&
        !e.target.closest("#settings-button") &&
        !e.target.closest("#settings-menu")
      ) {
        document.querySelectorAll(".dropdown-menu").forEach((menu) => {
          menu.classList.add("hidden")
        })
        settingsMenu.classList.add("hidden")
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
      const language = localStorage.getItem("appLanguage") || "en"
      if (confirm(translations[language].deleteConfirm)) {
        safeChromeBookmarksCall("remove", [bookmarkId], () => {
          safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
            if (bookmarkTreeNodes) {
              bookmarkTree = bookmarkTreeNodes
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              let filtered = bookmarks
              if (uiState.selectedFolderId) {
                filtered = filtered.filter((bookmark) =>
                  isInFolder(bookmark, uiState.selectedFolderId)
                )
              }
              if (uiState.searchQuery) {
                filtered = filtered.filter(
                  (bookmark) =>
                    bookmark.title
                      ?.toLowerCase()
                      .includes(uiState.searchQuery) ||
                    bookmark.url?.toLowerCase().includes(uiState.searchQuery)
                )
              }
              renderFilteredBookmarks(filtered, uiState.sortType)
              saveUIState()
              alert(translations[language].deleteBookmarkSuccess) // Thông báo xóa thành công
            }
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

  function renderAllBookmarks(bookmarksList) {
    console.log("Rendering all bookmarks, count:", bookmarksList.length)
    const language = localStorage.getItem("appLanguage") || "en"
    const fragment = document.createDocumentFragment()
    const selectAllDiv = document.createElement("div")
    selectAllDiv.className = "select-all"
    selectAllDiv.innerHTML = `
      <input type="checkbox" id="select-all" style="display: ${
        checkboxesVisible ? "inline-block" : "none"
      }">
      <label for="select-all">${translations[language].selectAll}</label>
    `
    fragment.appendChild(selectAllDiv)

    uiState.sortType = sortFilter.value || "default"
    uiState.searchQuery = searchInput.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value

    const sortedBookmarks = sortBookmarks(bookmarksList, uiState.sortType)
    sortedBookmarks.forEach((bookmark) => {
      if (bookmark.url) {
        fragment.appendChild(createBookmarkElement(bookmark))
      }
    })

    folderListDiv.innerHTML = ""
    folderListDiv.appendChild(fragment)

    searchInput.value = uiState.searchQuery
    folderFilter.value = uiState.selectedFolderId
    sortFilter.value = uiState.sortType

    const selectAllCheckbox = document.getElementById("select-all")
    selectAllCheckbox.removeEventListener("change", handleSelectAll)
    selectAllCheckbox.addEventListener("change", handleSelectAll)

    attachDropdownListeners()
    toggleDeleteFolderButton()
    saveUIState()

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
    console.log("Rendering folder list, nodes count:", nodes.length)
    const language = localStorage.getItem("appLanguage") || "en"
    const fragment = document.createDocumentFragment()
    const selectAllDiv = document.createElement("div")
    selectAllDiv.className = "select-all"
    selectAllDiv.innerHTML = `
      <input type="checkbox" id="select-all" style="display: ${
        checkboxesVisible ? "inline-block" : "none"
      }">
      <label for="select-all">${translations[language].selectAll}</label>
    `
    fragment.appendChild(selectAllDiv)

    uiState.sortType = sortFilter.value || "default"
    uiState.searchQuery = searchInput.value.toLowerCase()
    uiState.selectedFolderId = folderFilter.value

    const sortedBookmarks = sortBookmarks(
      flattenBookmarks(nodes).filter((b) => b.url),
      uiState.sortType
    )

    if (!uiState.selectedFolderId && !uiState.searchQuery) {
      nodes.forEach((folder) => {
        if (folder.children) {
          const div = document.createElement("div")
          div.className = "folder-item"

          const folderButton = document.createElement("button")
          folderButton.className = "folder-button"
          folderButton.textContent =
            folder.title ||
            translations[language].unnamedFolder ||
            "Unnamed Folder"
          folderButton.addEventListener("click", () => {
            const dropdown = div.querySelector(".dropdown")
            if (dropdown) {
              dropdown.classList.toggle("hidden")
            }
          })

          const dropdown = document.createElement("div")
          dropdown.className = "dropdown hidden"
          sortedBookmarks
            .filter((bookmark) => isInFolder(bookmark, folder.id))
            .forEach((bookmark) => {
              dropdown.appendChild(createBookmarkElement(bookmark))
            })

          if (!["1", "2"].includes(folder.id)) {
            const deleteFolderBtn = document.createElement("button")
            deleteFolderBtn.className = "delete-folder"
            deleteFolderBtn.textContent = translations[language].deleteFolder
            deleteFolderBtn.addEventListener("click", () => {
              if (confirm(translations[language].deleteFolderConfirm)) {
                safeChromeBookmarksCall("removeTree", [folder.id], () => {
                  safeChromeBookmarksCall(
                    "getTree",
                    [],
                    (bookmarkTreeNodes) => {
                      if (bookmarkTreeNodes) {
                        bookmarkTree = bookmarkTreeNodes
                        bookmarks = flattenBookmarks(bookmarkTreeNodes)
                        folders = getFolders(bookmarkTreeNodes)
                        populateFolderFilter(folders)
                        updateBookmarkCount()
                        let filtered = bookmarks
                        if (uiState.searchQuery) {
                          filtered = filtered.filter(
                            (bookmark) =>
                              bookmark.title
                                ?.toLowerCase()
                                .includes(uiState.searchQuery) ||
                              bookmark.url
                                ?.toLowerCase()
                                .includes(uiState.searchQuery)
                          )
                        }
                        renderFilteredBookmarks(filtered, uiState.sortType)
                        saveUIState()
                      }
                    }
                  )
                })
              }
            })
            folderButton.appendChild(deleteFolderBtn)
          }

          div.appendChild(folderButton)
          div.appendChild(dropdown)
          fragment.appendChild(div)
        }
      })
    } else {
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
      filtered.forEach((bookmark) => {
        if (bookmark.url) {
          fragment.appendChild(createBookmarkElement(bookmark))
        }
      })
    }

    folderListDiv.innerHTML = ""
    folderListDiv.appendChild(fragment)

    searchInput.value = uiState.searchQuery
    folderFilter.value = uiState.selectedFolderId
    sortFilter.value = uiState.sortType

    const selectAllCheckbox = document.getElementById("select-all")
    selectAllCheckbox.removeEventListener("change", handleSelectAll)
    selectAllCheckbox.addEventListener("change", handleSelectAll)

    attachDropdownListeners()
    toggleDeleteFolderButton()
    saveUIState()

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

  function debounce(func, wait) {
    let timeout
    return function (...args) {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), wait)
    }
  }

  searchInput.addEventListener(
    "input",
    debounce((e) => {
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
      saveUIState()
    }, 150)
  )

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
      saveUIState()
    })
  }

  folderFilter.addEventListener("change", () => {
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
    renderFilteredBookmarks(filtered, uiState.sortType)
    updateBookmarkCount()
    toggleDeleteFolderButton()
    saveUIState()
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
    renderFilteredBookmarks(filtered, uiState.sortType)
    updateBookmarkCount()
    toggleDeleteFolderButton()
    saveUIState()
  })

  createFolderButton.addEventListener("click", () => {
    const language = localStorage.getItem("appLanguage") || "en"
    const folderName = prompt(translations[language].newFolderPlaceholder)
    if (folderName) {
      safeChromeBookmarksCall(
        "create",
        [{ parentId: "2", title: folderName }],
        () => {
          safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
            if (bookmarkTreeNodes) {
              bookmarkTree = bookmarkTreeNodes
              bookmarks = flattenBookmarks(bookmarkTreeNodes)
              folders = getFolders(bookmarkTreeNodes)
              populateFolderFilter(folders)
              updateBookmarkCount()
              let filtered = bookmarks
              if (uiState.selectedFolderId) {
                filtered = filtered.filter((bookmark) =>
                  isInFolder(bookmark, uiState.selectedFolderId)
                )
              }
              if (uiState.searchQuery) {
                filtered = filtered.filter(
                  (bookmark) =>
                    bookmark.title
                      ?.toLowerCase()
                      .includes(uiState.searchQuery) ||
                    bookmark.url?.toLowerCase().includes(uiState.searchQuery)
                )
              }
              renderFilteredBookmarks(filtered, uiState.sortType)
              toggleDeleteFolderButton()
              saveUIState()
            }
          })
        }
      )
    }
  })

  function isInFolder(bookmark, folderId) {
    let node = bookmark
    while (node && node.parentId) {
      if (node.parentId === folderId) return true
      node = bookmarks.find((b) => b.id === node.parentId) || null
      if (!node) break
    }
    return false
  }

  function renderFilteredBookmarks(filtered, sortType) {
    console.log("Rendering filtered bookmarks, count:", filtered.length)
    const language = localStorage.getItem("appLanguage") || "en"
    const fragment = document.createDocumentFragment()
    const selectAllDiv = document.createElement("div")
    selectAllDiv.className = "select-all"
    selectAllDiv.innerHTML = `
      <input type="checkbox" id="select-all" style="display: ${
        checkboxesVisible ? "inline-block" : "none"
      }">
      <label for="select-all">${translations[language].selectAll}</label>
    `
    fragment.appendChild(selectAllDiv)

    const sortedBookmarks = sortBookmarks(filtered, sortType)
    sortedBookmarks.forEach((bookmark) => {
      if (bookmark.url) {
        fragment.appendChild(createBookmarkElement(bookmark))
      }
    })

    folderListDiv.innerHTML = ""
    folderListDiv.appendChild(fragment)

    searchInput.value = uiState.searchQuery
    folderFilter.value = uiState.selectedFolderId
    sortFilter.value = uiState.sortType

    const selectAllCheckbox = document.getElementById("select-all")
    selectAllCheckbox.removeEventListener("change", handleSelectAll)
    selectAllCheckbox.addEventListener("change", handleSelectAll)

    attachDropdownListeners()
    toggleDeleteFolderButton()
    saveUIState()

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

export const translations = {
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
    showCheckboxes: "Hiển thị CheckBox",
    hideCheckboxes: "Ẩn CheckBox",
    searchPlaceholder: "Tìm kiếm Boolmarks...",
    renameTitle: "Đổi tên",
    renamePlaceholder: "Nhập tên mới...",
    addToFolderTitle: "Thêm vào Thư mục",
    selectFolder: "Chọn Thư mục",
    newFolderPlaceholder: "Nhập tên thư mục muốn thêm",
    createNewFolder: "Tạo",
    save: "Lưu",
    cancel: "Hủy",
    totalBookmarks: "Tổng Bookmarks",
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

export function safeChromeBookmarksCall(method, args, callback) {
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

export function debounce(func, wait) {
  let timeout
  return function (...args) {
    clearTimeout(timeout)
    timeout = setTimeout(() => func.apply(this, args), wait)
  }
}

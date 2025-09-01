// ./components/controller/deleteFolder.js
import { translations, safeChromeBookmarksCall } from "../utils.js"
import { getBookmarkTree, flattenBookmarks } from "../bookmarks.js"
import { renderFilteredBookmarks } from "../ui.js"
import { uiState } from "../state.js"

export function setupDeleteFolderListeners(elements) {
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
}

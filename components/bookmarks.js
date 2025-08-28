import { safeChromeBookmarksCall } from "./utils.js"
import {
  setBookmarks,
  setFolders,
  setBookmarkTree,
  uiState,
  selectedBookmarks,
} from "./state.js"
import { renderFilteredBookmarks } from "./ui.js"

export function getBookmarkTree(callback) {
  safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
    if (bookmarkTreeNodes) {
      setBookmarkTree(bookmarkTreeNodes)
      setBookmarks(flattenBookmarks(bookmarkTreeNodes))
      setFolders(getFolders(bookmarkTreeNodes))
    }
    callback(bookmarkTreeNodes)
  })
}

export function flattenBookmarks(nodes) {
  console.log("Flattening bookmarks, nodes count:", nodes.length)
  let flat = []
  nodes.forEach((node) => {
    if (node.url) flat.push(node)
    if (node.children) flat = flat.concat(flattenBookmarks(node.children))
  })
  return flat
}

export function getFolders(nodes) {
  let folderList = []
  nodes.forEach((node) => {
    if (node.children) {
      folderList.push({ id: node.id, title: node.title || "Unnamed Folder" })
      folderList = folderList.concat(getFolders(node.children))
    }
  })
  return folderList
}

export function isInFolder(bookmark, folderId) {
  let node = bookmark
  while (node && node.parentId) {
    if (node.parentId === folderId) return true
    node = uiState.bookmarks.find((b) => b.id === node.parentId) || null
    if (!node) break
  }
  return false
}

export function moveBookmarksToFolder(
  bookmarkIds,
  targetFolderId,
  elements,
  callback
) {
  const language = localStorage.getItem("appLanguage") || "en"
  console.log(
    "Moving bookmarks to folder:",
    targetFolderId,
    "Bookmarks:",
    bookmarkIds
  )

  const movePromises = bookmarkIds.map((bookmarkId) => {
    return new Promise((resolve, reject) => {
      console.log(`Moving bookmark ${bookmarkId} to folder ${targetFolderId}`)
      safeChromeBookmarksCall(
        "move",
        [bookmarkId, { parentId: targetFolderId }],
        (result) => {
          if (result) {
            console.log(`Bookmark ${bookmarkId} moved successfully.`)
            resolve(result)
          } else {
            console.error(`Failed to move bookmark ${bookmarkId}`)
            reject(new Error(`Failed to move bookmark ${bookmarkId}`))
          }
        }
      )
    })
  })

  Promise.allSettled(movePromises)
    .then((results) => {
      const errors = results
        .filter((r) => r.status === "rejected")
        .map((r) => r.reason)
      if (errors.length > 0) {
        console.error("Errors during bookmark move:", errors)
        alert(translations[language].errorUnexpected)
      } else {
        console.log("All bookmarks moved successfully.")
        getBookmarkTree((bookmarkTreeNodes) => {
          if (bookmarkTreeNodes) {
            renderFilteredBookmarks(bookmarkTreeNodes, elements)
            selectedBookmarks.clear()
            elements.addToFolderButton.classList.add("hidden")
            alert(translations[language].addToFolderSuccess)
          } else {
            console.error("Failed to fetch bookmark tree after move.")
            alert(translations[language].errorUnexpected)
          }
          callback()
        })
      }
    })
    .catch((error) => {
      console.error("Unexpected error in movePromises:", error)
      alert(translations[language].errorUnexpected)
      callback()
    })
}

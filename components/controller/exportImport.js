// ./components/controller/exportImport.js
import {
  translations,
  safeChromeBookmarksCall,
  showCustomPopup,
} from "../utils.js"
import { flattenBookmarks, getBookmarkTree, getFolders } from "../bookmarks.js"
import { renderFilteredBookmarks } from "../ui.js"
import { uiState, saveUIState } from "../state.js"

export function setupExportImportListeners(elements) {
  elements.exportBookmarksOption.addEventListener("click", () => {
    const language = localStorage.getItem("appLanguage") || "en"
    const currentTheme = document.body.getAttribute("data-theme") || "dark"
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
    document.body.appendChild(popup)

    document.getElementById("confirmExport").addEventListener("click", () => {
      const exportChoice = document
        .getElementById("exportFormat")
        .value.toUpperCase()
      safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
        if (!bookmarkTreeNodes) {
          showCustomPopup(
            translations[language].errorUnexpected ||
              "Unexpected error occurred",
            "error",
            false
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
  <title>Bookmarks Collection</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #ffffff;
      color: #333333;
      line-height: 1.6;
      padding: 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 30px;
      padding: 20px;
      border-bottom: 2px solid #000000;
    }

    .header h1 {
      font-size: 2.5rem;
      color: #000000;
      margin-bottom: 10px;
      font-weight: 700;
    }

    .header p {
      font-size: 1.1rem;
      color: #666666;
    }

    .export-info {
      background-color: #f8f9fa;
      padding: 15px;
      border: 1px solid #dee2e6;
      border-radius: 5px;
      margin-bottom: 20px;
      text-align: center;
    }

    .controls {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding: 15px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 5px;
      flex-wrap: wrap;
      gap: 10px;
    }

    #searchInput {
      flex: 1;
      max-width: 400px;
      padding: 10px 15px;
      border: 2px solid #333333;
      border-radius: 5px;
      font-size: 1rem;
      background-color: #ffffff;
      color: #333333;
    }

    #searchInput:focus {
      outline: none;
      border-color: #000000;
      background-color: #f8f9fa;
    }

    .view-controls {
      display: flex;
      gap: 10px;
    }

    .view-toggle {
      padding: 8px 16px;
      border: 2px solid #333333;
      border-radius: 5px;
      background-color: #ffffff;
      color: #333333;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .view-toggle.active,
    .view-toggle:hover {
      background-color: #000000;
      color: #ffffff;
    }

    .stats {
      text-align: center;
      margin: 20px 0;
      padding: 15px;
      background-color: #000000;
      color: #ffffff;
      border-radius: 5px;
      font-weight: 600;
    }

    .bookmark-list {
      list-style: none;
    }

    .bookmark-item {
      background-color: #ffffff;
      margin-bottom: 8px;
      padding: 15px;
      border: 1px solid #dee2e6;
      border-radius: 5px;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .bookmark-item:hover {
      background-color: #f8f9fa;
      border-color: #333333;
      transform: translateX(5px);
    }

    .bookmark-icon {
      width: 16px;
      height: 16px;
      min-width: 16px;
      min-height: 16px;
      border-radius: 2px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
    }

    .bookmark-item a {
      text-decoration: none;
      color: #333333;
      font-size: 1rem;
      font-weight: 500;
      flex: 1;
      word-break: break-all;
    }

    .bookmark-item a:hover {
      color: #000000;
      text-decoration: underline;
    }

    .bookmark-url {
      font-size: 0.85rem;
      color: #666666;
      margin-top: 4px;
      word-break: break-all;
    }

    .bookmark-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 15px;
    }

    .bookmark-grid .bookmark-item {
      flex-direction: column;
      text-align: center;
      padding: 20px;
      gap: 8px;
    }

    .bookmark-grid .bookmark-icon {
      align-self: center;
      width: 24px;
      height: 24px;
      min-width: 24px;
      min-height: 24px;
    }

    .folder {
      background-color: #000000;
      color: #ffffff;
      font-weight: bold;
      margin: 15px 0 5px 0;
      padding: 12px 20px;
      border-radius: 5px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .folder-icon {
      font-size: 1.2rem;
    }

    .hidden {
      display: none;
    }

    .no-results {
      text-align: center;
      padding: 40px;
      color: #666666;
      font-size: 1.2rem;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 5px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .container {
        padding: 10px;
      }
      
      .controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      #searchInput {
        max-width: none;
      }
      
      .bookmark-grid {
        grid-template-columns: 1fr;
      }
      
      .header h1 {
        font-size: 2rem;
      }
    }

    /* Dark mode media query */
    @media (prefers-color-scheme: dark) {
      body {
        background-color: #121212;
        color: #e0e0e0;
      }

      .header {
        border-bottom-color: #ffffff;
      }

      .header h1 {
        color: #ffffff;
      }

      .export-info,
      .controls {
        background-color: #1e1e1e;
        border-color: #333333;
      }

      #searchInput {
        background-color: #1e1e1e;
        color: #e0e0e0;
        border-color: #666666;
      }

      #searchInput:focus {
        border-color: #ffffff;
        background-color: #2a2a2a;
      }

      .view-toggle {
        background-color: #1e1e1e;
        color: #e0e0e0;
        border-color: #666666;
      }

      .view-toggle.active,
      .view-toggle:hover {
        background-color: #ffffff;
        color: #000000;
      }

      .stats {
        background-color: #ffffff;
        color: #000000;
      }

      .bookmark-item {
        background-color: #1e1e1e;
        border-color: #333333;
      }

      .bookmark-item:hover {
        background-color: #2a2a2a;
        border-color: #666666;
      }

      .bookmark-item a {
        color: #e0e0e0;
      }

      .bookmark-item a:hover {
        color: #ffffff;
      }

      .bookmark-url {
        color: #999999;
      }

      .bookmark-icon {
        background-color: #2a2a2a;
        border-color: #444444;
      }

      .folder {
        background-color: #ffffff;
        color: #000000;
      }

      .no-results {
        background-color: #1e1e1e;
        border-color: #333333;
        color: #999999;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📚 Bookmarks Collection</h1>
      <p>Manage and search your bookmarks with ease</p>
    </div>

    <div class="export-info">
      <strong>Export Date:</strong> ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}
    </div>

    <div class="controls">
      <input type="text" id="searchInput" placeholder="🔍 Search bookmarks...">
      <div class="view-controls">
        <button class="view-toggle active" onclick="toggleView('list')">📋 List</button>
        <button class="view-toggle" onclick="toggleView('grid')">🎯 Grid</button>
      </div>
    </div>

    <div class="stats">
      <span id="totalBookmarks">0</span> bookmarks found
    </div>

    <ul id="bookmarkList" class="bookmark-list"></ul>
    <div id="bookmarkGrid" class="bookmark-grid hidden"></div>
    <div id="noResults" class="no-results hidden">
      😔 No bookmarks found matching your search
    </div>
  </div>

  <script>
    const bookmarks = ${JSON.stringify(bookmarkTreeNodes)};
    const listContainer = document.getElementById("bookmarkList");
    const gridContainer = document.getElementById("bookmarkGrid");
    const searchInput = document.getElementById("searchInput");
    const totalBookmarksSpan = document.getElementById("totalBookmarks");
    const noResults = document.getElementById("noResults");

    let totalCount = 0;
    let currentView = 'list';

    // Function to get favicon URL
    function getFaviconUrl(url) {
      try {
        const urlObj = new URL(url);
        return \`https://www.google.com/s2/favicons?domain=\${urlObj.hostname}&sz=32\`;
      } catch (e) {
        return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>';
      }
    }

    function createBookmarkElement(node, isGrid = false) {
      const element = document.createElement(isGrid ? "div" : "li");
      element.className = "bookmark-item";
      
      const favicon = getFaviconUrl(node.url);
      const displayTitle = node.title || new URL(node.url).hostname;
      const shortUrl = node.url.length > 60 ? node.url.substring(0, 60) + '...' : node.url;
      
      element.innerHTML = \`
        <img class="bookmark-icon" src="\${favicon}" alt="Icon" onerror="this.style.display='none'">
        <div style="flex: 1;">
          <a href="\${node.url}" target="_blank" title="\${node.url}">\${displayTitle}</a>
          \${!isGrid ? \`<div class="bookmark-url">\${shortUrl}</div>\` : ''}
        </div>
      \`;
      
      return element;
    }

    function renderBookmarks(nodes, parent = listContainer, gridParent = gridContainer, depth = 0) {
      if (!nodes || !Array.isArray(nodes)) return;
      
      nodes.forEach((node, index) => {
        setTimeout(() => {
          if (node.url) {
            totalCount++;
            
            // List view
            const listItem = createBookmarkElement(node, false);
            parent.appendChild(listItem);

            // Grid view
            const gridItem = createBookmarkElement(node, true);
            gridParent.appendChild(gridItem);
          }
          
          if (node.children && node.children.length > 0) {
            // List view folder
            const folder = document.createElement("li");
            folder.className = "folder";
            folder.innerHTML = \`
              <span class="folder-icon">📁</span>
              <span>\${node.title || "Unnamed Folder"}</span>
            \`;
            parent.appendChild(folder);
            
            // Grid view folder
            const gridFolder = document.createElement("div");
            gridFolder.className = "folder bookmark-item";
            gridFolder.innerHTML = \`
              <span class="folder-icon">📁</span>
              <span>\${node.title || "Unnamed Folder"}</span>
            \`;
            gridParent.appendChild(gridFolder);

            renderBookmarks(node.children, parent, gridParent, depth + 1);
          }
        }, index * 20);
      });
    }

    function toggleView(view) {
      const buttons = document.querySelectorAll('.view-toggle');
      buttons.forEach(btn => btn.classList.remove('active'));
      
      if (view === "list") {
        listContainer.classList.remove("hidden");
        gridContainer.classList.add("hidden");
        buttons[0].classList.add('active');
      } else {
        listContainer.classList.add("hidden");
        gridContainer.classList.remove("hidden");
        buttons[1].classList.add('active');
      }
      currentView = view;
    }

    function filterBookmarks() {
      const query = searchInput.value.toLowerCase();
      const items = document.querySelectorAll(".bookmark-item");
      let visibleCount = 0;
      
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const link = item.querySelector('a');
        const url = link ? link.href.toLowerCase() : '';
        const isVisible = text.includes(query) || url.includes(query);
        
        item.style.display = isVisible ? "" : "none";
        if (isVisible && link) {
          visibleCount++;
        }
      });

      // Also handle folders
      const folders = document.querySelectorAll(".folder");
      folders.forEach(folder => {
        const text = folder.textContent.toLowerCase();
        const isVisible = text.includes(query);
        folder.style.display = isVisible ? "" : "none";
      });

      totalBookmarksSpan.textContent = visibleCount;
      noResults.classList.toggle('hidden', visibleCount > 0 || query === '');
    }

    function updateStats() {
      totalBookmarksSpan.textContent = totalCount;
    }

    // Event listeners
    searchInput.addEventListener("input", filterBookmarks);

    // Initialize
    renderBookmarks(bookmarks);
    setTimeout(updateStats, 1000);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault();
        searchInput.focus();
      }
      if (e.key === 'Escape') {
        searchInput.value = '';
        filterBookmarks();
      }
    });
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

    document.getElementById("cancelExport").addEventListener("click", () => {
      document.body.removeChild(popup)
    })

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
  })

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
            showCustomPopup(
              translations[language].importInvalidFile || "Invalid file format",
              "error",
              false
            )
            return
          }

          safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
            if (!bookmarkTreeNodes) {
              const language = localStorage.getItem("appLanguage") || "en"
              showCustomPopup(
                translations[language].importError ||
                  "Failed to fetch bookmark tree",
                "error",
                false
              )
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

            const language = localStorage.getItem("appLanguage") || "en"
            if (duplicateBookmarks.length > 0) {
              showCustomPopup(
                `${
                  translations[language].importDuplicatePrompt ||
                  "Duplicate bookmarks found"
                }: ${duplicateBookmarks.length}`,
                "warning",
                true,
                () => importNonDuplicateBookmarks(bookmarksToImport, elements)
              )
            } else {
              importNonDuplicateBookmarks(bookmarksToImport, elements)
            }
          })
        } catch (error) {
          console.error("Error parsing import file:", error)
          const language = localStorage.getItem("appLanguage") || "en"
          showCustomPopup(
            translations[language].importInvalidFile || "Invalid file format",
            "error",
            false
          )
        }
      }
      reader.readAsText(file)
    })
    input.click()
    elements.settingsMenu.classList.add("hidden")
  })
}

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
    safeChromeBookmarksCall("getTree", [], (bookmarkTreeNodes) => {
      if (bookmarkTreeNodes) {
        uiState.bookmarkTree = bookmarkTreeNodes
        uiState.bookmarks = flattenBookmarks(bookmarkTreeNodes)
        uiState.folders = getFolders(bookmarkTreeNodes)
        renderFilteredBookmarks(bookmarkTreeNodes, elements)
        saveUIState()
        showCustomPopup(
          translations[language].importSuccess ||
            "Bookmarks imported successfully!",
          "success"
        )
      } else {
        showCustomPopup(
          translations[language].importError || "Failed to update bookmarks",
          "error",
          false
        )
      }
    })
  })
}

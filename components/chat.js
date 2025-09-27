// components/chat.js
import {
  translations,
  showCustomPopup,
  showCustomConfirm,
  showCustomGuide,
} from "./utils.js"

document.addEventListener("DOMContentLoaded", () => {
  const chatToggle = document.getElementById("chat-toggle")
  const chatbox = document.getElementById("chatbox")
  const chatInput = document.getElementById("chat-input")
  const chatSend = document.getElementById("chat-send")
  const chatClear = document.getElementById("chat-clear")
  const chatMessages = document.getElementById("chatbox-messages")
  const chatClose = document.getElementById("chat-close")
  const chatMaximize = document.getElementById("chat-maximize")
  const chatScrollBottom = document.getElementById("chat-scroll-bottom")
  const aiConfigPopup = document.getElementById("ai-config-popup")
  const aiModelSelect = document.getElementById("ai-model-select")
  const apiKeyInput = document.getElementById("api-key-input")
  const curlInput = document.getElementById("curl-input")
  const clearApiKey = document.getElementById("clear-api-key")
  const clearCurl = document.getElementById("clear-curl")
  const aiConfigSave = document.getElementById("ai-config-save")
  const aiConfigCancel = document.getElementById("ai-config-cancel")
  const chatEditConfig = document.getElementById("chat-edit-config")
  const chatHelp = document.getElementById("chat-help")
  const chatHistoryBtn = document.getElementById("chat-history")

  // System Prompt (unchanged from previous version)
  const systemPrompt = `
        You are a friendly and conversational bookmark management assistant integrated into a browser extension. Your role is to help users manage their bookmarks using natural language or specific commands, interpreting their intent flexibly and responding in a warm, engaging tone in the user's language (e.g., Vietnamese if the query is in Vietnamese). Use casual, human-like phrasing to make interactions feel natural, like a helpful friend. You have access to Chrome Bookmarks API to perform actions like:
        - Counting bookmarks ("how many bookmarks do I have?").
        - Counting folders ("how many folders do I have?").
        - Listing bookmarks ("list my bookmarks").
        - Listing folders ("list my folders").
        - Listing bookmarks in a folder ("list bookmarks in folder <folder>").
        - Adding bookmarks ("bookmark add <URL> [title <title>] [to folder <folder>]"). Check if the URL already exists; if it does, suggest not adding or ask for confirmation.
        - Moving bookmarks ("move bookmark 'title' to folder 'folder'" or "move bookmark ID <bookmarkId> to folder <folder>"). If multiple bookmarks with the same title, specify or ask for clarification.
        - Editing bookmarks ("edit bookmark <URL> [title <new_title>] [to folder <new_folder>]" or "change bookmark title <old_title> to <new_title> [in folder <folder>]" or "rename bookmark ID <bookmarkId> to <new_title>"). If only a title is provided, search by title; if multiple matches, ask for clarification or use folder context.
        - Deleting bookmarks ("delete bookmark <URL>" or "delete bookmark titled <title>" or "delete bookmark ID <bookmarkId>"). If duplicate URLs or titles, delete all or specify.
        - Searching bookmarks ("search bookmark <keyword>").
        - Searching folders ("search folder <keyword>"). If multiple folders with the same name, report an error.
        - Marking/unmarking bookmarks as favorite ("make bookmark <title> a favorite" or "remove bookmark <title> from favorites" or "make bookmark ID <bookmarkId> a favorite"). If multiple bookmarks with the same title, ask for clarification or use folder context.
        For natural language queries, interpret the user's intent and provide a JSON response with:
        - "action": the bookmark action (count, count_folders, list, list_folders, list_bookmarks_in_folder, add, move, edit, delete, search_bookmark, search_folder, favorite, general).
        - "params": parameters needed for the action (e.g., { url, title, folder, keyword, bookmarkId, favorite }).
        - "response": a conversational, friendly response in the user's language, summarizing the action or explaining issues (e.g., "Tui tìm thấy hai bookmark tên 'ChickenSoup'. Bạn muốn chọn cái nào để đánh dấu yêu thích?").
        If the query is unclear or not bookmark-related (e.g., "hello", "what time is it?", vague terms like "hmm"), return a conversational fallback response encouraging clarification, like:
        - Vietnamese: "Hì, tui chưa hiểu lắm! Bạn muốn làm gì với bookmark? Thử nói kiểu như 'xóa bookmark ID 123' hoặc 'đổi tên bookmark ChickenSoup thành ChickenSoup2698' nhé!"
        - English: "Hey, I'm not quite sure what you mean! What do you want to do with your bookmarks? Try something like 'delete bookmark ID 123' or 'rename bookmark ChickenSoup to ChickenSoup2698'!"
        Always return JSON format: { "action": string, "params": object, "response": string (optional) }.
        Example for non-bookmark or unmatched queries:
        - Query: "What day is it today?" or "hello"
          Response: { "action": "general", "response": "Hì, tui chưa hiểu lắm! Bạn muốn làm gì với bookmark? Thử nói kiểu như 'xóa bookmark ID 123' hoặc 'đổi tên bookmark ChickenSoup thành ChickenSoup2698' nhé!" }
        Example for bookmark ID queries:
        - Query: "Xóa bookmark ID 123"
          Response: { "action": "delete", "params": { "bookmarkId": "123" }, "response": "Tui đang xóa bookmark với ID 123 nha..." }
        - Query: "Đổi tên bookmark ID 456 thành NewTitle"
          Response: { "action": "edit", "params": { "bookmarkId": "456", "new_title": "NewTitle" }, "response": "Tui đang đổi tên bookmark ID 456 thành 'NewTitle' nha..." }
        - Query: "Làm bookmark ID 789 thành yêu thích"
          Response: { "action": "favorite", "params": { "bookmarkId": "789", "favorite": true }, "response": "Tui đang đánh dấu bookmark ID 789 là yêu thích nha..." }
        If multiple bookmarks match the title, return:
        - { "action": "general", "response": "Tui tìm thấy nhiều bookmark tên 'ChickenSoup'. Bạn muốn chỉnh sửa cái nào? Hãy cung cấp ID, URL hoặc thư mục nha!" }
    `

  // Language support
  const getLanguage = () => localStorage.getItem("appLanguage") || "en"
  const t = (key) => translations[getLanguage()][key] || key

  // Set button titles dynamically
  if (chatToggle) chatToggle.title = t("chatToggle")
  if (chatHelp) chatHelp.title = t("helpGuideTitle")
  if (chatHistoryBtn) chatHistoryBtn.title = t("exportChatHistory")
  if (chatMaximize) chatMaximize.title = t("maximizeMinimize")
  if (chatEditConfig) chatEditConfig.title = t("editAIConfig")
  if (chatClose) chatClose.title = t("closeChat")

  // Chat history management
  let chatHistory = []

  const getChatHistory = () => {
    return chatHistory
  }

  const saveChatHistory = (history) => {
    chatHistory = history
  }

  const addToChatHistory = (type, content, timestamp) => {
    const history = getChatHistory()
    history.push({ type, content, timestamp })
    saveChatHistory(history)
  }

  window.addEventListener("beforeunload", () => {
    chatHistory = []
  })

  const exportChatHistory = () => {
    const history = getChatHistory()
    if (history.length === 0) {
      showCustomPopup(t("noChatHistory"), "error", true)
      return
    }

    showCustomConfirm(
      t("exportPrompt")?.replace("JSON hoặc HTML", "TXT") ||
        "Export chat history as TXT?",
      () => {
        const txtContent = history
          .map(
            (msg) =>
              `[${msg.timestamp}] ${msg.type.toUpperCase()}: ${msg.content}`
          )
          .join("\n\n---\n\n")
        const blob = new Blob([txtContent], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        const now = new Date()
        const formattedDateTime = now
          .toISOString()
          .replace(/T/, "-")
          .replace(/:/g, "-")
          .split(".")[0]
        a.download = `chat-history-${formattedDateTime}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        showCustomPopup(t("successTitle"), "success", true)
      },
      () => {
        showCustomPopup(t("cancel") || "Cancelled", "success", true)
      }
    )
  }

  // Load saved AI config
  const getAiConfig = () => {
    const config = localStorage.getItem("aiConfig")
    return config ? JSON.parse(config) : { model: "", apiKey: "", curl: "" }
  }

  // Save AI config
  const saveAiConfig = (model, apiKey, curl) => {
    localStorage.setItem("aiConfig", JSON.stringify({ model, apiKey, curl }))
  }

  // Validate URL
  const isValidUrl = (url) => {
    try {
      new URL(url)
      return url.includes("http")
    } catch {
      return false
    }
  }

  // Build API request for Gemini
  const buildApiRequest = (url, apiKey, model, message) => {
    try {
      let apiUrl = url
      const headers = { "Content-Type": "application/json" }
      let body

      if (model === "gemini") {
        if (!apiUrl.includes("generateContent")) {
          apiUrl =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent"
        }
        apiUrl = apiUrl.includes("?key=")
          ? apiUrl.replace(/(\?key=)[^&]+/, `$1${apiKey}`)
          : apiUrl + (apiUrl.includes("?") ? "&" : "?") + `key=${apiKey}`
        body = {
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
          systemInstruction: {
            parts: [{ text: systemPrompt }],
          },
          generationConfig: {
            maxOutputTokens: 1024,
            temperature: 0.7,
            topP: 0.8,
            responseMimeType: "application/json",
          },
          safetySettings: [
            {
              category: "HARM_CATEGORY_HARASSMENT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_HATE_SPEECH",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
              threshold: "BLOCK_NONE",
            },
            {
              category: "HARM_CATEGORY_DANGEROUS_CONTENT",
              threshold: "BLOCK_NONE",
            },
          ],
        }
      } else if (model === "gpt") {
        headers["Authorization"] = `Bearer ${apiKey}`
        body = {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          response_format: { type: "json_object" },
        }
      } else {
        headers["x-api-key"] = apiKey
        body = {
          prompt: `${systemPrompt}\n${message}`,
        }
      }

      console.log("Built API Request:", {
        url: apiUrl,
        model,
        body: JSON.stringify(body, null, 2),
      })

      return { url: apiUrl, headers, body, method: "POST" }
    } catch (error) {
      console.error("Failed to build API request:", error)
      showCustomPopup(
        `${t("errorTitle") || "Error"}: Invalid API URL - ${error.message}`,
        "error",
        true
      )
      return null
    }
  }

  // Suggest bookmark details
  async function suggestBookmarkDetails(url) {
    const config = getAiConfig()
    const apiRequest = buildApiRequest(
      config.curl,
      config.apiKey,
      config.model,
      `Analyze the website at ${url} and suggest a title and folder for the bookmark. Return JSON: { "title": string, "folder": string }`
    )
    if (!apiRequest) {
      throw new Error(t("errorUnexpected") || "Invalid API URL")
    }
    try {
      const response = await fetch(apiRequest.url, {
        method: "POST",
        headers: apiRequest.headers,
        body: JSON.stringify(apiRequest.body),
      })
      if (!response.ok) {
        throw new Error(
          `${t("errorUnexpected") || "Unexpected error"}: ${
            response.statusText
          }`
        )
      }
      const data = await response.json()
      let result
      try {
        if (config.model === "gemini") {
          result = JSON.parse(
            data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
          )
        } else if (config.model === "gpt") {
          result = JSON.parse(data.choices?.[0]?.message?.content || "{}")
        } else {
          result = JSON.parse(data.text || "{}")
        }
      } catch (parseError) {
        throw new Error(
          `${
            t("errorUnexpected") || "Unexpected error"
          }: Invalid AI response format`
        )
      }
      return result
    } catch (error) {
      console.error("AI suggestion failed:", error)
      return { title: url, folder: t("unnamedFolder") || "Unnamed" }
    }
  }

  // Check if URL exists
  async function checkUrlExists(url) {
    return new Promise((resolve) => {
      chrome.bookmarks.search({ url }, (results) => {
        resolve(results.filter((node) => node.url))
      })
    })
  }

  // Find or create folder
  async function findFolderId(folderName) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.search({ title: folderName }, (results) => {
        const folders = results.filter((node) => !node.url)
        if (folders.length > 1) {
          reject(
            new Error(
              `${
                t("duplicateFolderError") || "Duplicate folders found with name"
              }: ${folderName}. Please specify a unique name.`
            )
          )
        } else if (folders.length === 1) {
          resolve(folders[0].id)
        } else {
          chrome.bookmarks.create({ title: folderName }, (folder) => {
            resolve(folder.id)
          })
        }
      })
    })
  }

  // Get folder name
  async function getFolderName(folderId) {
    return new Promise((resolve) => {
      chrome.bookmarks.get(folderId, (results) => {
        resolve(results[0]?.title || t("unnamedFolder") || "Unnamed")
      })
    })
  }

  // Search bookmarks by title
  async function searchBookmarksByTitle(title) {
    return new Promise((resolve) => {
      chrome.bookmarks.search({ title }, (results) => {
        resolve(results.filter((node) => node.url))
      })
    })
  }

  // Search folders by name
  async function searchFoldersByName(keyword) {
    return new Promise((resolve) => {
      chrome.bookmarks.search({ title: keyword }, (results) => {
        resolve(results.filter((node) => !node.url))
      })
    })
  }

  // Get bookmark by ID
  async function getBookmarkById(bookmarkId) {
    return new Promise((resolve, reject) => {
      chrome.bookmarks.get(bookmarkId, (results) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
        } else if (results.length === 0) {
          reject(
            new Error(
              `${
                t("noBookmarks") || "No bookmark found with"
              } ID: ${bookmarkId}.`
            )
          )
        } else {
          resolve(results[0])
        }
      })
    })
  }

  // Toggle favorite status
  async function toggleFavorite(bookmarkId, favorite) {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get("favoriteBookmarks", (data) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        const favoriteBookmarks = data.favoriteBookmarks || {}
        if (favorite) {
          favoriteBookmarks[bookmarkId] = true
        } else {
          delete favoriteBookmarks[bookmarkId]
        }
        chrome.storage.local.set({ favoriteBookmarks }, () => {
          if (chrome.runtime.lastError) {
            reject(new Error(chrome.runtime.lastError.message))
          } else {
            resolve(favoriteBookmarks)
          }
        })
      })
    })
  }

  // Handle bookmark commands
  async function handleBookmarkCommand(action, params, originalMessage) {
    const loadingMessage = document.createElement("div")
    loadingMessage.className = "chatbox-message bot loading"
    loadingMessage.textContent = t("loadingBookmarks") || "Đang xử lý..."
    chatMessages.appendChild(loadingMessage)
    chatMessages.scrollTop = chatMessages.scrollHeight

    let bookmarkId // Declare bookmarkId once at the function scope

    try {
      if (action === "count") {
        chrome.bookmarks.getTree((bookmarkTree) => {
          let count = 0
          function countBookmarks(nodes) {
            nodes.forEach((node) => {
              if (node.url) count++
              if (node.children) countBookmarks(node.children)
            })
          }
          countBookmarks(bookmarkTree[0].children)
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = `${t("youHave") || "Bạn có"} ${count} ${
            t("bookmarks") || "bookmark"
          } ! <span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            `${t("youHave") || "Bạn có"} ${count} ${
              t("bookmarks") || "bookmark"
            }.`,
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (action === "count_folders") {
        chrome.bookmarks.getTree((bookmarkTree) => {
          let count = 0
          function countFolders(nodes) {
            nodes.forEach((node) => {
              if (!node.url) count++
              if (node.children) countFolders(node.children)
            })
          }
          countFolders(bookmarkTree[0].children)
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = `${t("youHave") || "Bạn có"} ${count} ${
            t("folders") || "thư mục"
          } ! <span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            `${t("youHave") || "Bạn có"} ${count} ${
              t("folders") || "thư mục"
            }.`,
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (action === "list") {
        chrome.bookmarks.getTree((bookmarkTree) => {
          const bookmarks = []
          function collectBookmarks(nodes) {
            nodes.forEach((node) => {
              if (node.url) {
                bookmarks.push({
                  title: node.title || node.url,
                  url: node.url,
                  id: node.id,
                })
              }
              if (node.children) collectBookmarks(node.children)
            })
          }
          collectBookmarks(bookmarkTree[0].children)
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = bookmarks.length
            ? `${
                t("hereAreYourBookmarks") || "Đây là danh sách bookmark của bạn"
              }:<br>${bookmarks
                .map(
                  (b, index) =>
                    `<span class="bookmark-item">${
                      index + 1
                    }. <img src="https://www.google.com/s2/favicons?domain=${
                      new URL(b.url).hostname
                    }" class="favicon" alt="Favicon" onerror="this.src='./images/default-favicon.png';"> <a href="${
                      b.url
                    }" target="_blank">${b.title}</a> (ID: ${b.id})</span>`
                )
                .join("<br>")}<span class="timestamp">${timestamp}</span>`
            : `${
                t("noBookmarks") || "Bạn chưa có bookmark nào cả."
              } 😕<span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            botMessage.textContent
              .replace(/<[^>]*>/g, "")
              .replace(timestamp, "")
              .trim(),
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (action === "list_folders") {
        chrome.bookmarks.getTree((bookmarkTree) => {
          const folders = []
          function collectFolders(nodes) {
            nodes.forEach((node) => {
              if (!node.url) {
                folders.push({
                  title: node.title || t("unnamedFolder") || "Unnamed",
                  id: node.id,
                })
              }
              if (node.children) collectFolders(node.children)
            })
          }
          collectFolders(bookmarkTree[0].children)
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = folders.length
            ? `${
                t("hereAreYourFolders") || "Đây là danh sách thư mục của bạn"
              }:<br>${folders
                .map(
                  (f, index) =>
                    `<span class="bookmark-item">${index + 1}. ${
                      f.title
                    } (ID: ${f.id})</span>`
                )
                .join("<br>")}<span class="timestamp">${timestamp}</span>`
            : `${
                t("noFolders") || "Bạn chưa có thư mục nào cả."
              } 😕<span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            botMessage.textContent
              .replace(/<[^>]*>/g, "")
              .replace(timestamp, "")
              .trim(),
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (action === "list_bookmarks_in_folder" && params.folder) {
        searchFoldersByName(params.folder).then((folders) => {
          if (folders.length === 0) {
            throw new Error(
              `${t("noFoldersFound") || "Không tìm thấy thư mục"}: ${
                params.folder
              } 😕`
            )
          }
          if (folders.length > 1) {
            throw new Error(
              `${t("duplicateFolderError") || "Tìm thấy nhiều thư mục tên"}: ${
                params.folder
              }. Vui lòng chọn một tên duy nhất nha! 😊`
            )
          }
          const folderId = folders[0].id
          chrome.bookmarks.getChildren(folderId, (children) => {
            const bookmarks = children.filter((node) => node.url)
            loadingMessage.remove()
            const botMessage = document.createElement("div")
            botMessage.className = "chatbox-message bot"
            const timestamp = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            botMessage.innerHTML = bookmarks.length
              ? `${
                  t("hereAreBookmarksInFolder") ||
                  "Đây là các bookmark trong thư mục"
                } '${params.folder}':<br>${bookmarks
                  .map(
                    (b, index) =>
                      `<span class="bookmark-item">${
                        index + 1
                      }. <img src="https://www.google.com/s2/favicons?domain=${
                        new URL(b.url).hostname
                      }" class="favicon" alt="Favicon" onerror="this.src='./images/default-favicon.png';"> <a href="${
                        b.url
                      }" target="_blank">${b.title || b.url}</a> (ID: ${
                        b.id
                      })</span>`
                  )
                  .join("<br>")}<span class="timestamp">${timestamp}</span>`
              : `${
                  t("noBookmarksInFolder") ||
                  "Không có bookmark nào trong thư mục"
                } '${
                  params.folder
                }'. 😕<span class="timestamp">${timestamp}</span>`
            chatMessages.appendChild(botMessage)
            addToChatHistory(
              "bot",
              botMessage.textContent
                .replace(/<[^>]*>/g, "")
                .replace(timestamp, "")
                .trim(),
              timestamp
            )
            chatMessages.scrollTop = chatMessages.scrollHeight
          })
        })
      } else if (action === "add" && params.url) {
        let { url, title, folder } = params
        const existingBookmarks = await checkUrlExists(url)
        if (existingBookmarks.length > 0) {
          throw new Error(
            `${
              t("duplicateUrlError") || "Đã có bookmark với URL này rồi"
            }: ${url}. Tui tìm thấy ${existingBookmarks.length} bookmark. 😕`
          )
        }
        if (!folder || !title) {
          const suggestions = await suggestBookmarkDetails(url)
          folder =
            folder || suggestions.folder || t("unnamedFolder") || "Unnamed"
          title = title || suggestions.title || url
        }
        chrome.bookmarks.create(
          { parentId: await findFolderId(folder), title, url },
          (bookmark) => {
            loadingMessage.remove()
            const botMessage = document.createElement("div")
            botMessage.className = "chatbox-message bot"
            const timestamp = new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
            botMessage.innerHTML = `${
              t("addedBookmarkToFolder") || "Tui đã thêm bookmark"
            } <a href="${url}" target="_blank">${title}</a> ${
              t("toFolder") || "vào thư mục"
            } '${folder}' nha! 😊 (ID: ${
              bookmark.id
            })<span class="timestamp">${timestamp}</span>`
            chatMessages.appendChild(botMessage)
            addToChatHistory(
              "bot",
              `${
                t("addedBookmarkToFolder") || "Tui đã thêm bookmark"
              } ${title} ${t("toFolder") || "vào thư mục"} '${folder}'.`,
              timestamp
            )
            chatMessages.scrollTop = chatMessages.scrollHeight
          }
        )
      } else if (
        action === "edit" &&
        (params.url || params.title || params.bookmarkId)
      ) {
        const {
          url,
          title: oldTitle,
          new_title: newTitle,
          folder: newFolder,
          bookmarkId: paramBookmarkId,
        } = params
        if (!newTitle && !newFolder) {
          throw new Error(
            t("emptyTitleError") ||
              "Vui lòng cung cấp tiêu đề mới hoặc thư mục nha! 😊"
          )
        }
        let bookmarks = []
        if (paramBookmarkId) {
          const bookmark = await getBookmarkById(paramBookmarkId)
          bookmarks = [bookmark]
        } else if (url) {
          bookmarks = await checkUrlExists(url)
        } else if (oldTitle) {
          bookmarks = await searchBookmarksByTitle(oldTitle)
        }
        if (bookmarks.length === 0) {
          throw new Error(
            `${t("noBookmarks") || "Tui không tìm thấy bookmark nào với"} ${
              paramBookmarkId
                ? `ID: ${paramBookmarkId}`
                : url
                ? `URL: ${url}`
                : `tiêu đề: ${oldTitle}`
            }. 😕`
          )
        }
        if (bookmarks.length > 1) {
          if (newFolder) {
            const folderId = await findFolderId(newFolder)
            bookmarks = bookmarks.filter((b) => b.parentId === folderId)
          }
          if (bookmarks.length > 1) {
            throw new Error(
              `${
                t("duplicateBookmarkError") ||
                "Tìm thấy nhiều bookmark với tiêu đề"
              }: ${oldTitle || url}. ${
                t("clarifyBookmark") ||
                "Vui lòng cung cấp ID, URL hoặc thư mục để xác định rõ nha!"
              } 😊`
            )
          }
        }
        bookmarkId = bookmarks[0].id
        const performUpdates = async () => {
          if (newTitle) {
            await new Promise((resolve, reject) => {
              chrome.bookmarks.update(
                bookmarkId,
                { title: newTitle },
                (updatedBookmark) => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message))
                  } else {
                    resolve(updatedBookmark)
                  }
                }
              )
            })
          }
          if (newFolder) {
            const folderId = await findFolderId(newFolder)
            await new Promise((resolve, reject) => {
              chrome.bookmarks.move(
                bookmarkId,
                { parentId: folderId },
                (movedBookmark) => {
                  if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message))
                  } else {
                    resolve(movedBookmark)
                  }
                }
              )
            })
          }
          const updatedBookmark = await new Promise((resolve) => {
            chrome.bookmarks.get(bookmarkId, (results) => resolve(results[0]))
          })
          const folderName = await getFolderName(updatedBookmark.parentId)
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = `${
            t("updatedBookmark") || "Tui đã cập nhật bookmark"
          } <a href="${updatedBookmark.url}" target="_blank">${
            updatedBookmark.title
          }</a> ${
            t("inFolder") || "trong"
          } '${folderName}' nha! 😊 (ID: ${bookmarkId})<span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            `${t("updatedBookmark") || "Tui đã cập nhật bookmark"} ${
              updatedBookmark.title
            } ${t("inFolder") || "trong"} '${folderName}'.`,
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        }
        performUpdates().catch((error) => {
          loadingMessage.remove()
          const errorMessage = document.createElement("div")
          errorMessage.className = "chatbox-message bot error"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          errorMessage.innerHTML = `${t("errorTitle") || "Ồ không"}: ${
            error.message
          } 😕<span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(errorMessage)
          addToChatHistory(
            "bot",
            `${t("errorTitle") || "Ồ không"}: ${error.message}`,
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (
        action === "delete" &&
        (params.url || params.title || params.bookmarkId)
      ) {
        let bookmarks = []
        if (params.bookmarkId) {
          const bookmark = await getBookmarkById(params.bookmarkId)
          bookmarks = [bookmark]
        } else if (params.url) {
          bookmarks = await checkUrlExists(params.url)
        } else if (params.title) {
          bookmarks = await searchBookmarksByTitle(params.title)
        }
        if (bookmarks.length === 0) {
          throw new Error(
            `${t("noBookmarks") || "Tui không tìm thấy bookmark nào với"} ${
              params.bookmarkId
                ? `ID: ${params.bookmarkId}`
                : params.url
                ? `URL: ${params.url}`
                : `tiêu đề: ${params.title}`
            }. 😕`
          )
        }
        if (bookmarks.length > 1) {
          throw new Error(
            `${t("duplicateBookmarkError") || "Tìm thấy nhiều bookmark với"} ${
              params.url ? `URL: ${params.url}` : `tiêu đề: ${params.title}`
            }. ${
              t("clarifyBookmark") ||
              "Vui lòng cung cấp ID, URL hoặc thư mục để xác định rõ nha!"
            } `
          )
        }
        bookmarkId = bookmarks[0].id
        const bookmarkTitle = bookmarks[0].title || bookmarks[0].url
        chrome.bookmarks.remove(bookmarkId, () => {
          if (chrome.runtime.lastError) {
            throw new Error(chrome.runtime.lastError.message)
          }
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = `${
            t("deletedBookmark") || "Tui đã xóa bookmark"
          }: ${bookmarkTitle} nha! 😊 (ID: ${bookmarkId})<span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            `${
              t("deletedBookmark") || "Tui đã xóa bookmark"
            }: ${bookmarkTitle}.`,
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (action === "search_bookmark" && params.keyword) {
        chrome.bookmarks.search(params.keyword, (results) => {
          const bookmarks = results.filter((node) => node.url)
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = bookmarks.length
            ? `${t("foundBookmarks") || "Tui tìm thấy"} ${bookmarks.length} ${
                t("bookmarksMatching") || "bookmark khớp với"
              } "${params.keyword}":<br>${bookmarks
                .map(
                  (b, index) =>
                    `<span class="bookmark-item">${
                      index + 1
                    }. <img src="https://www.google.com/s2/favicons?domain=${
                      new URL(b.url).hostname
                    }" class="favicon" alt="Favicon" onerror="this.src='./images/default-favicon.png';"> <a href="${
                      b.url
                    }" target="_blank">${b.title || b.url}</a> (ID: ${
                      b.id
                    })</span>`
                )
                .join("<br>")}<span class="timestamp">${timestamp}</span>`
            : `${
                t("noBookmarksFoundFor") ||
                "Tui không tìm thấy bookmark nào khớp với"
              } "${
                params.keyword
              }". <span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            botMessage.textContent
              .replace(/<[^>]*>/g, "")
              .replace(timestamp, "")
              .trim(),
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (action === "search_folder" && params.keyword) {
        searchFoldersByName(params.keyword).then((folders) => {
          if (folders.length > 1) {
            throw new Error(
              `${t("duplicateFolderError") || "Tìm thấy nhiều thư mục tên"}: ${
                params.keyword
              }. Vui lòng chọn một tên duy nhất nha! `
            )
          }
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = folders.length
            ? `${t("foundFolders") || "Tui tìm thấy các thư mục"}:<br>${folders
                .map(
                  (f) =>
                    `${f.title || t("unnamedFolder") || "Unnamed"} (ID: ${
                      f.id
                    })`
                )
                .join("<br>")}<span class="timestamp">${timestamp}</span>`
            : `${
                t("noFoldersFoundFor") ||
                "Tui không tìm thấy thư mục nào khớp với"
              } "${
                params.keyword
              }". 😕<span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            botMessage.textContent
              .replace(/<[^>]*>/g, "")
              .replace(timestamp, "")
              .trim(),
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (
        action === "move" &&
        (params.title || params.bookmarkId) &&
        params.folder
      ) {
        let bookmarks = []
        if (params.bookmarkId) {
          const bookmark = await getBookmarkById(params.bookmarkId)
          bookmarks = [bookmark]
        } else {
          bookmarks = await searchBookmarksByTitle(params.title)
        }
        if (bookmarks.length === 0) {
          throw new Error(
            `${t("noBookmarks") || "Tui không tìm thấy bookmark nào với"} ${
              params.bookmarkId
                ? `ID: ${params.bookmarkId}`
                : `tiêu đề: ${params.title}`
            }. `
          )
        }
        if (bookmarks.length > 1) {
          throw new Error(
            `${
              t("duplicateBookmarkError") ||
              "Tìm thấy nhiều bookmark với tiêu đề"
            }: ${
              params.title
            }. Vui lòng cung cấp ID hoặc URL để xác định rõ nha! 😊`
          )
        }
        bookmarkId = bookmarks[0].id
        const folderId = await findFolderId(params.folder)
        chrome.bookmarks.move(bookmarkId, { parentId: folderId }, async () => {
          const folderName = await getFolderName(folderId)
          loadingMessage.remove()
          const botMessage = document.createElement("div")
          botMessage.className = "chatbox-message bot"
          const timestamp = new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
          botMessage.innerHTML = `${
            t("movedBookmark") || "Tui đã chuyển bookmark"
          } <a href="${bookmarks[0].url}" target="_blank">${
            params.title || bookmarks[0].title
          }</a> ${
            t("toFolder") || "vào"
          } '${folderName}' nha! 😊 (ID: ${bookmarkId})<span class="timestamp">${timestamp}</span>`
          chatMessages.appendChild(botMessage)
          addToChatHistory(
            "bot",
            `${t("movedBookmark") || "Tui đã chuyển bookmark"} ${
              params.title || bookmarks[0].title
            } ${t("toFolder") || "vào"} '${folderName}'.`,
            timestamp
          )
          chatMessages.scrollTop = chatMessages.scrollHeight
        })
      } else if (
        action === "favorite" &&
        (params.title || params.bookmarkId) &&
        params.hasOwnProperty("favorite")
      ) {
        const { title, favorite, folder, bookmarkId: paramBookmarkId } = params
        let bookmarks = []
        if (paramBookmarkId) {
          const bookmark = await getBookmarkById(paramBookmarkId)
          bookmarks = [bookmark]
        } else {
          bookmarks = await searchBookmarksByTitle(title)
        }
        if (bookmarks.length === 0) {
          throw new Error(
            `${t("noBookmarks") || "Tui không tìm thấy bookmark nào với"} ${
              paramBookmarkId ? `ID: ${paramBookmarkId}` : `tiêu đề: ${title}`
            }. 😕`
          )
        }
        if (bookmarks.length > 1) {
          if (folder) {
            const folderId = await findFolderId(folder)
            bookmarks = bookmarks.filter((b) => b.parentId === folderId)
          }
          if (bookmarks.length > 1) {
            throw new Error(
              `${
                t("duplicateBookmarkError") ||
                "Tìm thấy nhiều bookmark với tiêu đề"
              }: ${title}. ${
                t("clarifyBookmark") ||
                "Vui lòng cung cấp ID, URL hoặc thư mục để xác định rõ nha!"
              } 😊`
            )
          }
        }
        bookmarkId = bookmarks[0].id
        const bookmarkTitle = bookmarks[0].title || bookmarks[0].url
        await toggleFavorite(bookmarkId, favorite)
        loadingMessage.remove()
        const botMessage = document.createElement("div")
        botMessage.className = "chatbox-message bot"
        const timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        botMessage.innerHTML = `${
          favorite
            ? t("markedFavorite") || "Tui đã đánh dấu bookmark"
            : t("unmarkedFavorite") ||
              "Tui đã bỏ đánh dấu yêu thích cho bookmark"
        } <a href="${
          bookmarks[0].url
        }" target="_blank">${bookmarkTitle}</a> nha! 😊 (ID: ${bookmarkId})<span class="timestamp">${timestamp}</span>`
        chatMessages.appendChild(botMessage)
        addToChatHistory(
          "bot",
          `${
            favorite
              ? t("markedFavorite") || "Tui đã đánh dấu bookmark"
              : t("unmarkedFavorite") ||
                "Tui đã bỏ đánh dấu yêu thích cho bookmark"
          } ${bookmarkTitle}.`,
          timestamp
        )
        chatMessages.scrollTop = chatMessages.scrollHeight
      } else if (action === "general" && params.response) {
        loadingMessage.remove()
        const botMessage = document.createElement("div")
        botMessage.className = "chatbox-message bot"
        const timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        botMessage.innerHTML = `${params.response}<span class="timestamp">${timestamp}</span>`
        chatMessages.appendChild(botMessage)
        addToChatHistory("bot", params.response, timestamp)
        chatMessages.scrollTop = chatMessages.scrollHeight
      } else {
        loadingMessage.remove()
        const botMessage = document.createElement("div")
        botMessage.className = "chatbox-message bot"
        const timestamp = new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
        const fallbackResponse =
          t("naturalLanguagePrompt") ||
          "Hì, tui chưa hiểu lắm! Bạn muốn làm gì với bookmark? Thử nói kiểu như 'xóa bookmark ID 123' hoặc 'đổi tên bookmark ChickenSoup thành ChickenSoup2698' nhé! 😊"
        botMessage.innerHTML = `${fallbackResponse}<span class="timestamp">${timestamp}</span>`
        chatMessages.appendChild(botMessage)
        addToChatHistory("bot", fallbackResponse, timestamp)
        chatMessages.scrollTop = chatMessages.scrollHeight
      }
    } catch (error) {
      loadingMessage.remove()
      const errorMessage = document.createElement("div")
      errorMessage.className = "chatbox-message bot error"
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      errorMessage.innerHTML = `${t("errorTitle") || "Ồ không"}: ${
        error.message
      } 😕<span class="timestamp">${timestamp}</span>`
      chatMessages.appendChild(errorMessage)
      addToChatHistory(
        "bot",
        `${t("errorTitle") || "Ồ không"}: ${error.message}`,
        timestamp
      )
      chatMessages.scrollTop = chatMessages.scrollHeight
    }
  }

  // Show AI config popup
  const showAiConfigPopup = () => {
    const config = getAiConfig()
    aiModelSelect.value = config.model
    apiKeyInput.value = config.apiKey
    curlInput.value = config.curl
    aiConfigPopup.classList.remove("hidden")
    aiModelSelect.focus()
  }

  // Hide AI config popup
  const hideAiConfigPopup = () => {
    aiConfigPopup.classList.add("hidden")
  }

  // Toggle chatbox visibility
  chatToggle.addEventListener("click", () => {
    const config = getAiConfig()
    if (!config.model || !config.apiKey || !config.curl) {
      showAiConfigPopup()
    } else {
      chatbox.classList.toggle("hidden")
      if (!chatbox.classList.contains("hidden")) {
        chatInput.focus()
      }
    }
  })

  // Close chatbox
  chatClose.addEventListener("click", () => {
    chatbox.classList.add("hidden")
  })

  // Edit AI config
  chatEditConfig.addEventListener("click", () => {
    showAiConfigPopup()
  })

  // Maximize/Minimize chatbox
  let isMaximized = false
  chatMaximize.addEventListener("click", () => {
    if (isMaximized) {
      chatbox.style.width = "360px"
      chatbox.style.height = "480px"
      chatMaximize.innerHTML = '<i class="fas fa-expand"></i>'
    } else {
      chatbox.style.width = "500px"
      chatbox.style.height = "600px"
      chatMaximize.innerHTML = '<i class="fas fa-compress"></i>'
    }
    isMaximized = !isMaximized
    chatMessages.scrollTop = chatMessages.scrollHeight
  })

  // Send message
  chatSend.addEventListener("click", async () => {
    const message = chatInput.value.trim()
    if (!message) return

    const formatMessage = (text) => {
      const urlRegex = /(https?:\/\/[^\s<]+)(?=\s|$|<)/g
      return text.replace(urlRegex, (url) => {
        try {
          const urlObj = new URL(url)
          const shortText = urlObj.hostname
          return `<a href="${url}" target="_blank" class="short-url">${shortText}</a>`
        } catch {
          return url
        }
      })
    }

    // Add user message
    const userMessage = document.createElement("div")
    userMessage.className = "chatbox-message user"
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    userMessage.innerHTML = `${formatMessage(
      message
    )}<span class="timestamp">${timestamp}</span>`
    chatMessages.appendChild(userMessage)
    addToChatHistory("user", message, timestamp)
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Show loading state
    const loadingMessage = document.createElement("div")
    loadingMessage.className = "chatbox-message bot loading"
    loadingMessage.textContent = t("loadingChat") || "Đang xử lý..."
    chatMessages.appendChild(loadingMessage)
    chatMessages.scrollTop = chatMessages.scrollHeight

    // Get AI config
    const config = getAiConfig()
    if (!config.model || !config.apiKey || !config.curl) {
      loadingMessage.remove()
      const errorMessage = document.createElement("div")
      errorMessage.className = "chatbox-message bot error"
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      errorMessage.innerHTML = `${t("errorTitle") || "Ồ không"}: ${
        t("aiTitle") || "Cấu hình AI"
      } chưa hoàn chỉnh 😕<span class="timestamp">${timestamp}</span>`
      chatMessages.appendChild(errorMessage)
      addToChatHistory(
        "bot",
        `${t("errorTitle") || "Ồ không"}: ${
          t("aiTitle") || "Cấu hình AI"
        } chưa hoàn chỉnh`,
        timestamp
      )
      chatMessages.scrollTop = chatMessages.scrollHeight
      chatInput.value = ""
      return
    }

    // Build API request
    const apiRequest = buildApiRequest(
      config.curl,
      config.apiKey,
      config.model,
      message
    )
    if (!apiRequest) {
      loadingMessage.remove()
      const errorMessage = document.createElement("div")
      errorMessage.className = "chatbox-message bot error"
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      errorMessage.innerHTML = `${
        t("errorTitle") || "Ồ không"
      }: URL API không hợp lệ 😕<span class="timestamp">${timestamp}</span>`
      chatMessages.appendChild(errorMessage)
      addToChatHistory(
        "bot",
        `${t("errorTitle") || "Ồ không"}: URL API không hợp lệ`,
        timestamp
      )
      chatMessages.scrollTop = chatMessages.scrollHeight
      chatInput.value = ""
      return
    }

    try {
      const response = await fetch(apiRequest.url, {
        method: "POST",
        headers: apiRequest.headers,
        body: JSON.stringify(apiRequest.body),
      })

      if (!response.ok) {
        throw new Error(
          `${t("errorUnexpected") || "Lỗi bất ngờ"}: ${response.statusText} 😕`
        )
      }

      const data = await response.json()
      let aiResult
      try {
        if (config.model === "gemini") {
          aiResult = JSON.parse(
            data.candidates?.[0]?.content?.parts?.[0]?.text || "{}"
          )
        } else if (config.model === "gpt") {
          aiResult = JSON.parse(data.choices?.[0]?.message?.content || "{}")
        } else {
          aiResult = JSON.parse(data.text || "{}")
        }
      } catch (parseError) {
        throw new Error(
          `${
            t("errorUnexpected") || "Lỗi bất ngờ"
          }: Định dạng phản hồi AI không hợp lệ 😕`
        )
      }

      // Remove loading message
      loadingMessage.remove()

      // Handle AI response
      await handleBookmarkCommand(
        aiResult.action,
        aiResult.params || {},
        message
      )
    } catch (error) {
      loadingMessage.remove()
      const errorMessage = document.createElement("div")
      errorMessage.className = "chatbox-message bot error"
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
      errorMessage.innerHTML = `${t("errorTitle") || "Ồ không"}: ${
        error.message
      } 😕<span class="timestamp">${timestamp}</span>`
      chatMessages.appendChild(errorMessage)
      addToChatHistory(
        "bot",
        `${t("errorTitle") || "Ồ không"}: ${error.message}`,
        timestamp
      )
      chatMessages.scrollTop = chatMessages.scrollHeight
    }

    // Clear input
    chatInput.value = ""
  })

  // Handle Enter key
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      chatSend.click()
    }
  })

  // Show/Hide scroll button
  chatMessages.addEventListener("scroll", () => {
    const threshold = 100
    if (
      chatMessages.scrollHeight -
        chatMessages.scrollTop -
        chatMessages.clientHeight >
      threshold
    ) {
      chatScrollBottom.style.display = "flex"
    } else {
      chatScrollBottom.style.display = "none"
    }
  })

  chatScrollBottom.addEventListener("click", () => {
    chatMessages.scrollTo({
      top: chatMessages.scrollHeight,
      behavior: "smooth",
    })
  })

  // Clear input
  chatClear.addEventListener("click", () => {
    chatInput.value = ""
  })

  // Clear API key input
  clearApiKey.addEventListener("click", () => {
    apiKeyInput.value = ""
  })

  // Clear cURL input
  clearCurl.addEventListener("click", () => {
    curlInput.value = ""
  })

  // Save AI config
  aiConfigSave.addEventListener("click", () => {
    const model = aiModelSelect.value
    const apiKey = apiKeyInput.value.trim()
    const curl = curlInput.value.trim()
    if (!model || !apiKey || !curl) {
      showCustomPopup(
        `${t("errorTitle") || "Ồ không"}: ${
          t("aiTitle") || "Cấu hình AI"
        } chưa hoàn chỉnh 😕`,
        "error",
        true
      )
      return
    }
    if (!isValidUrl(curl)) {
      showCustomPopup(
        `${t("errorTitle") || "Ồ không"}: URL API không hợp lệ 😕`,
        "error",
        true
      )
      return
    }
    saveAiConfig(model, apiKey, curl)
    hideAiConfigPopup()
    chatbox.classList.remove("hidden")
    chatInput.focus()
  })

  // Cancel AI config
  aiConfigCancel.addEventListener("click", () => {
    hideAiConfigPopup()
    const config = getAiConfig()
    if (config.model && config.apiKey && config.curl) {
      chatbox.classList.remove("hidden")
      chatInput.focus()
    }
  })

  // Help button handler
  if (chatHelp) {
    chatHelp.addEventListener("click", () => {
      showCustomGuide()
    })
  }

  // Chat history export
  if (chatHistoryBtn) {
    chatHistoryBtn.addEventListener("click", exportChatHistory)
  }
})

export function attachDropdownListeners(elements) {
  console.log("Attaching dropdown listeners")
  const dropdownButtons = document.querySelectorAll(".dropdown-btn")
  console.log("Found dropdown buttons:", dropdownButtons.length)

  dropdownButtons.forEach((button) => {
    button.removeEventListener("click", handleDropdownClick)
    button.addEventListener("click", handleDropdownClick)
  })

  function handleDropdownClick(e) {
    e.stopPropagation()
    const menu = e.target.nextElementSibling
    console.log("Dropdown button clicked, menu:", menu)
    if (!menu || !menu.classList.contains("dropdown-menu")) {
      console.error("Dropdown menu not found for button:", e.target)
      return
    }
    const isMenuOpen = !menu.classList.contains("hidden")
    document.querySelectorAll(".dropdown-menu").forEach((m) => {
      if (m !== menu) m.classList.add("hidden")
    })
    menu.classList.toggle("hidden")
    console.log(
      "Menu open status after toggle:",
      !menu.classList.contains("hidden")
    )
  }
}

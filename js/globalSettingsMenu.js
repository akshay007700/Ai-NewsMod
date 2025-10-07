// ⚙️ Global Settings Menu – Works on all pages
// ---------------------------------------------
// • Adds a simple 3-dot dropdown in the header
// • Opens Settings, About, or Contact pages
// • Closes automatically on outside click
// • Zero impact on existing layout / design

document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("settings-menu-btn");
  if (!menuBtn) return;

  // Create dropdown
  const dropdown = document.createElement("div");
  dropdown.className = "settings-dropdown";
  dropdown.innerHTML = `
      <a href="settings.html"><i class="fas fa-cog"></i> Settings</a>
      <a href="about.html"><i class="fas fa-info-circle"></i> About</a>
      <a href="contact.html"><i class="fas fa-envelope"></i> Contact</a>
  `;
  document.body.appendChild(dropdown);

  // Toggle dropdown on click
  menuBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const rect = menuBtn.getBoundingClientRect();
    dropdown.style.position = "absolute";
    dropdown.style.top = rect.bottom + 8 + "px";
    dropdown.style.right = window.innerWidth - rect.right + "px";
    dropdown.style.display =
      dropdown.style.display === "flex" ? "none" : "flex";
  });

  // Hide dropdown on outside click
  document.addEventListener("click", () => {
    dropdown.style.display = "none";
  });
});

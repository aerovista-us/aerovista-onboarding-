(function () {
  // Highlight current nav item
  const path = location.pathname.split("/").pop() || "index.html";
  const links = document.querySelectorAll("[data-nav] a");
  links.forEach(a => {
    const href = (a.getAttribute("href") || "").split("/").pop();
    if (href === path) a.classList.add("active");
  });

  // Keyboard nav: Alt+← / Alt+→ if prev/next links exist
  document.addEventListener("keydown", (e) => {
    if (!e.altKey) return;
    const prev = document.querySelector("[data-prev]");
    const next = document.querySelector("[data-next]");
    if (e.key === "ArrowLeft" && prev) location.href = prev.getAttribute("href");
    if (e.key === "ArrowRight" && next) location.href = next.getAttribute("href");
  });
})();

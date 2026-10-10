// ==========================================================
// Loran Iñosa · Portfolio scripts
// ==========================================================


// ---------- 1. Header border after scrolling ----------
// Adds the class "is-scrolled" to the header once the page
// has moved down, so CSS can show a thin bottom border.

const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 0);
}

if (header) {
  updateHeader(); // check once when the page loads
  window.addEventListener("scroll", updateHeader, { passive: true });
}


// ---------- 2. "Copy email" button ----------
// Copies the email to the clipboard, shows "Copied ✓"
// for 2 seconds, then changes back.

const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");

if (copyButton) {
  const originalText = copyButton.textContent;

  copyButton.addEventListener("click", async () => {
    const email = copyButton.dataset.copyEmail;

    try {
      await navigator.clipboard.writeText(email);
      copyButton.textContent = "Copied ✓";
      if (copyStatus) copyStatus.textContent = "Email address copied.";
    } catch (error) {
      copyButton.textContent = "Couldn't copy";
    }

    setTimeout(() => {
      copyButton.textContent = originalText;
      if (copyStatus) copyStatus.textContent = "";
    }, 2000);
  });
}
// ---------- 3. Journey line: draw when it scrolls into view ----------
// Only runs if the visitor hasn't asked to reduce motion,
// and only once per page visit.

const journeyStrip = document.querySelector(".journey-strip");
const motionOK = window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

if (journeyStrip && motionOK && "IntersectionObserver" in window) {
  // Step 1: get ready (CSS collapses the lines)
  journeyStrip.classList.add("will-draw");

  // Step 2: watch for the strip to appear on screen
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        journeyStrip.classList.add("is-drawn"); // CSS starts the drawing
        observer.disconnect();                  // stop watching: draw only once
      }
    });
  }, { threshold: 0.4 });  // start when 40% of the strip is visible

  observer.observe(journeyStrip);
}
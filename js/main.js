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
// ---------- 4. Game popup ----------
// Buttons with data-popup open their game in a popup window
// on laptops and tablets. On phones, they open a new tab instead.

const popupLinks = document.querySelectorAll("[data-popup]");

if (popupLinks.length > 0) {

  // Build the popup window once, and add it to the page
  const popup = document.createElement("dialog");
  popup.className = "game-popup";
  popup.innerHTML = `
    <div class="game-popup__bar">
      <div class="game-popup__name">
        <p class="game-popup__title"></p>
        <p class="game-popup__note">Takes a little time to load</p>
      </div>
      <div class="game-popup__actions">
        <a class="game-popup__newtab" href="#" target="_blank" rel="noopener">Open in new tab ↗</a>
        <button type="button" class="game-popup__close" aria-label="Close game">✕</button>
      </div>
    </div>
    <div class="game-popup__screen">
      <iframe title="Game" allow="autoplay; fullscreen" allowfullscreen></iframe>
    </div>
  `;
  document.body.appendChild(popup);

  const frame = popup.querySelector("iframe");
  const title = popup.querySelector(".game-popup__title");
  const newTab = popup.querySelector(".game-popup__newtab");
  const closeButton = popup.querySelector(".game-popup__close");
  const bigScreen = window.matchMedia("(min-width: 768px)");

  // Clicking a play button: open the popup with that game
  popupLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!bigScreen.matches) return;   // phones: open a new tab as usual

      event.preventDefault();           // don't open a new tab
      const gameName = link.dataset.popup;
      title.textContent = gameName;
      frame.title = gameName;
      frame.src = link.href;
      newTab.href = link.href;
      popup.showModal();
    });
  });

  // The ✕ button closes the popup
  closeButton.addEventListener("click", () => popup.close());

  // Clicking the dark area outside the window closes it too
  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.close();
  });

  // However it closes (✕, Esc key, or outside click), stop the game
  popup.addEventListener("close", () => {
    frame.src = "about:blank";
  });
}
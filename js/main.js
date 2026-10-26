// ==========================================================
// Loran Iñosa · Portfolio scripts
//
// 1. Header shadow on scroll
// 2. "Copy email" button
// 3. Journey line that draws itself (home page)
// 4. Game popup
// ==========================================================

// ---------- 1. Header shadow on scroll ----------
// Adds .is-scrolled once the page moves, so the CSS can
// show a soft shadow under the sticky header.

const header = document.querySelector(".site-header");

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 0);
}

if (header) {
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// ---------- 2. "Copy email" button ----------
// Copies the email address, shows "Copied ✓" for two seconds,
// and tells screen reader users that it worked.

const copyButton = document.querySelector("[data-copy-email]");
const copyStatus = document.querySelector("[data-copy-status]");

if (copyButton) {
  const originalText = copyButton.textContent;
  let resetTimer;

  copyButton.addEventListener("click", async () => {
    clearTimeout(resetTimer);

    try {
      await navigator.clipboard.writeText(copyButton.dataset.copyEmail);
      copyButton.textContent = "Copied ✓";
      if (copyStatus) copyStatus.textContent = "Email address copied.";
    } catch (error) {
      copyButton.textContent = "Couldn't copy";
    }

    resetTimer = setTimeout(() => {
      copyButton.textContent = originalText;
      if (copyStatus) copyStatus.textContent = "";
    }, 2000);
  });
}

// ---------- 3. Journey line that draws itself ----------
// When the "How I got here" strip scrolls into view, the CSS
// draws the line one step at a time. It only happens once,
// and never for visitors who prefer reduced motion.

const journeyStrip = document.querySelector(".journey-strip");
const motionOK = window.matchMedia(
  "(prefers-reduced-motion: no-preference)",
).matches;

if (journeyStrip && motionOK && "IntersectionObserver" in window) {
  journeyStrip.classList.add("will-draw");

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        journeyStrip.classList.add("is-drawn");
        observer.disconnect();
      }
    },
    { threshold: 0.4 }, // start once 40% of the strip is visible
  );

  observer.observe(journeyStrip);
}

// ---------- 4. Game popup ----------
// On tablets and laptops, play buttons (links with data-popup)
// open the game in a popup window. On phones, they open in a
// new tab as normal links.

const popupLinks = document.querySelectorAll("[data-popup]");

if (popupLinks.length > 0) {
  // Build the popup once and add it to the page
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

  popupLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!bigScreen.matches) return; // phones: let the link open a new tab

      event.preventDefault();
      const gameName = link.dataset.popup;
      title.textContent = gameName;
      frame.title = gameName;
      frame.src = link.href;
      newTab.href = link.href;
      popup.showModal();
    });
  });

  closeButton.addEventListener("click", () => popup.close());

  // Clicking the dark area around the window also closes it
  popup.addEventListener("click", (event) => {
    if (event.target === popup) popup.close();
  });

  // However it closes (✕, Esc or an outside click), stop the game
  popup.addEventListener("close", () => {
    frame.src = "about:blank";
  });
}

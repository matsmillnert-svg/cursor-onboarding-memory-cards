(function () {
  "use strict";

  const DECK_URL = "./data/cursor-onboarding-deck.json";

  const el = {
    title: document.getElementById("deck-title"),
    progress: document.getElementById("progress"),
    tagFilter: document.getElementById("tag-filter"),
    shuffle: document.getElementById("shuffle"),
    theme: document.getElementById("theme"),
    card: document.getElementById("card"),
    front: {
      text: document.getElementById("front-text"),
      tags: document.getElementById("front-tags"),
      face: document.querySelector(".face--front"),
    },
    back: {
      text: document.getElementById("back-text"),
      tags: document.getElementById("back-tags"),
      face: document.querySelector(".face--back"),
    },
    prev: document.getElementById("prev"),
    flip: document.getElementById("flip"),
    next: document.getElementById("next"),
  };

  const state = {
    allCards: [],
    cards: [],
    index: 0,
    flipped: false,
    tag: "",
  };

  function setText(node, value) {
    node.textContent = value ?? "";
  }

  function renderTags(node, tags) {
    node.innerHTML = "";
    (tags || []).forEach((t) => {
      const li = document.createElement("li");
      li.textContent = t;
      node.appendChild(li);
    });
  }

  function applyFlip() {
    el.card.setAttribute("aria-pressed", String(state.flipped));
    el.front.face.hidden = state.flipped;
    el.back.face.hidden = !state.flipped;
  }

  function render() {
    if (!state.cards.length) {
      setText(el.front.text, "No cards match this filter.");
      renderTags(el.front.tags, []);
      setText(el.back.text, "");
      renderTags(el.back.tags, []);
      el.progress.textContent = "0 / 0";
      state.flipped = false;
      applyFlip();
      return;
    }
    const c = state.cards[state.index];
    setText(el.front.text, c.front);
    renderTags(el.front.tags, c.tags);
    setText(el.back.text, c.back);
    renderTags(el.back.tags, c.tags);
    el.progress.textContent = `${state.index + 1} / ${state.cards.length}`;
    applyFlip();
  }

  function next() {
    if (!state.cards.length) return;
    state.index = (state.index + 1) % state.cards.length;
    state.flipped = false;
    render();
  }

  function prev() {
    if (!state.cards.length) return;
    state.index =
      (state.index - 1 + state.cards.length) % state.cards.length;
    state.flipped = false;
    render();
  }

  function flip() {
    state.flipped = !state.flipped;
    applyFlip();
  }

  function shuffle() {
    const arr = state.cards.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    state.cards = arr;
    state.index = 0;
    state.flipped = false;
    render();
  }

  function applyTagFilter(tag) {
    state.tag = tag;
    state.cards = tag
      ? state.allCards.filter((c) => (c.tags || []).includes(tag))
      : state.allCards.slice();
    state.index = 0;
    state.flipped = false;
    render();
  }

  function populateTags(cards) {
    const set = new Set();
    cards.forEach((c) => (c.tags || []).forEach((t) => set.add(t)));
    const tags = Array.from(set).sort();
    tags.forEach((t) => {
      const opt = document.createElement("option");
      opt.value = t;
      opt.textContent = t;
      el.tagFilter.appendChild(opt);
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch (_) {}
    el.theme.textContent = theme === "light" ? "☀️" : "🌙";
  }

  function toggleTheme() {
    const next =
      document.documentElement.getAttribute("data-theme") === "light"
        ? "dark"
        : "light";
    setTheme(next);
  }

  function initTheme() {
    let saved = null;
    try {
      saved = localStorage.getItem("theme");
    } catch (_) {}
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      return;
    }
    const prefersLight =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: light)").matches;
    setTheme(prefersLight ? "light" : "dark");
  }

  function bindEvents() {
    el.card.addEventListener("click", flip);
    el.flip.addEventListener("click", flip);
    el.next.addEventListener("click", next);
    el.prev.addEventListener("click", prev);
    el.shuffle.addEventListener("click", shuffle);
    el.theme.addEventListener("click", toggleTheme);
    el.tagFilter.addEventListener("change", (e) =>
      applyTagFilter(e.target.value),
    );

    document.addEventListener("keydown", (e) => {
      const tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          flip();
          break;
        case "ArrowRight":
        case "j":
        case "J":
          next();
          break;
        case "ArrowLeft":
        case "k":
        case "K":
          prev();
          break;
        case "s":
        case "S":
          shuffle();
          break;
        case "t":
        case "T":
          toggleTheme();
          break;
        default:
          break;
      }
    });
  }

  async function loadDeck() {
    try {
      const res = await fetch(DECK_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } catch (err) {
      console.warn(
        "Could not fetch deck JSON (this happens on file:// in some browsers). " +
          "Serve the folder locally, e.g. `python3 -m http.server 8000`, " +
          "or use the GitHub Pages URL.",
        err,
      );
      setText(
        el.front.text,
        "Could not load deck. Open this app via a local server " +
          "(`python3 -m http.server 8000` in the project folder) or its GitHub Pages URL.",
      );
      return null;
    }
  }

  async function init() {
    initTheme();
    bindEvents();
    const deck = await loadDeck();
    if (!deck) return;
    if (deck.title) el.title.textContent = deck.title;
    state.allCards = Array.isArray(deck.cards) ? deck.cards : [];
    state.cards = state.allCards.slice();
    populateTags(state.allCards);
    render();
  }

  init();
})();

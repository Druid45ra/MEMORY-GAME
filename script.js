// --- CONSTANTE ȘI UTULITĂȚI STATICE ---

// Logouri statice pentru tema "logos"
const STATIC_LOGOS = [
  { id: "js", value: "JS" },
  { id: "css", value: "CSS" },
  { id: "html", value: "HTML" },
  { id: "react", value: "⚛️" },
  { id: "node", value: "NODE" },
  { id: "py", value: "🐍" },
  { id: "git", value: "GIT" },
  { id: "aws", value: "AWS" },
  { id: "docker", value: "🐳" },
  { id: "gcp", value: "GCP" },
  { id: "vue", value: "Vue" },
  { id: "ts", value: "TS" },
  { id: "npm", value: "NPM" },
  { id: "php", value: "PHP" },
  { id: "ruby", value: "💎" },
  { id: "swift", value: "Swift" },
  { id: "csharp", value: "C#" },
  { id: "java", value: "JAVA" },
];

// --- Starea Globală ---
let activeGame = null;
let currentTheme = "classic"; // Tema pentru spatele cărților (CSS)
let currentContent = "rickandmorty"; // Tema pentru fața cărților (Logică API/Statică)
const bodyElement = document.body;

// --- Utilități DOM (Cache-uirea elementelor) ---
const DOMElements = {
  startMenu: document.getElementById("start-menu"),
  loadingScreen: document.getElementById("loading-screen"),
  gameScreen: document.getElementById("game-screen"),
  gameBoard: document.getElementById("game-board"),
  difficultyLabel: document.getElementById("difficulty-label"),
  movesElement: document.getElementById("moves"),
  timeElement: document.getElementById("time"),
  bestTimeElement: document.getElementById("best-time"),
  restartBtn: document.getElementById("restart-btn"),
  newGameBtn: document.getElementById("new-game-btn"),
  difficultyOptions: document.getElementById("difficulty-options"),
  contentOptionsContainer: document.getElementById("content-options"), // NOU
  themeOptionsContainer: document.getElementById("theme-options"),
  victoryModal: document.getElementById("victory-modal"),
  modalRestartBtn: document.getElementById("modal-restart-btn"),
  finalTime: document.getElementById("final-time"),
  finalMoves: document.getElementById("final-moves"),
  modalMessage: document.getElementById("modal-message"),
  startMenuTitle: document.querySelector("#start-menu h2"),
};

// --- Logica de Schimbare a Temelor (Spate & Față) ---

// Aplică clasa de temă pe <body> (Spatele cărților)
function applyTheme(themeName) {
  bodyElement.classList.remove(`theme-${currentTheme}`);
  currentTheme = themeName;
  bodyElement.classList.add(`theme-${currentTheme}`);

  document.querySelectorAll(".btn-theme").forEach((btn) => {
    btn.classList.remove("selected");
    if (btn.dataset.theme === themeName) {
      btn.classList.add("selected");
    }
  });
}

// Setează tema de conținut (Fața cărților)
function applyContent(contentName) {
  currentContent = contentName;

  document.querySelectorAll(".btn-content").forEach((btn) => {
    btn.classList.remove("selected");
    if (btn.dataset.content === contentName) {
      btn.classList.add("selected");
    }
  });

  // Actualizează titlul meniului
  DOMElements.startMenuTitle.textContent = `Memory Challenge: ${contentName.toUpperCase()} Edition`;
}

// --- Clasa principală: MemoryGame (Logica) ---

class MemoryGame {
  constructor(size) {
    this.size = size;
    this.totalCards = size * size;
    this.difficulty = size === 4 ? "Ușor (4x4)" : "Greu (6x6)";
    this.storageKey = `memoryBestTime_${size}x${size}_${currentContent}`; // Key unic per dificultate & conținut

    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = null;
    this.secondCard = null;
    this.moves = 0;
    this.matchedPairs = 0;
    this.totalSeconds = 0;
    this.timer = null;
  }

  // --- Utilități API / Conținut ---

  async fetchRMCharacters(numPairs) {
    const maxId = 826;
    const selectedIds = new Set();
    while (selectedIds.size < numPairs) {
      selectedIds.add(Math.floor(Math.random() * maxId) + 1);
    }
    const idsString = Array.from(selectedIds).join(",");
    const url = `https://rickandmortyapi.com/api/character/${idsString}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error("Rick & Morty API request failed");
    let characters = await response.json();
    return Array.isArray(characters) ? characters : [characters];
  }

  async fetchPokeCharacters(numPairs) {
    const selectedIds = new Set();
    while (selectedIds.size < numPairs) {
      selectedIds.add(Math.floor(Math.random() * 151) + 1); // Limităm la Gen 1
    }

    const characters = await Promise.all(
      Array.from(selectedIds).map(async (id) => {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const response = await fetch(url);
        if (!response.ok)
          throw new Error(`Pokemon API request failed for ID ${id}`);
        return response.json();
      })
    );
    return characters;
  }

  getStaticLogos(numPairs) {
    // Amestecă logourile statice și returnează numărul necesar
    const selectedLogos = this.shuffle(STATIC_LOGOS).slice(0, numPairs);
    return selectedLogos;
  }

  // --- Metoda Unificată de Preluare Conținut ---
  async fetchContent(contentTheme) {
    DOMElements.loadingScreen.querySelector(
      "p"
    ).textContent = `Încărcăm conținut (${contentTheme.toUpperCase()})...`;
    this.showScreen(DOMElements.loadingScreen);

    const numPairs = this.totalCards / 2;
    let contentItems = []; // Array de obiecte {id, imageUrl/textValue}

    try {
      switch (contentTheme) {
        case "rickandmorty":
          const rmChars = await this.fetchRMCharacters(numPairs);
          contentItems = rmChars.map((char) => ({
            id: char.id,
            imageUrl: char.image,
          }));
          break;
        case "pokemon":
          const pokeChars = await this.fetchPokeCharacters(numPairs);
          contentItems = pokeChars.map((char) => ({
            id: char.id,
            imageUrl: char.sprites.front_default,
          }));
          break;
        case "logos":
          const logos = this.getStaticLogos(numPairs);
          contentItems = logos.map((logo) => ({
            id: logo.id,
            textValue: logo.value,
          }));
          break;
        default:
          throw new Error("Tema de conținut nu este recunoscută.");
      }
    } catch (error) {
      console.error("Eroare la preluarea datelor:", error);
      alert(
        "Eroare la încărcarea conținutului. Încearcă o altă temă sau reîncarcă pagina."
      );
      return [];
    }

    // Duplică și amestecă perechile
    const duplicatedCards = [...contentItems, ...contentItems];
    return this.shuffle(duplicatedCards);
  }

  // --- Inițializarea și Crearea Tabloului de Joc ---
  async initGame() {
    // NOTĂ: fetchContent apelează deja showScreen(loadingScreen)
    const cards = await this.fetchContent(currentContent);

    if (cards.length === 0) {
      this.showScreen(DOMElements.startMenu);
      return;
    }

    this.showScreen(DOMElements.gameScreen);
    this.resetState();
    this.loadBestTime();

    DOMElements.difficultyLabel.textContent = this.difficulty;
    DOMElements.gameBoard.innerHTML = "";
    DOMElements.gameBoard.className = `game-board grid-container grid-${this.size}x${this.size}`;

    cards.forEach((item, index) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.dataset.id = item.id;
      card.dataset.index = index;

      const frontFace = document.createElement("div");
      frontFace.classList.add("front-face");

      // NOU: Redare dinamică (Imagine sau Text)
      if (item.imageUrl) {
        frontFace.style.backgroundImage = `url('${item.imageUrl}')`;
        frontFace.classList.remove("text-card");
      } else if (item.textValue) {
        frontFace.textContent = item.textValue;
        frontFace.style.backgroundImage = "none";
        frontFace.classList.add("text-card");
      }

      const backFace = document.createElement("div");
      backFace.classList.add("back-face");

      card.appendChild(frontFace);
      card.appendChild(backFace);
      card.addEventListener("click", this.handleCardClick.bind(this));
      DOMElements.gameBoard.appendChild(card);
    });
  }

  // --- Logica de Joc (Rămâne neschimbată) ---

  handleCardClick(event) {
    if (!this.timer) {
      this.startTimer();
    }

    const clickedCard = event.currentTarget;

    if (this.lockBoard) return;
    if (clickedCard === this.firstCard) return;

    clickedCard.classList.add("flip");

    if (!this.hasFlippedCard) {
      this.hasFlippedCard = true;
      this.firstCard = clickedCard;
      return;
    }

    this.secondCard = clickedCard;
    this.incrementMoves();
    this.checkForMatch();
  }

  checkForMatch() {
    const isMatch = this.firstCard.dataset.id === this.secondCard.dataset.id;
    isMatch ? this.disableCards() : this.unflipCards();
  }

  disableCards() {
    this.firstCard.removeEventListener(
      "click",
      this.handleCardClick.bind(this)
    );
    this.secondCard.removeEventListener(
      "click",
      this.handleCardClick.bind(this)
    );

    this.firstCard.classList.add("matched");
    this.secondCard.classList.add("matched");

    this.matchedPairs++;
    this.resetFlippedCards();

    if (this.matchedPairs === this.totalCards / 2) {
      this.endGame();
    }
  }

  unflipCards() {
    this.lockBoard = true;

    setTimeout(() => {
      this.firstCard.classList.remove("flip");
      this.secondCard.classList.remove("flip");
      this.resetFlippedCards();
    }, 1000);
  }

  resetFlippedCards() {
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = null;
    this.secondCard = null;
  }

  incrementMoves() {
    this.moves++;
    DOMElements.movesElement.textContent = this.moves;
  }

  // --- Cronometru & High Score (Cheia include Content) ---

  startTimer() {
    this.timer = setInterval(() => {
      this.totalSeconds++;
      DOMElements.timeElement.textContent = this.formatTime(this.totalSeconds);
    }, 1000);
  }

  endGame() {
    clearInterval(this.timer);
    const isNewRecord = this.saveBestTime(this.totalSeconds);

    setTimeout(() => {
      DOMElements.finalTime.textContent = this.formatTime(this.totalSeconds);
      DOMElements.finalMoves.textContent = this.moves;

      DOMElements.modalMessage.textContent = isNewRecord
        ? `Record Nou! ${this.difficulty} cu ${currentContent.toUpperCase()}!`
        : `Ai terminat ${this.difficulty}.`;

      DOMElements.victoryModal.classList.remove("hidden");
    }, 600);
  }

  loadBestTime() {
    const bestTime = localStorage.getItem(this.storageKey);
    DOMElements.bestTimeElement.textContent = bestTime
      ? this.formatTime(parseInt(bestTime))
      : "--:--";
  }

  saveBestTime(currentSeconds) {
    const bestTimeStr = localStorage.getItem(this.storageKey);
    let bestTime = bestTimeStr ? parseInt(bestTimeStr) : Infinity;

    if (currentSeconds < bestTime) {
      localStorage.setItem(this.storageKey, currentSeconds);
      DOMElements.bestTimeElement.textContent = this.formatTime(currentSeconds);
      return true;
    }
    return false;
  }

  // --- Utilități interne ---

  showScreen(screen) {
    DOMElements.startMenu.classList.add("hidden");
    DOMElements.loadingScreen.classList.add("hidden");
    DOMElements.gameScreen.classList.add("hidden");
    screen.classList.remove("hidden");
  }

  shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex != 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
    return array;
  }

  formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  }

  resetState() {
    clearInterval(this.timer);
    this.timer = null;
    this.hasFlippedCard = false;
    this.lockBoard = false;
    this.firstCard = null;
    this.secondCard = null;
    this.moves = 0;
    this.matchedPairs = 0;
    this.totalSeconds = 0;
    DOMElements.movesElement.textContent = 0;
    DOMElements.timeElement.textContent = "00:00";
    DOMElements.victoryModal.classList.add("hidden");
  }
}

// --- GESTIUNEA EVENIMENTELOR GLOBALE ---

// Gestiunea click-ului pe meniul de dificultate (PORNIRE JOC)
if (DOMElements.difficultyOptions) {
  DOMElements.difficultyOptions.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", (e) => {
      const size = parseInt(e.target.dataset.size);

      activeGame = new MemoryGame(size);

      DOMElements.restartBtn.onclick = () => activeGame.initGame();
      DOMElements.modalRestartBtn.onclick = () => activeGame.initGame();
      DOMElements.newGameBtn.onclick = () =>
        activeGame.showScreen(DOMElements.startMenu);

      activeGame.initGame();
    });
  });
}

// Gestiunea evenimentelor pentru selecția CONȚINUTULUI
if (DOMElements.contentOptionsContainer) {
  DOMElements.contentOptionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-content")) {
      const content = e.target.dataset.content;
      applyContent(content);
    }
  });
}

// Gestiunea evenimentelor pentru selecția STILULUI SPATELUI
if (DOMElements.themeOptionsContainer) {
  DOMElements.themeOptionsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-theme")) {
      const theme = e.target.dataset.theme;
      applyTheme(theme);
    }
  });
}

// --- INIȚIALIZARE LA ÎNCĂRCAREA PAGINII ---
applyTheme(currentTheme);
applyContent(currentContent);
DOMElements.startMenu.classList.remove("hidden");

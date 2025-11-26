# 🧠 Memory Challenge: The Multi-Content Edition

Acesta este un joc de memorie (Perechi) dezvoltat ca o demonstrație de **arhitectură software flexibilă** și **integrare API dinamică**. Proiectul permite utilizatorilor să aleagă nu doar dificultatea, ci și conținutul cărților (imagini preluate din API-uri externe sau conținut static), precum și stilul spatelui cărților.

## ✨ Funcționalități Principale

* **Dificultate Variabilă:** Moduri de joc 4x4 (Ușor) și 6x6 (Greu).
* **Teme de Conținut Dinamic (Fața Cărților):**
    * **Rick & Morty:** Preluare dinamică a personajelor prin Rick and Morty API.
    * **Pokémon:** Preluare dinamică a Pokémonilor de bază prin PokeAPI.
    * **Logouri:** Conținut static (Text/Emoji) care demonstrează o altă metodă de randare.
* **Teme de Stil (Spatele Cărților):** Patru stiluri vizuale diferite (Clasic, Spațiu, Neon, Lava) aplicate prin CSS Variables.
* **Sistem de Scorul Maxim (High Score):** Salvarea celui mai bun timp local folosind `localStorage`, separat pentru fiecare combinație de dificultate și temă de conținut.
* **Cronometru și Contor de Mutări.**

## 🛠️ Tehnologii Utilizate

* **HTML5:** Structura de bază a jocului.
* **CSS3:** Design modern (Glassmorphism), Flexbox/Grid și utilizarea **CSS Variables** pentru gestionarea temelor de stil.
* **JavaScript (ES6+):** Logica jocului, gestiunea stării, manipularea DOM și implementarea clasei `MemoryGame`.
* **Fetch API:** Pentru preluarea asincronă a datelor din surse externe.

## ⚙️ Cum Rulezi Proiectul Local

1.  **Clonează depozitul:**
    ```bash
    git clone [https://github.com/Druid45ra/MEMORY-GAME.git](https://github.com/Druid45ra/MEMORY-GAME.git)
    ```
2.  **Navighează în director:**
    ```bash
    cd MEMORY-GAME
    ```
3.  **Deschide fișierul:**
    * Deschide `index.html` direct în browser (click dreapta -> Open with Chrome/Firefox).

    *Deoarece jocul folosește API-uri externe și nu necesită un mediu backend, nu sunt necesare comenzi suplimentare (npm install, etc.).*

## 🧑‍💻 Structura Fișierelor

| Fișier | Rol |
| :--- | :--- |
| `index.html` | Structura UI, Meniul de Start și ecranele jocului. |
| `style.css` | Stiluri vizuale, layout-ul Grid și variabile CSS pentru temele de stil. |
| `script.js` | Logica principală (`MemoryGame` Class), gestionarea API-urilor (Rick & Morty, Pokémon) și a conținutului static, logica de joc și controlul stării. |

## 🌟 Contribuții

Sugestiile de îmbunătățire sau adăugarea de noi teme de conținut/stil sunt binevenite!

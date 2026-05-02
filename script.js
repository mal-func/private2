const questions = [
  {
    text: "pick the prettiest eyes",
    id: "eyes",
    options: [
      { img: "images/eyes1.png", correct: false },
      { img: "images/eyes2.png", correct: false },
      { img: "images/eyes3.png", correct: false },
      { img: "images/eyes4.png", correct: false },
      { img: "images/eyes5.png", correct: true },
      { img: "images/eyes6.png", correct: false },
      { img: "images/eyes7.png", correct: false },
      { img: "images/eyes8.png", correct: false },
      { img: "images/eyes9.png", correct: false }
    ]
  },
  {
    text: "select the sweetest smile",
    id: "smile",
    options: [
      { img: "images/smile1.png", correct: false },
      { img: "images/smile2.png", correct: false },
      { img: "images/smile3.png", correct: false },
      { img: "images/smile4.png", correct: true },
      { img: "images/smile5.png", correct: false },
      { img: "images/smile6.png", correct: false },
      { img: "images/smile7.png", correct: false },
      { img: "images/smile8.png", correct: false },
      { img: "images/smile9.png", correct: false }
    ]
  },
  {
    text: "find the cutest foodie",
    id: "smile",
    options: [
      { img: "images/foodie1.png", correct: false },
      { img: "images/foodie2.png", correct: true },
      { img: "images/foodie3.png", correct: false },
      { img: "images/foodie4.png", correct: false },
      { img: "images/foodie5.png", correct: false },
      { img: "images/foodie6.png", correct: false },
      { img: "images/foodie7.png", correct: false},
      { img: "images/foodie8.png", correct: false },
      { img: "images/foodie9.png", correct: false }
    ]
  },
  {
    text: "pick the goofiest expression",
    id: "smile",
    options: [
      { img: "images/goofy1.png", correct: false },
      { img: "images/goofy2.png", correct: false },
      { img: "images/goofy3.png", correct: true },
      { img: "images/goofy4.png", correct: false },
      { img: "images/goofy5.png", correct: false },
      { img: "images/goofy6.png", correct: false },
      { img: "images/goofy7.png", correct: false },
      { img: "images/goofy8.png", correct: false },
      { img: "images/goofy9.png", correct: false }
    ]
  }
];

let sudokuSolved = false;
let current = 0;
let answers = [];
let originalSolvedValues = [];
let showingLetters = true;


function loadQuestion() {
  const q = questions[current];
  const box = document.getElementById("questionBox");

  box.innerHTML = `
    <h2>${q.text}</h2>
    <div class="grid">
      ${q.options.map((opt, i) => `
        <img src="${opt.img}" onclick="selectOption(${i})">
      `).join("")}
    </div>
  `;

  box.classList.add("fade-in");

  setTimeout(() => {
    box.classList.remove("fade-in");
  }, 300);
}

function selectOption(index) {
  const q = questions[current];
  answers[current] = q.options[index].correct;

  document.querySelectorAll("img").forEach(img => img.classList.remove("selected"));
  document.querySelectorAll("img")[index].classList.add("selected");

  document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
  const box = document.getElementById("questionBox");

  // start exit animation
  box.classList.add("fade-out");

  setTimeout(() => {
    current++;

    if (current < questions.length) {
      loadQuestion();
      document.getElementById("nextBtn").disabled = true;

      // enter animation
      box.classList.remove("fade-out");
      box.classList.add("fade-in");

      setTimeout(() => {
        box.classList.remove("fade-in");
      }, 300);

    } else {
      showResult();
    }

  }, 300);
}

function showResult() {
  if (answers.every(a => a === true)) {
    // go directly to sudoku (no intermediate text)
    startSudoku();
  } else {
    showFailureScreen();
  }
}

function showFailureScreen() {
  const container = document.querySelector(".container");

  container.innerHTML = `
    <div class="fail-screen">
      <img src="images/fail.png" class="fail-img">
      <p>hmm… that wasn’t quite right... chick is not impressed <br>refresh the page and try again</p>
    </div>
  `;
}

loadQuestion();

document.getElementById("startBtn").onclick = () => {
  const overlay = document.getElementById("introOverlay");

  overlay.classList.add("intro-hide");
};

const sudokuPuzzle = [
  [5,3,"","",7,"","","",""],
  [6,"","",1,9,5,"","",""],
  ["",9,8,"","","","",6,""],
  [8,"","", "",6,"","", "",3],
  [4,"","",8,"",3,"","",1],
  [7,"","", "",2,"","", "",6],
  ["",6,"","","","",2,8,""],
  ["","","",4,1,9,"","",5],
  ["","","","",8,"","",7,9]
];

const sudokuSolution = [
  [5,3,4,6,7,8,9,1,2],
  [6,7,2,1,9,5,3,4,8],
  [1,9,8,3,4,2,5,6,7],
  [8,5,9,7,6,1,4,2,3],
  [4,2,6,8,5,3,7,9,1],
  [7,1,3,9,2,4,8,5,6],
  [9,6,1,5,3,7,2,8,4],
  [2,8,7,4,1,9,6,3,5],
  [3,4,5,2,8,6,1,7,9]
];

function startSudoku() {
  document.getElementById("nextBtn").style.display = "none";
  document.getElementById("result").innerHTML = "";
  const container = document.querySelector(".container");

  container.innerHTML = `
    <h2>Solve this</h2>
    <div id="sudokuGrid"></div>
  `;

  generateSudoku();
}

function generateSudoku() {
  const grid = document.getElementById("sudokuGrid");

  grid.style.display = "grid";
  grid.style.gridTemplateColumns = "repeat(9, 40px)";
  grid.style.gap = "4px";
  grid.style.justifyContent = "center";

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const input = document.createElement("input");
      input.classList.add("cell");

      if (sudokuPuzzle[r][c] !== "") {
        input.value = sudokuPuzzle[r][c];
        input.disabled = true;
      }

      input.dataset.row = r;
      input.dataset.col = c;

      input.addEventListener("input", validateSudoku);

      grid.appendChild(input);
    }
  }
}

function validateSudoku() {
  if (sudokuSolved) return;

  const cells = document.querySelectorAll(".cell");

  let correct = true;

  cells.forEach(cell => {
    const r = cell.dataset.row;
    const c = cell.dataset.col;

    if (!cell.disabled) {
      if (parseInt(cell.value) !== sudokuSolution[r][c]) {
        correct = false;
      }
    }
  });

  if (correct) {
    sudokuSolved = true;

    const cells = document.querySelectorAll(".cell");
    originalSolvedValues = [...cells].map(cell => {
      const r = cell.dataset.row;
      const c = cell.dataset.col;
      return sudokuSolution[r][c];
    });
    revealFinal();
  }
}

function revealFinal() {
  const cells = document.querySelectorAll(".cell");

  const centerBlock = [
    30, 31, 32,
    39, 40, 41,
    48, 49, 50
  ];

  const blockCenters = [
    10, 13, 16,
    37, 40, 43,
    64, 67, 70
  ];
  let code = "1/ 2Q 3a 4a 5K 6e 72 8C 9d"
  const letters = ["2","e","/","C","K","a","d","Q","a"];

  cells.forEach((cell, i) => {
    setTimeout(() => {
      cell.style.transition = "transform 0.6s";
      cell.style.transform = "rotateY(90deg)"; // halfway flip

      setTimeout(() => {

        if (centerBlock.includes(i)) {
          const pos = centerBlock.indexOf(i);
          cell.value = letters[pos];
          cell.classList.remove("discord");

        } else if (blockCenters.includes(i)) {
          // show logo ONLY on block centers
          cell.value = "";
          cell.classList.add("discord");

        } else {
          // everything else empty
          cell.value = "";
          cell.classList.remove("discord");
        }

        // flip back to normal so text is readable
        cell.style.transform = "rotateY(0deg)";

      }, 300);

    }, i * 15);
  });

  // ADD BUTTON
  setTimeout(() => {
    const btn = document.createElement("button");
    btn.innerText = "toggle view";
    btn.onclick = toggleView;

    document.querySelector(".container").appendChild(btn);
  }, 1200);
}

function toggleView() {
  const cells = document.querySelectorAll(".cell");

  const centerBlock = [
    30, 31, 32,
    39, 40, 41,
    48, 49, 50
  ];

  const blockCenters = [
    10, 13, 16,
    37, 40, 43,
    64, 67, 70
  ];

  const letters = ["2","e","/","C","K","a","d","Q","a"];

  showingLetters = !showingLetters;

  cells.forEach((cell, i) => {
    setTimeout(() => {
      cell.style.transition = "transform 0.5s";
      cell.style.transform = "rotateY(90deg)";

      setTimeout(() => {

        if (showingLetters) {
          if (centerBlock.includes(i)) {
            const pos = centerBlock.indexOf(i);
            cell.value = letters[pos];
            cell.classList.remove("discord");

          } else if (blockCenters.includes(i)) {
            cell.value = "";
            cell.classList.add("discord");

          } else {
            cell.value = "";
            cell.classList.remove("discord");
          }

        } else {
          cell.classList.remove("discord");
          cell.value = originalSolvedValues[i];
        }

        cell.style.transform = "rotateY(0deg)";

      }, 250);

    }, i * 8); // slightly faster than reveal
  });
}
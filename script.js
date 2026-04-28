let selections = {};

// Handle clicks
document.querySelectorAll("img").forEach(img => {
  img.addEventListener("click", () => {
    let parent = img.parentElement.id;

    // remove old selection
    document.querySelectorAll(`#${parent} img`)
      .forEach(i => i.classList.remove("selected"));

    img.classList.add("selected");
    selections[parent] = img.dataset.correct;
  });
});

function checkAnswers() {
  let result = document.getElementById("result");

  if (selections["eyes"] === "true" &&
      selections["smile"] === "true") {

    result.innerHTML = `
      <br>Interesting...<br><br>
      You didn’t choose randomly.<br>
      You chose what you recognized.<br><br>
      <strong>ACCESS CODE: RECOGNIZED</strong>
    `;
  } else {
    result.innerHTML = "Incorrect. Try again.";
  }
}
const display = document.querySelector("#display");

function updateDisplay(num) {
  if (num === NaN) display.textContent("");
  else display.textContent = `${num}`;
}

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    updateDisplay(button.name);
  })
})


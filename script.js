const display = document.querySelector("#display");
const plus = document.querySelector("#plus");
const minus = document.querySelector("#minus");
const mult = document.querySelector("#mult");
const divide = document.querySelector("#divide");

function updateDisplay(toDisplay) {
  if (toDisplay === "unchanged") return; // Do not update
  else if (toDisplay === "") display.textContent = "0";
  else display.textContent = `${toDisplay}`;
}

var num1 = "", num2 = "", op = "";
var operated = false;

function resetVar() {
  num1 = "", num2 = "", op = "";
  lightenOp();
}

// Function to darken the button when the operator is selected
let target;
function darkenOp(op) {
  switch (op) {
    case "+":
      target = plus;
      break;
    case "-":
      target = minus;
      break;
    case "*":
      target = mult;
      break;
    case "/":
      target = divide;
      break;
  }
  target.classList.add("darken");
}

function lightenOp() {
  target.classList.remove("darken");
}

function operate(op) {
  num1 = Number(num1), num2 = Number(num2);
  switch (op) {
    case "+":
      num1 += num2;
      break;
    case "-":
      num1 -= num2;
      break;
    case "*":
      num1 *= num2;
      break;
    case "/":
      num1 /= num2;
      break;
  }
  lightenOp();
  let rounded = num1.toFixed(2);
  if (rounded == num1) return num1;
  else return rounded;
}

function updateVar(input) {
  // If the input is a number
  if (!isNaN(input)) {
    if (operated === true) {
      num1 = input;
      operated = false;
      return num1;
    }
    // If theres no operator, update num1
    if (!op) {
      num1 += input; // Concatenate, since they are strings
      return num1;
    }
    // If there's already operator, update num2 instead
    else if (op) {
      num2 += input;
      return num2;
    }
  }
  // Reset all var
  else if (input === "AC") {
    resetVar();
    return num1;
  }
  // Update op
  else if (input === "+" || input === "-" || input === "*" || input === "/") {
    if (op) { // If there's already operator, operate the previous calculation
      operate(op);
      op = input, num2 = ""; // Reset the operator to the new op, num2 to undefined.
      return num1;
    }
    op = input;
    darkenOp(op);
    operated = false; // Flag to false, so second number can be filled
    return "unchanged";
  }
  else if (input === "=") {
    operate(op);
    op = "", num2 = ""; // Reset the operator, and num2
    operated = true; // Flag to true, only when explicit operation was done
    return num1;
  }
}

const buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    // Get what to be displayed from the update function;
    let toDisplay = updateVar(button.name);
    updateDisplay(toDisplay);
  })
})


const display = document.querySelector("#display");

function updateDisplay(toDisplay) {
  if (toDisplay === "unchanged") return; // Do not update
  else if (toDisplay === "") display.textContent = "0";
  else display.textContent = `${toDisplay}`;

    console.log(op);
}

var num1 = "", num2 = "", op = "";

function resetVar() {
  num1 = "", num2 = "", op = "";
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
  op = ""; // Reset the operator
  num1 = num1.toFixed(2);
}

function updateVar(input) {
  // If the input is a number
  if (!isNaN(input)) {
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
      num1 = operate(input);
      return num1;
    }
    op = input;
    return "unchanged";
  }
  else if (input === "=") {
    operate(op);
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


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
var operated = false; // flag to check whether or not operation has been made
var operatorOn = false; // flag to check whether there's operator in the buffer
var dotted = false;
var toDisplay;
var restored = false;

class Snap {
  constructor(num1, num2, op, operatorOn, dotted, toDisplay) {
    this.num1 = num1;
    this.num2 = num2;
    this.op = op;
    this.operatorOn = operatorOn;
    this.dotted = dotted;
    this.toDisplay = toDisplay;
  }
}

var snapshots = [];
function restoreSnap() {
  tempDot = dotted;
  tempOp = operatorOn;
  let index = snapshots.length - 2;
  if (index < 0) {
    resetVar();
    return;
  } 
  // Revert the variables
  num1 = snapshots[index].num1;
  num2 = snapshots[index].num2;
  op = snapshots[index].op;
  operatorOn = snapshots[index].operatorOn;
  dotted = snapshots[index].dotted;
  toDisplay = snapshots[index].toDisplay;
  if (toDisplay === "unchanged") // When operator was sent, revert to the previous index instead
    toDisplay = snapshots[index - 1].toDisplay;
  // Remove the last snapshot;
  snapshots.pop();
  // If buttons that relates to UI change, adjust
  if (tempDot === false && dotted === true) darkenDot();
  else if (tempDot === true && dotted === false) lightenDot();
  if (tempOp === false && operatorOn === true) darkenOp();
  else if (tempOp === true && operatorOn === false) lightenOp();
}

function resetVar() {
  num1 = "", num2 = "", op = "";

  if (operatorOn) {
    lightenOp();
    operatorOn = false;
  }
  if (dotted) {
    lightenDot();
    dotted = false;
  }
}

function resetSnap() {
  snapshots = [];
}

function resetAll() {
  resetVar();
  resetSnap();
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
  operatorOn = true;
}

function lightenOp() {
  target.classList.remove("darken");
  operatorOn = false;
}

function addDot(num) {
  dotted = true;
  darkenDot();
  if (num === "") num += "0";
  return num += ".";
}

let dot = document.querySelector("#dot");
function darkenDot() {
  dot.classList.add("darken");
}
function lightenDot() {
  dot.classList.remove("darken");
  dotted = false;
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
  lightenDot();
  let rounded = num1.toFixed(2);
  if (rounded != num1) num1 = rounded; // If theres decimal value, round it to 2 decimal places
}

function updateVar(input) {
  // If the input is a number
  if (!isNaN(input) || input === ".") {
    if (input === ".") {
      if (dotted) return "unchanged";
    }
    // Reset the number, if an operation has just been finished
    if (operated === true) {
      operated = false;
      if (input === ".") {
        num1 = addDot("");
        return num1;
      }
      num1 = input;
      return num1;
    }
    // If theres no operator, update num1
    if (!op) {
      if (input === ".") {
        num1 = addDot(num1);
        return num1;
      }
      num1 += input; // Concatenate, since they are strings
      return num1;
    }
    // If there's already operator, update num2 instead
    else if (op) {
      if (input === ".") {
        num2 = addDot(num2);
        return num2;
      }
      num2 += input;
      return num2;
    }
  }
  // Restore snapshot
  else if (input === "backspace") {
    restoreSnap();
    restored = true;
    return toDisplay;
  }
  // Reset all
  else if (input === "AC") {
    resetAll();
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
  // Operate
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
    toDisplay = updateVar(button.name);
    // Insert snapshot of current configuration
    if (!restored) {
      var snapshot = new Snap(num1, num2, op, operatorOn, dotted, toDisplay);
      snapshots.push(snapshot);
    }
    console.log(snapshots);
    restored = false;
    updateDisplay(toDisplay);
  })
})


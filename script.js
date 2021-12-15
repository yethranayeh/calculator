/** @format */

const displayArea = document.querySelector("#displayArea");
const deleteInputBtn = document.querySelector("#deleteInput");
const clearDisplayBtn = document.querySelector("#clear");
const numbersDOM = document.querySelectorAll(".number");
const decimal = document.querySelector("#decimal");
const operatorsDOM = document.querySelectorAll(".operator");
const equals = document.querySelector("#equals");

deleteInputBtn.addEventListener("click", deleteInput);

// Click handling
clearDisplayBtn.addEventListener("click", function () {
	clearDisplay(true);
});

numbersDOM.forEach((number) => {
	number.addEventListener("click", clickEventHandler);
});

operatorsDOM.forEach((operator) => {
	operator.addEventListener("click", clickEventHandler);
});

equals.addEventListener("click", clickEventHandler);

// Key presses
window.addEventListener("keydown", keyEventHandler);

function display(number) {
	if (displayArea.textContent.length < 23) {
		displayArea.textContent += number;
	}
}

function deleteInput() {
	let currentText = displayArea.textContent;
	if (currentText === "NaN" || currentText.includes("Siri") || currentText.includes("Stop!")) {
		displayArea.textContent = "";
	} else if (currentText) {
		// If the next string element to be deleted is a decimal point, de-activate it, so it can be used again
		if (currentText[currentText.length - 1] === ".") {
			decimalState(0);
		}
		displayArea.textContent = currentText.slice(0, currentText.length - 1);
	}
}

function clearDisplay(hard) {
	displayArea.textContent = "";
	// Remove "active" class from operatorsDOM
	removeActiveClass();
	// De-activate decimal after clearing display
	decimalState(0);
	let hardClear = hard ? true : false;
	resultDisplayed = false;
	operatorActive = false;
	if (hardClear) {
		previousOperator = undefined;
	}
}

function removeActiveClass() {
	operatorsDOM.forEach((operator) => {
		operator.classList.remove("active");
	});
}

function decimalState(state) {
	if (state === 1) {
		decimal.classList.remove("number");
		decimal.classList.add("decimal-active");
		decimal.classList.add("disable-hover");
		decimalActive = true;
	} else if (state === 0) {
		decimal.classList.add("number");
		decimal.classList.remove("decimal-active");
		decimal.classList.remove("disable-hover");
		decimalActive = false;
	}
}

function performEquation(operator) {
	if (operator === "add" || operator == "+") {
		// console.log(`Adding prevNum: ${previousNumber} + displayNum: ${Number(displayArea.textContent)}`);
		return previousNumber + Number(displayArea.textContent);
	} else if (operator === "subtract") {
		// console.log(`Subtracting prevNum: ${previousNumber} - displayNum: ${Number(displayArea.textContent)}`);
		return previousNumber - Number(displayArea.textContent);
	} else if (operator === "multiply") {
		// console.log(`Multiplying prevNum: ${previousNumber} * displayNum: ${Number(displayArea.textContent)}`);
		return previousNumber * Number(displayArea.textContent);
	} else if (operator === "divide") {
		// console.log(`Dividing prevNum: ${previousNumber} / displayNum: ${Number(displayArea.textContent)}`);
		if (previousNumber === 0 && Number(displayArea.textContent) === 0) {
			return "You should ask Siri";
		} else if (previousNumber === 0 || Number(displayArea.textContent) === 0) {
			return "Stop! You've violated the law!";
		} else {
			return previousNumber / Number(displayArea.textContent);
		}
	}
	resultDisplayed = true;
	// Remove operator name
	previousOperator = undefined;
}

function showResult() {
	removeActiveClass();
	decimalState(0);
	if (!resultDisplayed || !Number(displayArea.textContent) === NaN) {
		displayArea.textContent = performEquation(previousOperator);
		resultDisplayed = true;
		previousOperator = undefined;
	} else {
		clearDisplay(true);
	}
}

function operatorHandler(target) {
	let operatorTarget = target;
	// Set operator to active
	operatorActive = true;
	// Remove all active classes before adding active to current operator
	removeActiveClass();
	operatorTarget.classList.add("active");
	// Disable decimal until the next number input is received
	decimalState(1);
	// Set the current number on screen as previous to keep it in memory for the operation

	// if an operator was previously used, perform its equation first
	if (previousOperator) {
		displayArea.textContent = performEquation(previousOperator);
	}
	previousNumber = Number(displayArea.textContent);
	previousOperator = operatorTarget.id;
}

let previousNumber = 0;
let previousOperator;
let operatorActive = false;
let decimalActive = false;
let resultDisplayed = false;

function clickEventHandler(e) {
	// If *, /, -, + is clicked
	if (e.target.classList.contains("operator")) {
		operatorHandler(e.target);
	} else if (e.target.id === "equals") {
		showResult();
	} else if (e.target.classList.contains("number")) {
		// If the result is on display after previous operation, clear the screen
		if (resultDisplayed) {
			clearDisplay();
			// resultDisplayed = false;
		}
		// Decimal handling
		if (e.target.id === "decimal") {
			if (!decimalActive) {
				// Activates decimal so it can only be pressed once
				decimalState(1);
			}
		} else if (operatorActive) {
			// operatorActive = false;
			clearDisplay();
		}
		display(e.target.textContent);
	}
}

const NUMBERS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const OPERATORS = ["+", "-", "/", "*"];

function keyEventHandler(e) {
	// console.log(e);
	let key = e.key;
	if (NUMBERS.includes(key)) {
		// If the result is on display after previous operation, clear the screen
		if (resultDisplayed) {
			clearDisplay();
			// resultDisplayed = false;
		} else if (operatorActive) {
			// operatorActive = false;
			clearDisplay();
		}
		display(key);
	} else if (OPERATORS.includes(key)) {
		if (key === "+") {
			operatorHandler(document.querySelector("#add"));
		} else if (key === "-") {
			operatorHandler(document.querySelector("#subtract"));
		} else if (key === "*") {
			operatorHandler(document.querySelector("#multiply"));
		} else if (key === "/") {
			operatorHandler(document.querySelector("#divide"));
		}
	} else if (key === ".") {
		if (!decimalActive) {
			// Activates decimal so it can only be pressed once
			decimalState(1);
			displayArea.textContent += ".";
		}
	} else if (key === "Enter") {
		showResult();
	} else if (key === "Backspace") {
		deleteInput();
	} else if (key === "Delete") {
		clearDisplay(true);
	}
}

/** @format */

const displayArea = document.querySelector("#displayArea");
const deleteInputBtn = document.querySelector("#deleteInput");
const clearDisplayBtn = document.querySelector("#clear");
const numbers = document.querySelectorAll(".number");
const decimal = document.querySelector("#decimal");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector("#equals");

deleteInputBtn.addEventListener("click", (e) => {
	let currentText = displayArea.textContent;
	if (currentText === "NaN") {
		displayArea.textContent = "";
	} else if (currentText) {
		// If the next string element to be deleted is a decimal point, de-activate it, so it can be used again
		if (currentText[currentText.length - 1] === ".") {
			decimalState(0);
		}
		displayArea.textContent = currentText.slice(0, currentText.length - 1);
	}
});

clearDisplayBtn.addEventListener("click", function () {
	clearDisplay(true);
});

numbers.forEach((number) => {
	number.addEventListener("click", eventHandler);
});

operators.forEach((operator) => {
	operator.addEventListener("click", eventHandler);
});

equals.addEventListener("click", eventHandler);

function display(number) {
	if (displayArea.textContent.length < 23) {
		displayArea.textContent += number;
	}
}

function clearDisplay(hard) {
	displayArea.textContent = "";
	// Remove "active" class from operators
	removeActiveClass();
	// De-activate decimal after clearing display
	decimalState(0);
	let hardClear = hard ? true : false;
	resultDisplayed = false;
	operatorActive = false;
	if (hardClear) {
		operator = undefined;
	}
}

function removeActiveClass() {
	operators.forEach((operator) => {
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
	console.log("perform eq");
	console.log(operator);
	if (operator === "add") {
		console.log(`Adding prevNum: ${previousNumber} + displayNum: ${Number(displayArea.textContent)}`);
		return previousNumber + Number(displayArea.textContent);
	} else if (operator === "subtract") {
		console.log(`Subtracting prevNum: ${previousNumber} - displayNum: ${Number(displayArea.textContent)}`);
		return previousNumber - Number(displayArea.textContent);
	} else if (operator === "multiply") {
		console.log(`Multiplying prevNum: ${previousNumber} * displayNum: ${Number(displayArea.textContent)}`);
		return previousNumber * Number(displayArea.textContent);
	} else if (operator === "divide") {
		console.log(`Dividing prevNum: ${previousNumber} / displayNum: ${Number(displayArea.textContent)}`);
		return previousNumber / Number(displayArea.textContent);
	}
	resultDisplayed = true;
	// Remove operator name
	operator = undefined;
}

let previousNumber = 0;
let operator;
let operatorActive = false;
let decimalActive = false;
let resultDisplayed = false;

function eventHandler(e) {
	// If *, /, -, + is clicked
	if (e.target.classList.contains("operator")) {
		// Set operator to active
		operatorActive = true;
		// Remove all active classes before adding active to current operator
		removeActiveClass();
		e.target.classList.add("active");
		// Disable decimal until the next number input is received
		decimalState(1);
		// Set the current number on screen as previous to keep it in memory for the operation

		// if an operator was previously used, perform its equation first
		if (operator) {
			displayArea.textContent = performEquation(operator);
		}
		previousNumber = Number(displayArea.textContent);
		operator = e.target.id;

		// if (e.target.id === "add") {
		// 	return;
		// } else if (e.target.id === "subtract") {
		// 	return;
		// } else if (e.target.id === "multiply") {
		// 	return;
		// } else if (e.target.id === "divide") {
		// 	return;
		// }
	} else if (e.target.id === "equals") {
		removeActiveClass();
		if (!resultDisplayed) {
			displayArea.textContent = performEquation(operator);
			resultDisplayed = true;
			operator = undefined;
		}
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
		// If the previous number in-memory is the same, keep it, if not change it.
	}
}

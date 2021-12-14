/** @format */

const displayArea = document.querySelector("#displayArea");
const clearDisplay = document.querySelector("#clear");
const numbers = document.querySelectorAll(".number");
const operators = document.querySelectorAll(".operator");
const equals = document.querySelector("#equals");

clearDisplay.addEventListener("click", (e) => {
	displayArea.textContent = "";
});

numbers.forEach((number) => {
	number.addEventListener("click", eventHandler);
});

operators.forEach((operator) => {
	operator.addEventListener("click", eventHandler);
});

equals.addEventListener("click", eventHandler);

function display(number) {
	displayArea.textContent = number;
}

function removeActiveClass() {
	operators.forEach((operator) => {
		operator.classList.remove("active");
	});
}

function eventHandler(e) {
	display(e.target.id);

	// If *, /, -, + is clicked
	if (e.target.classList.contains("operator")) {
		removeActiveClass();
		e.target.classList.add("active");

		if (e.target.id === "add") {
			return;
		} else if (e.target.id === "subtract") {
			return;
		} else if (e.target.id === "multiply") {
			return;
		} else if (e.target.id === "divide") {
			return;
		}
	} else if (e.target.id === "equals") {
		removeActiveClass();
	}
}

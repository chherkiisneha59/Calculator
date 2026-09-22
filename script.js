let input = document.getElementById('inputBox');
let buttons = document.querySelectorAll('.calculator button');
let themeToggle = document.getElementById('themeToggle');
let themeIcon = document.getElementById('themeIcon');
let themeText = document.getElementById('themeText');

// Theme toggle logic
function setTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light-mode');
        themeIcon.textContent = '🌙';
        themeText.textContent = 'Dark';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light-mode');
        themeIcon.textContent = '☀️';
        themeText.textContent = 'Light';
        localStorage.setItem('theme', 'dark');
    }
}

// Load saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    setTheme(true);
} else {
    setTheme(false);
}

themeToggle.addEventListener('click', () => {
    const isLight = document.body.classList.contains('light-mode');
    setTheme(!isLight);
});

// Calculator state & edge-case handling
let currentInput = "";
let isEvaluated = false;
let isError = false;

const isOperator = (char) => ['+', '-', 'x', '*', '/', '%'].includes(char);

function updateDisplay(val) {
    let displayVal = val !== "" ? val : "0";
    input.value = displayVal;

    // Dynamically shrink font size for long text / error messages so it never gets cut off
    if (displayVal.length > 14) {
        input.style.fontSize = "20px";
    } else if (displayVal.length > 10) {
        input.style.fontSize = "25px";
    } else if (displayVal.length > 7) {
        input.style.fontSize = "30px";
    } else {
        input.style.fontSize = "40px";
    }
}

function handleInput(btnText) {
    // Reset if previous action produced an error
    if (isError && btnText !== 'AC') {
        currentInput = "";
        isError = false;
        isEvaluated = false;
    }

    // All Clear
    if (btnText === 'AC') {
        currentInput = "";
        isEvaluated = false;
        isError = false;
        updateDisplay(currentInput);
        return;
    }

    // Delete single character
    if (btnText === 'DEL') {
        if (isEvaluated || isError) {
            currentInput = "";
            isEvaluated = false;
            isError = false;
        } else {
            currentInput = currentInput.slice(0, -1);
        }
        updateDisplay(currentInput);
        return;
    }

    // Evaluate '='
    if (btnText === '=') {
        if (!currentInput) return;

        // Strip trailing operators before evaluation
        let expr = currentInput;
        while (expr.length > 0 && isOperator(expr.slice(-1))) {
            expr = expr.slice(0, -1);
        }

        if (!expr) {
            currentInput = "";
            updateDisplay("0");
            return;
        }

        try {
            // Replace 'x' or 'X' with '*'
            expr = expr.replace(/x/gi, '*');

            // Format percentage: convert 'num%' to '(num/100)'
            expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
            expr = expr.replace(/%/g, '/100');

            // Evaluate expression safely
            let result = eval(expr);

            // Handle division by zero & invalid results
            if (result === Infinity || result === -Infinity) {
                updateDisplay("Cannot divide by 0");
                isError = true;
                currentInput = "";
                return;
            }

            if (isNaN(result)) {
                updateDisplay("Error");
                isError = true;
                currentInput = "";
                return;
            }

            // Fix JavaScript floating point inaccuracies (e.g. 0.1 + 0.2)
            if (typeof result === 'number') {
                result = Math.round(result * 1e10) / 1e10;
            }

            currentInput = result.toString();
            updateDisplay(currentInput);
            isEvaluated = true;
        } catch (err) {
            updateDisplay("Error");
            isError = true;
            currentInput = "";
        }
        return;
    }

    // Handle Decimal '.' (prevent multiple dots in a single number)
    if (btnText === '.') {
        if (isEvaluated) {
            currentInput = "0.";
            isEvaluated = false;
            updateDisplay(currentInput);
            return;
        }
        let lastNum = currentInput.split(/[\+\-x\*\/\%]/).pop();
        if (lastNum.includes('.')) {
            return; // Ignore redundant decimal point
        }
        if (!currentInput || isOperator(currentInput.slice(-1))) {
            currentInput += "0.";
            updateDisplay(currentInput);
            return;
        }
    }

    // Handle Operators (+, -, x, /, %)
    if (isOperator(btnText)) {
        if (!currentInput && btnText !== '-') {
            return; // Do not start with operator other than '-'
        }
        if (isEvaluated) {
            isEvaluated = false;
        }
        let lastChar = currentInput.slice(-1);
        if (isOperator(lastChar)) {
            currentInput = currentInput.slice(0, -1) + btnText;
            updateDisplay(currentInput);
            return;
        }
    }

    // Handle Numbers (0-9, 00)
    if (!isOperator(btnText) && btnText !== '.') {
        if (isEvaluated) {
            currentInput = "";
            isEvaluated = false;
        }

        // Prevent leading zeros like '00' when input is empty or '0'
        if ((currentInput === "" || currentInput === "0") && (btnText === "0" || btnText === "00")) {
            currentInput = "0";
            updateDisplay(currentInput);
            return;
        }
        if (currentInput === "0" && btnText !== "0") {
            currentInput = btnText;
            updateDisplay(currentInput);
            return;
        }
    }

    currentInput += btnText;
    updateDisplay(currentInput);
}

// Button Click Event Listeners
Array.from(buttons).forEach(button => {
    button.addEventListener('click', (e) => {
        let btnText = e.target.innerText.trim();
        handleInput(btnText);
    });
});

// Physical Keyboard Event Listener
document.addEventListener('keydown', (e) => {
    let key = e.key;
    if (key >= '0' && key <= '9') {
        handleInput(key);
    } else if (key === '+' || key === '-' || key === '/' || key === '%') {
        handleInput(key);
    } else if (key === '*') {
        handleInput('x');
    } else if (key === '.') {
        handleInput('.');
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        handleInput('=');
    } else if (key === 'Backspace') {
        handleInput('DEL');
    } else if (key === 'Escape') {
        handleInput('AC');
    }
});
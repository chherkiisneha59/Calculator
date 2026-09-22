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

// Calculator buttons logic
let string = "";
let arr = Array.from(buttons);
arr.forEach(button => {
    button.addEventListener('click', (e) => {
        let btnText = e.target.innerHTML;
        if(btnText == '=') {
            try {
                let expression = string.replace(/x/g, '*');
                string = eval(expression).toString();
                input.value = string;
            } catch (err) {
                input.value = "Error";
                string = "";
            }
        } else if(btnText == 'AC') {
            string = "";
            input.value = string;
        } else if(btnText == 'DEL') {
            string = string.substring(0, string.length-1);
            input.value = string;
        } else {
            string += btnText;
            input.value = string;
        }
    });
});
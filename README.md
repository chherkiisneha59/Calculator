# 🧮 Calculator App

A clean, modern, and feature-rich Web Calculator built with HTML, CSS, and Vanilla JavaScript.

## ✨ Features

- **🎨 Light & Dark Mode**: Toggle seamlessly between light and dark themes (saved via `localStorage`).
- **🎯 Centered & Modern Layout**: Sleek neumorphic/glassmorphism design centered on screen with fixed top-right theme toggle.
- **🛡️ Robust Edge-Case Handling**:
  - Division by zero protection (`Cannot divide by 0`).
  - Consecutive operator replacement (`5 + +` becomes `5 +`).
  - Multiple decimal prevention (`5.2.3` is blocked).
  - Leading zero normalization (`00` prevented).
  - Floating-point precision fix (e.g. `0.1 + 0.2` = `0.3`).
- **🔤 Dynamic Font Scaling**: Automatically shrinks font size for longer values & error messages so text is never cut off.
- **⌨️ Keyboard Support**: Fully operable with physical keyboard inputs (numbers, operators, Enter, Backspace, Escape).

## 🚀 Technologies Used

- **HTML5** - Structure & semantics
- **CSS3** - CSS Custom Properties (Variables), Flexbox, modern layout & transitions
- **JavaScript (ES6)** - Dynamic DOM manipulation, state management, event listeners

## 💻 How to Run

1. Clone the repository:
   ```bash
   git clone https://github.com/chherkiisneha59/Calculator.git
   ```
2. Open `index.html` in any modern web browser.

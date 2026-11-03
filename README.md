# Simple & Beginner-Friendly Calculator Web Application

A clean, modern, and responsive Calculator Web Application built using vanilla **HTML5**, **CSS3**, and **JavaScript** (ES6+).

![Calculator Preview](calculator_desktop.png)

---

## Features

- **Clean & Attractive Interface**: Modern dark glassmorphic UI with vibrant color-coded buttons, smooth hover animations, and subtle drop shadows.
- **Full Keypad Functionality**:
  - Digits `0` through `9`
  - Core arithmetic operators: Addition (`+`), Subtraction (`-`), Multiplication (`×`), and Division (`÷`)
  - Decimal point (`.`) with single-decimal validation per operand
  - Equals (`=`) with support for chained calculations
  - Clear (`C`) to reset the calculation
  - Delete / Backspace (`⌫`) to remove the last entered digit
- **Dual-line Display**: Displays the current entry alongside previous operations and operators.
- **Division by Zero Protection**: Gracefully catches division by zero and displays a clear message (`Cannot divide by zero`) instead of `Infinity` or crashing.
- **Floating-point Precision**: Rounds long floating point decimals cleanly (e.g. `0.1 + 0.2 = 0.3`).
- **Thousand Separator Formatting**: Formats large numbers with localized thousand commas for readability.
- **Full Keyboard Support**: Seamlessly type numbers, operators, Enter/Equal, Backspace, and Escape.
- **Fully Responsive**: Adapts fluidly across mobile screens, tablets, and desktop displays.

---

## Project Structure

```
.
├── index.html              # Calculator semantic structure and markup
├── style.css               # Modern styling, responsive grid layout, and animations
├── script.js               # Calculator logic class and DOM event handling
├── tests/
│   └── calculator.test.js  # Automated unit test suite (Node.js test runner)
└── README.md               # Project documentation and instructions
```

---

## Keyboard Shortcuts

| Key | Calculator Action |
| --- | --- |
| `0` – `9` | Input digits |
| `.` | Input decimal point |
| `+` | Add |
| `-` | Subtract |
| `*` | Multiply |
| `/` | Divide |
| `Enter` or `=` | Calculate result |
| `Backspace` | Delete last entered digit |
| `Escape` | Clear all |

---

## How to Run the Project

No build step, compiler, or external dependencies are required to run this application!

### Method 1: Open Directly in Any Web Browser
Simply double-click the `index.html` file or open it in any modern web browser (Chrome, Firefox, Safari, Edge).

```bash
# On Linux / macOS
xdg-open index.html # Linux
# or
open index.html     # macOS
```

### Method 2: Run with a Local Static Server
You can also serve the project using Python or any static HTTP server:

```bash
# Using Python 3
python3 -m http.server 8080
```
Then navigate to `http://localhost:8080` in your browser.

```bash
# Using Node.js (npx serve)
npx serve .
```

---

## Running the Automated Tests

The application includes an automated test suite verifying core arithmetic, chaining, decimal input, backspace, and division by zero protection.

To run the unit tests:

```bash
node tests/calculator.test.js
```

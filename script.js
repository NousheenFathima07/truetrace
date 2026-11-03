/**
 * Core Calculator Engine & UI Handler
 */
class Calculator {
  constructor(previousOperandElement, currentOperandElement) {
    this.previousOperandElement = previousOperandElement;
    this.currentOperandElement = currentOperandElement;
    this.clear();
  }

  /**
   * Resets calculator state
   */
  clear() {
    this.currentOperand = '0';
    this.previousOperand = '';
    this.operation = undefined;
    this.isError = false;
    this.shouldResetScreen = false;
  }

  /**
   * Removes last digit from current operand
   */
  delete() {
    if (this.isError) {
      this.clear();
      return;
    }
    if (this.shouldResetScreen) {
      this.currentOperand = '0';
      this.shouldResetScreen = false;
      return;
    }
    if (this.currentOperand.length === 1 || (this.currentOperand.length === 2 && this.currentOperand.startsWith('-'))) {
      this.currentOperand = '0';
    } else {
      this.currentOperand = this.currentOperand.slice(0, -1);
    }
  }

  /**
   * Appends a number or decimal point
   */
  appendNumber(number) {
    if (this.isError) {
      this.clear();
    }

    if (this.shouldResetScreen) {
      this.currentOperand = '';
      this.shouldResetScreen = false;
    }

    if (number === '.') {
      if (this.currentOperand.includes('.')) return;
      if (this.currentOperand === '' || this.currentOperand === '0') {
        this.currentOperand = '0.';
        return;
      }
    }

    if (this.currentOperand === '0' && number !== '.') {
      this.currentOperand = number.toString();
    } else {
      // Limit input length to prevent UI overflow
      if (this.currentOperand.replace('-', '').length >= 16) return;
      this.currentOperand = this.currentOperand.toString() + number.toString();
    }
  }

  /**
   * Selects an arithmetic operator (+, -, ×, ÷)
   */
  chooseOperation(operation) {
    if (this.isError) {
      this.clear();
    }

    if (this.currentOperand === '' && this.previousOperand === '') return;

    if (this.previousOperand !== '' && !this.shouldResetScreen) {
      this.compute();
      if (this.isError) return;
    }

    this.operation = operation;
    this.previousOperand = this.currentOperand;
    this.shouldResetScreen = true;
  }

  /**
   * Performs computation
   */
  compute() {
    if (this.isError || !this.operation || this.previousOperand === '') return;

    let computation;
    const prev = parseFloat(this.previousOperand);
    const current = parseFloat(this.currentOperand);

    if (isNaN(prev) || isNaN(current)) return;

    switch (this.operation) {
      case '+':
        computation = prev + current;
        break;
      case '-':
        computation = prev - current;
        break;
      case '×':
      case '*':
        computation = prev * current;
        break;
      case '÷':
      case '/':
        if (current === 0) {
          this.currentOperand = 'Cannot divide by zero';
          this.previousOperand = '';
          this.operation = undefined;
          this.isError = true;
          this.shouldResetScreen = true;
          return;
        }
        computation = prev / current;
        break;
      default:
        return;
    }

    // Round to avoid floating point precision issues (e.g. 0.1 + 0.2 = 0.30000000000000004)
    computation = this.formatPrecision(computation);

    this.currentOperand = computation.toString();
    this.operation = undefined;
    this.previousOperand = '';
    this.shouldResetScreen = true;
  }

  /**
   * Rounds floating point errors nicely
   */
  formatPrecision(num) {
    // 12 significant digits maximum
    const factor = 1e12;
    return Math.round(num * factor) / factor;
  }

  /**
   * Formats numbers for display with commas
   */
  getDisplayNumber(numberStr) {
    if (this.isError) return numberStr;
    if (numberStr === '' || numberStr === null || numberStr === undefined) return '';

    const stringNumber = numberStr.toString();
    const isNegative = stringNumber.startsWith('-');
    const cleanNumber = isNegative ? stringNumber.slice(1) : stringNumber;

    const parts = cleanNumber.split('.');
    const integerDigits = parseFloat(parts[0]);
    const decimalDigits = parts[1];

    let integerDisplay;
    if (isNaN(integerDigits)) {
      integerDisplay = '';
    } else {
      integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }

    const prefix = isNegative ? '-' : '';

    if (decimalDigits != null) {
      return `${prefix}${integerDisplay}.${decimalDigits}`;
    } else {
      return `${prefix}${integerDisplay}`;
    }
  }

  /**
   * Updates display elements
   */
  updateDisplay() {
    if (this.isError) {
      if (this.currentOperandElement) {
        this.currentOperandElement.innerText = this.currentOperand;
        this.currentOperandElement.classList.add('error');
      }
      if (this.previousOperandElement) {
        this.previousOperandElement.innerText = '';
      }
      return;
    }

    if (this.currentOperandElement) {
      this.currentOperandElement.classList.remove('error');
      this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
    }

    if (this.previousOperandElement) {
      if (this.operation != null && this.previousOperand !== '') {
        this.previousOperandElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
      } else {
        this.previousOperandElement.innerText = '';
      }
    }
  }
}

// Attach event listeners when running in the browser
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    const previousOperandElement = document.getElementById('previousOperand');
    const currentOperandElement = document.getElementById('currentOperand');
    const calculator = new Calculator(previousOperandElement, currentOperandElement);

    // Number buttons
    document.querySelectorAll('[data-number]').forEach(button => {
      button.addEventListener('click', () => {
        calculator.appendNumber(button.getAttribute('data-number'));
        calculator.updateDisplay();
      });
    });

    // Operator buttons
    document.querySelectorAll('[data-operator]').forEach(button => {
      button.addEventListener('click', () => {
        calculator.chooseOperation(button.getAttribute('data-operator'));
        calculator.updateDisplay();
      });
    });

    // Decimal button
    const decimalButton = document.querySelector('[data-action="decimal"]');
    if (decimalButton) {
      decimalButton.addEventListener('click', () => {
        calculator.appendNumber('.');
        calculator.updateDisplay();
      });
    }

    // Equals button
    const equalsButton = document.querySelector('[data-action="equals"]');
    if (equalsButton) {
      equalsButton.addEventListener('click', () => {
        calculator.compute();
        calculator.updateDisplay();
      });
    }

    // Clear button
    const clearButton = document.querySelector('[data-action="clear"]');
    if (clearButton) {
      clearButton.addEventListener('click', () => {
        calculator.clear();
        calculator.updateDisplay();
      });
    }

    // Delete button
    const deleteButton = document.querySelector('[data-action="delete"]');
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        calculator.delete();
        calculator.updateDisplay();
      });
    }

    // Keyboard support
    window.addEventListener('keydown', (e) => {
      if ((e.key >= '0' && e.key <= '9')) {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
      } else if (e.key === '.') {
        calculator.appendNumber('.');
        calculator.updateDisplay();
      } else if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
      } else if (e.key === '*') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
      } else if (e.key === '/') {
        e.preventDefault(); // Prevent browser search trigger
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
      } else if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
      } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
        calculator.clear();
        calculator.updateDisplay();
      }
    });

    calculator.updateDisplay();
  });
}

// Export for Node.js unit testing environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Calculator;
}

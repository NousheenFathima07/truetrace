const assert = require('assert');
const Calculator = require('../script.js');

function createMockElements() {
  return {
    previousOperandElement: { innerText: '' },
    currentOperandElement: {
      innerText: '',
      classList: {
        classes: new Set(),
        add(c) { this.classes.add(c); },
        remove(c) { this.classes.delete(c); },
        contains(c) { return this.classes.has(c); }
      }
    }
  };
}

console.log('--- Running Calculator Unit Tests ---');

// Test 1: Initial state
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.updateDisplay();
  assert.strictEqual(calc.currentOperand, '0', 'Initial current operand should be 0');
  assert.strictEqual(mocks.currentOperandElement.innerText, '0', 'Initial display should show 0');
  console.log('✓ Test 1: Initial state passed');
}

// Test 2: Number input and chaining
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('1');
  calc.appendNumber('2');
  calc.appendNumber('3');
  assert.strictEqual(calc.currentOperand, '123', 'Should append digits 123');
  calc.updateDisplay();
  assert.strictEqual(mocks.currentOperandElement.innerText, '123');
  console.log('✓ Test 2: Number input passed');
}

// Test 3: Decimal handling (prevent multiple dots)
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('5');
  calc.appendNumber('.');
  calc.appendNumber('6');
  calc.appendNumber('.');
  calc.appendNumber('7');
  assert.strictEqual(calc.currentOperand, '5.67', 'Multiple decimals should be ignored');
  console.log('✓ Test 3: Decimal handling passed');
}

// Test 4: Addition
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('1');
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.appendNumber('2');
  calc.appendNumber('7');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '42', '15 + 27 should equal 42');
  console.log('✓ Test 4: Addition passed');
}

// Test 5: Subtraction
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('1');
  calc.appendNumber('0');
  calc.chooseOperation('-');
  calc.appendNumber('2');
  calc.appendNumber('5');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '-15', '10 - 25 should equal -15');
  console.log('✓ Test 5: Subtraction passed');
}

// Test 6: Multiplication
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('7');
  calc.chooseOperation('×');
  calc.appendNumber('8');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '56', '7 * 8 should equal 56');
  console.log('✓ Test 6: Multiplication passed');
}

// Test 7: Normal Division
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('4');
  calc.appendNumber('8');
  calc.chooseOperation('÷');
  calc.appendNumber('6');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '8', '48 / 6 should equal 8');
  console.log('✓ Test 7: Division passed');
}

// Test 8: Division by zero error
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('9');
  calc.chooseOperation('÷');
  calc.appendNumber('0');
  calc.compute();
  calc.updateDisplay();
  assert.strictEqual(calc.currentOperand, 'Cannot divide by zero', 'Should show error on divide by 0');
  assert.strictEqual(calc.isError, true, 'isError flag should be set');
  assert.strictEqual(mocks.currentOperandElement.classList.contains('error'), true, 'Error class should be applied');
  console.log('✓ Test 8: Division by zero handled correctly');
}

// Test 9: Deletion (Backspace)
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('9');
  calc.appendNumber('8');
  calc.appendNumber('7');
  calc.delete();
  assert.strictEqual(calc.currentOperand, '98', 'Delete should remove last digit');
  calc.delete();
  assert.strictEqual(calc.currentOperand, '9');
  calc.delete();
  assert.strictEqual(calc.currentOperand, '0', 'Deleting single digit should reset to 0');
  console.log('✓ Test 9: Deletion passed');
}

// Test 10: Clear
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.appendNumber('3');
  calc.clear();
  assert.strictEqual(calc.currentOperand, '0');
  assert.strictEqual(calc.previousOperand, '');
  assert.strictEqual(calc.operation, undefined);
  console.log('✓ Test 10: Clear passed');
}

// Test 11: Chained operations (e.g. 5 + 3 × 2)
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('5');
  calc.chooseOperation('+');
  calc.appendNumber('3');
  calc.chooseOperation('×'); // should evaluate 5 + 3 = 8
  assert.strictEqual(calc.currentOperand, '8');
  calc.appendNumber('2');
  calc.compute(); // 8 * 2 = 16
  assert.strictEqual(calc.currentOperand, '16');
  console.log('✓ Test 11: Operation chaining passed');
}

// Test 12: Floating point precision (0.1 + 0.2)
{
  const mocks = createMockElements();
  const calc = new Calculator(mocks.previousOperandElement, mocks.currentOperandElement);
  calc.appendNumber('0');
  calc.appendNumber('.');
  calc.appendNumber('1');
  calc.chooseOperation('+');
  calc.appendNumber('0');
  calc.appendNumber('.');
  calc.appendNumber('2');
  calc.compute();
  assert.strictEqual(calc.currentOperand, '0.3', 'Floating point rounding: 0.1 + 0.2 = 0.3');
  console.log('✓ Test 12: Floating point precision passed');
}

console.log('\nAll 12 unit tests passed successfully!\n');

import { useState } from 'react';
import { useStore } from '../store';

export default function Calculator() {
  const { isDarkMode } = useStore();
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [newNumber, setNewNumber] = useState(true);

  const handleNumber = (num: string) => {
    if (newNumber) {
      setDisplay(num);
      setNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return a / b;
      case '%': return a % b;
      default: return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const result = calculate(previousValue, parseFloat(display), operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setNewNumber(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setNewNumber(true);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
      setNewNumber(false);
    }
  };

  const buttons = [
    ['C', '±', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '='],
  ];

  return (
    <div className={`h-full flex flex-col ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} p-4`}>
      <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-black'} rounded-lg p-6 mb-4 text-right text-4xl font-light`}>
        {display}
      </div>
      
      <div className="flex-1 grid grid-rows-5 gap-2">
        {buttons.map((row, i) => (
          <div key={i} className="grid grid-cols-4 gap-2">
            {row.map(btn => {
              const isOperation = ['÷', '×', '-', '+', '='].includes(btn);
              const isSpecial = ['C', '±', '%'].includes(btn);
              const isZero = btn === '0';
              
              return (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') handleClear();
                    else if (btn === '=') handleEquals();
                    else if (btn === '.') handleDecimal();
                    else if (isOperation) handleOperation(btn);
                    else if (btn === '±') setDisplay(String(-parseFloat(display)));
                    else handleNumber(btn);
                  }}
                  className={`rounded-lg text-2xl font-light transition-all hover:scale-95 ${
                    isZero ? 'col-span-2' : ''
                  } ${
                    isOperation
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : isSpecial
                      ? isDarkMode
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-gray-300 text-black hover:bg-gray-400'
                      : isDarkMode
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-white text-black hover:bg-gray-200'
                  }`}
                >
                  {btn}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

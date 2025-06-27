import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import './index.css';

function App() {
  const [qp, setQp] = useState('');
  const [pps, setPps] = useState('');
  const [ts, setTs] = useState('');
  const [ff, setFf] = useState('0.5'); // default
  const [op, setOp] = useState('10');  // default
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const parseFloatOrZero = (value) => parseFloat(value) || 0;

  const calculateMinimumYards = () => {
    const qpVal = parseFloatOrZero(qp);
    const ppsVal = parseFloatOrZero(pps);
    const tsVal = parseFloatOrZero(ts);
    const ffVal = parseFloatOrZero(ff);
    if (ppsVal === 0) return 0;
    return ((qpVal / ppsVal) * (tsVal + ffVal)) / 36;
  };

  const calculateTotalYards = () => {
    const minYards = calculateMinimumYards();
    const opVal = parseFloatOrZero(op);
    return minYards + (minYards * (opVal / 100));
  };

  const minYards = calculateMinimumYards();
  const totalYards = calculateTotalYards();

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <div className="max-w-xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Yardage Calculator</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          <form className="space-y-4">
            <Input label="Quantity of Parts" value={qp} onChange={setQp} placeholder="e.g. 100" />
            <Input label="Parts Per Sheet" value={pps} onChange={setPps} placeholder="e.g. 25" />
            <Input label="Tool Size (inches)" value={ts} onChange={setTs} placeholder="e.g. 12" />
            <Input label="Fudge Factor (inches)" value={ff} onChange={setFf} placeholder="default: 0.5" />
            <Input label="Overage Percentage (%)" value={op} onChange={setOp} placeholder="default: 10" />
          </form>


          <div className="mt-8 space-y-4 text-2xl font-semibold tracking-tight">
            <p>
              <span className="block text-gray-700 dark:text-gray-300">Minimum Yards Required:</span>
              <span className="text-4xl text-blue-600 dark:text-blue-400">{minYards.toFixed(2)}</span>
            </p>
            <p>
              <span className="block text-gray-700 dark:text-gray-300">Total Yards (with overage):</span>
              <span className="text-4xl text-green-600 dark:text-green-400">{totalYards.toFixed(2)}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
      />
    </div>
  );
}


export default App;


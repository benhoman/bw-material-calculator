import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import './index.css';

function App() {
  const [qp, setQp] = useState('');
  const [pps, setPps] = useState('');
  const [ts, setTs] = useState('');
  const [tw, setTw] = useState('30'); // Tool Width for poundage - default 30
  const [ti, setTi] = useState(''); // Tool Index for poundage
  const [ff, setFf] = useState('0.5'); // default - will change based on active tab
  const [op, setOp] = useState('10');  // default
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('yardage');
  const [materialFactor, setMaterialFactor] = useState('0.0488'); // default material factor
  const [isCustomFactor, setIsCustomFactor] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false); // Toggle for advanced settings
  const [unitCost, setUnitCost] = useState(''); // Unit cost per yard/pound
  const [roundingIncrement, setRoundingIncrement] = useState(1); // Rounding increment for output

  // Preset material factors with names
  const materialFactors = [
    { name: 'PVC', value: '0.0488' },
    { name: 'RPET', value: '0.0488' },
    { name: 'Custom', value: 'custom' }
  ];

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Set appropriate default fudge factor when switching tabs
  useEffect(() => {
    if (activeTab === 'yardage' && (ff === '1.0' || ff === '')) {
      setFf('0.5'); // Default for yardage
    } else if (activeTab === 'material' && (ff === '0.5' || ff === '')) {
      setFf('1.0'); // Default for poundage
    }
  }, [activeTab, ff]);

  const parseFloatOrZero = (value) => parseFloat(value) || 0;

  const roundUpToIncrement = (value, increment) => {
    if (increment <= 0) return value;
    return Math.ceil(value / increment) * increment;
  };

  const calculateSheetsRequired = () => {
    const qpVal = parseFloatOrZero(qp); // Quantity of Parts
    const ppsVal = parseFloatOrZero(pps); // Parts Per Sheet
    if (ppsVal === 0) return 0;
    return qpVal / ppsVal; // Number of sheets required
  };

  const calculateMinimumYards = () => {
    const sheetsRequired = calculateSheetsRequired(); // Number of sheets required
    const tsVal = parseFloatOrZero(ts); // Tool Size
    const ffVal = parseFloatOrZero(ff); // Fudge Factor
    if (sheetsRequired === 0) return 0;
    return (sheetsRequired * (tsVal + ffVal)) / 36;
  };

  const calculateTotalYards = () => {
    const minYards = calculateMinimumYards(); // Minimum yards required
    const opVal = parseFloatOrZero(op); // Overage Percentage
    return minYards + (minYards * (opVal / 100));
  };

  const calculateMinimumPounds = () => {
    const sheetsRequired = calculateSheetsRequired(); // Number of sheets required
    const twVal = parseFloatOrZero(tw); // Tool Width
    const tiVal = parseFloatOrZero(ti); // Tool Index
    const ffVal = parseFloatOrZero(ff); // Fudge Factor
    const mfVal = parseFloatOrZero(materialFactor); // Material Factor
    if (sheetsRequired === 0) return 0;
    // Use Tool Width and Tool Index instead of Tool Size
    return (sheetsRequired * (twVal + tiVal + ffVal) / 36) * mfVal;
  };

  const calculateTotalPounds = () => {
    const minPounds = calculateMinimumPounds(); // Minimum pounds required
    const opVal = parseFloatOrZero(op); // Overage Percentage
    return minPounds + (minPounds * (opVal / 100));
  };

  const handleMaterialFactorChange = (value) => {
    if (value === 'custom') {
      setIsCustomFactor(true);
      setMaterialFactor('');
    } else {
      setIsCustomFactor(false);
      setMaterialFactor(value);
    }
  };

  const minYards = calculateMinimumYards();
  const totalYards = calculateTotalYards();
  const minPounds = calculateMinimumPounds();
  const totalPounds = calculateTotalPounds();

  // Apply rounding to display values
  const roundedMinYards = roundUpToIncrement(minYards, roundingIncrement);
  const roundedTotalYards = roundUpToIncrement(totalYards, roundingIncrement);
  const roundedMinPounds = roundUpToIncrement(minPounds, roundingIncrement);
  const roundedTotalPounds = roundUpToIncrement(totalPounds, roundingIncrement);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <div className="max-w-xl mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Material Calculator</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-1 rounded bg-gray-300 dark:bg-gray-700 text-sm"
            >
              {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex mb-6 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('yardage')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'yardage'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yardage
            </button>
            <button
              onClick={() => setActiveTab('material')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'material'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Poundage
            </button>
          </div>

          <form className="space-y-4">
            <Input label="Quantity of Parts" value={qp} onChange={setQp} placeholder="e.g. 100" />
            <Input label="Parts Per Sheet" value={pps} onChange={setPps} placeholder="e.g. 25" />
            
            {/* Conditional Tool inputs based on active tab */}
            {activeTab === 'yardage' ? (
              <Input label="Tool Size (inches)" value={ts} onChange={setTs} placeholder="e.g. 12" />
            ) : (
              <>
                <Input label="Tool Width (inches)" value={tw} onChange={setTw} placeholder="default: 30" />
                <Input label="Tool Index (inches)" value={ti} onChange={setTi} placeholder="e.g. 8" />
              </>
            )}
            
            {/* Material Factor - only show for material tab - moved above advanced settings */}
            {activeTab === 'material' && (
              <div>
                <label className="block mb-1 font-medium">Material Factor</label>
                <select
                  value={isCustomFactor ? 'custom' : materialFactor}
                  onChange={e => handleMaterialFactorChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                >
                  {materialFactors.map((factor) => (
                    <option key={factor.name} value={factor.value}>
                      {factor.name} {factor.value !== 'custom' && `(${factor.value})`}
                    </option>
                  ))}
                </select>
                {isCustomFactor && (
                  <input
                    type="number"
                    step="0.1"
                    value={materialFactor}
                    onChange={e => setMaterialFactor(e.target.value)}
                    placeholder="Enter custom factor"
                    className="w-full mt-2 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                  />
                )}
              </div>
            )}
            
            {/* Unit Cost - show for both tabs */}
            <Input 
              label={`Unit Cost ($ per ${activeTab === 'yardage' ? 'yd' : 'lb'})`} 
              value={unitCost} 
              onChange={setUnitCost} 
              placeholder="e.g. 2.50" 
            />
            
            {/* Material Allowances Toggle */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span className="mr-1">⚙️</span>
                Material Allowances
                <span className="ml-2 text-xs">
                  {showAdvanced ? '▼' : '▶'}
                </span>
              </button>
            </div>
            
            {/* Material Allowances - Collapsible */}
            {showAdvanced && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
                <Input label="Fudge Factor (inches)" value={ff} onChange={setFf} placeholder={activeTab === 'yardage' ? 'default: 0.5' : 'default: 1.0'} />
                <Input label="Overage Percentage (%)" value={op} onChange={setOp} placeholder="default: 10" />
              </div>
            )}
          </form>

          {/* Rounding Selector - Always Visible */}
          <div className="mt-6 mb-4">
            <label className="block mb-2 text-sm font-medium">Round Up To Next:</label>
            <div className="flex rounded-md shadow-sm">
              {[1, 100, 1000].map((increment, index) => (
                <button
                  key={increment}
                  onClick={() => setRoundingIncrement(increment)}
                  className={`px-4 py-2 text-sm font-medium transition-colors flex-1 ${
                    index === 0 ? 'rounded-l-md' : ''
                  } ${
                    index === 2 ? 'rounded-r-md' : ''
                  } ${
                    roundingIncrement === increment
                      ? 'bg-blue-600 dark:bg-blue-500 text-white z-10 relative'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  } ${
                    index !== 0 ? '-ml-px' : ''
                  }`}
                >
                  {increment === 1 ? 'Exact' : increment.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="mt-8 space-y-4 text-2xl font-semibold tracking-tight">
            {activeTab === 'yardage' ? (
              <>
                <p>
                  <span className="block text-gray-700 dark:text-gray-300">Minimum Required:</span>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl text-blue-600 dark:text-blue-400">{Math.round(roundedMinYards)} yds</span>
                    {unitCost && parseFloatOrZero(unitCost) > 0 && (
                      <span className="text-2xl text-blue-600 dark:text-blue-400">${(roundedMinYards * parseFloatOrZero(unitCost)).toFixed(2)}</span>
                    )}
                  </div>
                </p>
                <p>
                  <span className="block text-gray-700 dark:text-gray-300">Total (with overage):</span>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl text-green-600 dark:text-green-400">{Math.round(roundedTotalYards)} yds</span>
                    {unitCost && parseFloatOrZero(unitCost) > 0 && (
                      <span className="text-2xl text-green-600 dark:text-green-400">${(roundedTotalYards * parseFloatOrZero(unitCost)).toFixed(2)}</span>
                    )}
                  </div>
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="block text-gray-700 dark:text-gray-300">Minimum Required:</span>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl text-blue-600 dark:text-blue-400">{Math.round(roundedMinPounds)} lbs</span>
                    {unitCost && parseFloatOrZero(unitCost) > 0 && (
                      <span className="text-2xl text-blue-600 dark:text-blue-400">${(roundedMinPounds * parseFloatOrZero(unitCost)).toFixed(2)}</span>
                    )}
                  </div>
                </p>
                <p>
                  <span className="block text-gray-700 dark:text-gray-300">Total (with overage):</span>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl text-green-600 dark:text-green-400">{Math.round(roundedTotalPounds)} lbs</span>
                    {unitCost && parseFloatOrZero(unitCost) > 0 && (
                      <span className="text-2xl text-green-600 dark:text-green-400">${(roundedTotalPounds * parseFloatOrZero(unitCost)).toFixed(2)}</span>
                    )}
                  </div>
                </p>
              </>
            )}
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


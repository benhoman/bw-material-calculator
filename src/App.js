import React, { useState, useEffect } from 'react';
import { Logo } from './components/Logo';
import './index.css';

function App() {
  const [qp, setQp] = useState('');
  const [pps, setPps] = useState('');
  const [ts, setTs] = useState('');
  const [tw, setTw] = useState('31.5'); // Tool Width for poundage - default 30
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
  const [materialGauge, setMaterialGauge] = useState('0.020'); // Material gauge/thickness
  const [isCustomGauge, setIsCustomGauge] = useState(false); // Toggle for custom gauge

  // Preset material factors with names
  const materialFactors = [
    { name: 'PVC', value: '0.0488' },
    { name: 'RPET', value: '0.0488' },
    { name: 'HIPS', value: '0.07856' },
    { name: 'Custom', value: 'custom' }
  ];

  // Preset gauge values with names
  const gaugeOptions = [
    { name: '0.005"', value: '0.005' },
    { name: '0.007"', value: '0.007' },
    { name: '0.010"', value: '0.010' },
    { name: '0.015"', value: '0.015' },
    { name: '0.020"', value: '0.020' },
    { name: '0.022"', value: '0.022' },
    { name: '0.024"', value: '0.024' },
    { name: '0.025"', value: '0.025' },
    { name: '0.030"', value: '0.030' },
    { name: '0.040"', value: '0.040' },
    { name: '0.060"', value: '0.060' },
    { name: '0.080"', value: '0.080' },
    { name: '0.125"', value: '0.125' },
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

  const isFormValid = () => {
    // Check required fields based on active tab
    const hasQuantityAndParts = qp.trim() !== '' && pps.trim() !== '';
    
    if (activeTab === 'yardage') {
      return hasQuantityAndParts && ts.trim() !== '';
    } else {
      return hasQuantityAndParts && tw.trim() !== '' && ti.trim() !== '';
    }
  };

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
    const mgVal = parseFloatOrZero(materialGauge); // Material Gauge
    if (sheetsRequired === 0) return 0;
    // Use Tool Width and Tool Index instead of Tool Size, include Material Gauge
    return mgVal * twVal * (tiVal + ffVal) * mfVal * sheetsRequired;
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

  const handleGaugeChange = (value) => {
    if (value === 'custom') {
      setIsCustomGauge(true);
      setMaterialGauge('');
    } else {
      setIsCustomGauge(false);
      setMaterialGauge(value);
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
        <div className="max-w-md mx-auto p-4">
          {/* Compact Header */}
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Material Calculator</h1>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-2 py-1 rounded bg-gray-300 dark:bg-gray-700 text-xs"
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>

          {/* Tab Navigation - More Compact */}
          <div className="flex mb-4 bg-gray-200 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('yardage')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'yardage'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yardage
            </button>
            <button
              onClick={() => setActiveTab('material')}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'material'
                  ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Poundage
            </button>
          </div>

          <form className="space-y-3">
            {/* Main inputs in a more compact grid */}
            <div className="grid grid-cols-2 gap-3">
              <CompactInput label="Quantity of Parts" value={qp} onChange={setQp} placeholder="e.g. 100" required />
              <CompactInput label="Parts Per Sheet" value={pps} onChange={setPps} placeholder="e.g. 25" required />
            </div>
            
            {/* Tool inputs */}
            {activeTab === 'yardage' ? (
              <CompactInput label="Tool Size (inches)" value={ts} onChange={setTs} placeholder="e.g. 12" required />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <CompactInput label="Tool Width (inches)" value={tw} onChange={setTw} placeholder="default: 31.5" required />
                <CompactInput label="Tool Index (inches)" value={ti} onChange={setTi} placeholder="e.g. 8" required />
              </div>
            )}
            
            {/* Material Properties - only show for material tab */}
            {activeTab === 'material' && (
              <div>
                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Material Properties</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1 text-sm font-medium">Factor</label>
                    <select
                      value={isCustomFactor ? 'custom' : materialFactor}
                      onChange={e => handleMaterialFactorChange(e.target.value)}
                      className="w-full px-2 py-2 text-base border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
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
                        className="w-full mt-1 px-2 py-2 text-base border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-1 text-sm font-medium">Gauge (inches)</label>
                    <select
                      value={isCustomGauge ? 'custom' : materialGauge}
                      onChange={e => handleGaugeChange(e.target.value)}
                      className="w-full px-2 py-2 text-base border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                    >
                      {gaugeOptions.map((gauge) => (
                        <option key={gauge.name} value={gauge.value}>
                          {gauge.name}
                        </option>
                      ))}
                    </select>
                    {isCustomGauge && (
                      <input
                        type="number"
                        step="0.001"
                        value={materialGauge}
                        onChange={e => setMaterialGauge(e.target.value)}
                        placeholder="Enter custom gauge"
                        className="w-full mt-1 px-2 py-2 text-base border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600"
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Unit Cost */}
            <CompactInput 
              label={`Unit Cost ($ per ${activeTab === 'yardage' ? 'yd' : 'lb'})`} 
              value={unitCost} 
              onChange={setUnitCost} 
              placeholder="e.g. 2.50" 
            />
            
            {/* Material Allowances Toggle - More Compact */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <span className="mr-1">⚙️</span>
                Material Allowances
                <span className="ml-1 text-xs">
                  {showAdvanced ? '▼' : '▶'}
                </span>
              </button>
            </div>
            
            {/* Material Allowances - Collapsible */}
            {showAdvanced && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <CompactInput label="Fudge Factor (inches)" value={ff} onChange={setFf} placeholder={activeTab === 'yardage' ? 'default: 0.5' : 'default: 1.0'} />
                  <CompactInput label="Overage Percentage (%)" value={op} onChange={setOp} placeholder="default: 10" />
                </div>
              </div>
            )}
          </form>

          {/* Rounding Selector - More Compact */}
          {isFormValid() && (
            <div className="mt-4 mb-3">
              <label className="block mb-1 text-xs font-medium">Round Up To Next:</label>
              <div className="flex rounded-md shadow-sm">
                {[1, 100, 1000].map((increment, index) => (
                  <button
                    key={increment}
                    onClick={() => setRoundingIncrement(increment)}
                    className={`px-3 py-1.5 text-xs font-medium transition-colors flex-1 ${
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
              {/* Rounding Preview */}
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 flex">
                {activeTab === 'yardage' ? (
                  <>
                    <div className="flex-1 text-center">
                      {Math.round(totalYards).toLocaleString()} yds
                    </div>
                    <div className="flex-1 text-center">
                      {roundUpToIncrement(totalYards, 100).toLocaleString()} yds
                    </div>
                    <div className="flex-1 text-center">
                      {roundUpToIncrement(totalYards, 1000).toLocaleString()} yds
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex-1 text-center">
                      {Math.round(totalPounds).toLocaleString()} lbs
                    </div>
                    <div className="flex-1 text-center">
                      {roundUpToIncrement(totalPounds, 100).toLocaleString()} lbs
                    </div>
                    <div className="flex-1 text-center">
                      {roundUpToIncrement(totalPounds, 1000).toLocaleString()} lbs
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Results - More Compact */}
          {isFormValid() ? (
            <div className="mt-4 space-y-3 text-lg font-semibold tracking-tight">
              {activeTab === 'yardage' ? (
                <>
                  <div>
                    <span className="block text-gray-700 dark:text-gray-300 text-sm">Minimum Required:</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-blue-600 dark:text-blue-400">{Math.round(roundedMinYards).toLocaleString()} yds</span>
                      {unitCost && parseFloatOrZero(unitCost) > 0 && (
                        <span className="text-lg text-blue-600 dark:text-blue-400">${(roundedMinYards * parseFloatOrZero(unitCost)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="block text-gray-700 dark:text-gray-300 text-sm">Total (with overage):</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-green-600 dark:text-green-400">{Math.round(roundedTotalYards).toLocaleString()} yds</span>
                      {unitCost && parseFloatOrZero(unitCost) > 0 && (
                        <span className="text-lg text-green-600 dark:text-green-400">${(roundedTotalYards * parseFloatOrZero(unitCost)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <span className="block text-gray-700 dark:text-gray-300 text-sm">Minimum Required:</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-blue-600 dark:text-blue-400">{Math.round(roundedMinPounds).toLocaleString()} lbs</span>
                      {unitCost && parseFloatOrZero(unitCost) > 0 && (
                        <span className="text-lg text-blue-600 dark:text-blue-400">${(roundedMinPounds * parseFloatOrZero(unitCost)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                  <div>
                    <span className="block text-gray-700 dark:text-gray-300 text-sm">Total (with overage):</span>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl text-green-600 dark:text-green-400">{Math.round(roundedTotalPounds).toLocaleString()} lbs</span>
                      {unitCost && parseFloatOrZero(unitCost) > 0 && (
                        <span className="text-lg text-green-600 dark:text-green-400">${(roundedTotalPounds * parseFloatOrZero(unitCost)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Please fill in all required fields to see results
              </span>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                {activeTab === 'yardage' 
                  ? 'Required: Quantity of Parts, Parts Per Sheet, Tool Size'
                  : 'Required: Quantity of Parts, Parts Per Sheet, Tool Width, Tool Index'
                }
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

function CompactInput({ label, value, onChange, placeholder, required = false }) {
  return (
    <div>
      <label className="block mb-1 text-sm font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-2 py-2 text-base border rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-600 ${
          required && !value.trim() 
            ? 'border-red-100 dark:border-red-900' 
            : 'border-gray-300 dark:border-gray-700'
        }`}
      />
    </div>
  );
}

export default App;


import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const PricingToolDemo = () => {
  const [annualUsage, setAnnualUsage] = useState(1580);
  const [currentRate, setCurrentRate] = useState(0.619);
  const [newRate, setNewRate] = useState(0.549);
  const [currentFee, setCurrentFee] = useState(6.75);
  const [newFee, setNewFee] = useState(5.95);
  const [incentive, setIncentive] = useState(100);
  const [exitFee, setExitFee] = useState(150);

  // Calculate monthly usage based on typical seasonal patterns
  const monthlyPercentages = [
    { month: 'Jan', percentage: 0.15 },
    { month: 'Feb', percentage: 0.14 },
    { month: 'Mar', percentage: 0.12 },
    { month: 'Apr', percentage: 0.08 },
    { month: 'May', percentage: 0.05 },
    { month: 'Jun', percentage: 0.04 },
    { month: 'Jul', percentage: 0.03 },
    { month: 'Aug', percentage: 0.03 },
    { month: 'Sep', percentage: 0.04 },
    { month: 'Oct', percentage: 0.07 },
    { month: 'Nov', percentage: 0.11 },
    { month: 'Dec', percentage: 0.14 }
  ];

  // Calculate monthly usage and costs
  const monthlyData = monthlyPercentages.map(item => {
    const therms = annualUsage * item.percentage;
    const currentCost = (therms * currentRate) + currentFee;
    const newCost = (therms * newRate) + newFee;
    const savings = currentCost - newCost;
    
    return {
      ...item,
      therms: Math.round(therms),
      currentCost: Math.round(currentCost * 100) / 100,
      newCost: Math.round(newCost * 100) / 100,
      savings: Math.round(savings * 100) / 100
    };
  });

  // Calculate annual totals
  const annualCurrentCost = (annualUsage * currentRate) + (currentFee * 12);
  const annualNewCost = (annualUsage * newRate) + (newFee * 12);
  const annualSavings = annualCurrentCost - annualNewCost;
  const netFirstYearSavings = annualSavings + incentive - exitFee;
  const breakEvenMonths = exitFee > 0 ? Math.ceil(exitFee / (annualSavings / 12)) : 0;

  // Sensitivity analysis data
  const sensitivityData = [
    { level: '-20%', usage: Math.round(annualUsage * 0.8), currentCost: Math.round((annualUsage * 0.8 * currentRate + currentFee * 12) * 100) / 100, newCost: Math.round((annualUsage * 0.8 * newRate + newFee * 12) * 100) / 100 },
    { level: '-10%', usage: Math.round(annualUsage * 0.9), currentCost: Math.round((annualUsage * 0.9 * currentRate + currentFee * 12) * 100) / 100, newCost: Math.round((annualUsage * 0.9 * newRate + newFee * 12) * 100) / 100 },
    { level: 'Baseline', usage: annualUsage, currentCost: Math.round(annualCurrentCost * 100) / 100, newCost: Math.round(annualNewCost * 100) / 100 },
    { level: '+10%', usage: Math.round(annualUsage * 1.1), currentCost: Math.round((annualUsage * 1.1 * currentRate + currentFee * 12) * 100) / 100, newCost: Math.round((annualUsage * 1.1 * newRate + newFee * 12) * 100) / 100 },
    { level: '+20%', usage: Math.round(annualUsage * 1.2), currentCost: Math.round((annualUsage * 1.2 * currentRate + currentFee * 12) * 100) / 100, newCost: Math.round((annualUsage * 1.2 * newRate + newFee * 12) * 100) / 100 }
  ];

  // Add savings to sensitivity data
  sensitivityData.forEach(item => {
    item.savings = Math.round((item.currentCost - item.newCost) * 100) / 100;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gray-50">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-blue-800">Pricing Comparison Tool 3.0</h1>
        <p className="text-gray-600">Interactive Demo of Improved Features</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Usage Data</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Annual Usage (Therms)</label>
            <input
              type="number"
              value={annualUsage}
              onChange={(e) => setAnnualUsage(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mt-3 pt-3 border-t">
            <h3 className="text-md font-medium mb-2">Monthly Usage Pattern</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="therms" fill="#3b82f6" name="Therms" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Current Provider</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Provider Name</label>
            <input
              type="text"
              value="SCANA Energy"
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Rate ($ per therm)</label>
            <input
              type="number"
              value={currentRate}
              onChange={(e) => setCurrentRate(Number(e.target.value))}
              step="0.001"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Monthly Fee</label>
            <input
              type="number"
              value={currentFee}
              onChange={(e) => setCurrentFee(Number(e.target.value))}
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Exit Fee</label>
            <input
              type="number"
              value={exitFee}
              onChange={(e) => setExitFee(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">New Provider</h2>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Provider Name</label>
            <input
              type="text"
              placeholder="Enter provider name"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Rate ($ per therm)</label>
            <input
              type="number"
              value={newRate}
              onChange={(e) => setNewRate(Number(e.target.value))}
              step="0.001"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Monthly Fee</label>
            <input
              type="number"
              value={newFee}
              onChange={(e) => setNewFee(Number(e.target.value))}
              step="0.01"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700">Sign-up Incentive</label>
            <input
              type="number"
              value={incentive}
              onChange={(e) => setIncentive(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Monthly Cost Comparison</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="currentCost" stroke="#ef4444" name="Current Provider" strokeWidth={2} />
                <Line type="monotone" dataKey="newCost" stroke="#22c55e" name="New Provider" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Monthly Savings</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Bar dataKey="savings" fill="#22c55e" name="Monthly Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Summary Results</h2>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">Annual Costs</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-red-50 rounded">
                <div className="text-sm text-gray-600">Current Provider</div>
                <div className="text-xl font-bold text-red-600">${annualCurrentCost.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm text-gray-600">New Provider</div>
                <div className="text-xl font-bold text-green-600">${annualNewCost.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-blue-50 rounded">
                <div className="text-sm text-gray-600">Annual Savings</div>
                <div className="text-xl font-bold text-blue-600">${annualSavings.toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-medium text-gray-700 mb-2">One-time Costs & Benefits</h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-yellow-50 rounded">
                <div className="text-sm text-gray-600">Exit Fee</div>
                <div className="text-xl font-bold text-yellow-600">-${exitFee.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <div className="text-sm text-gray-600">Incentive</div>
                <div className="text-xl font-bold text-green-600">${incentive.toFixed(2)}</div>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <div className="text-sm text-gray-600">Net Impact</div>
                <div className="text-xl font-bold text-purple-600">${(incentive - exitFee).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-blue-100 rounded">
                <div className="text-sm text-gray-700">First Year Net Savings</div>
                <div className="text-2xl font-bold text-blue-800">${netFirstYearSavings.toFixed(2)}</div>
              </div>
              <div className="p-4 bg-blue-100 rounded">
                <div className="text-sm text-gray-700">Break-even Period</div>
                <div className="text-2xl font-bold text-blue-800">
                  {breakEvenMonths > 0 ? `${breakEvenMonths} months` : 'Immediate'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-3 text-blue-700">Sensitivity Analysis</h2>
          <p className="text-sm text-gray-600 mb-3">How your savings change with different usage levels</p>
          
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensitivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="level" />
                <YAxis />
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
                <Line type="monotone" dataKey="currentCost" stroke="#ef4444" name="Current Provider" strokeWidth={2} />
                <Line type="monotone" dataKey="newCost" stroke="#22c55e" name="New Provider" strokeWidth={2} />
                <Line type="monotone" dataKey="savings" stroke="#3b82f6" name="Savings" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="border-t pt-3">
            <h3 className="font-medium text-gray-700 mb-2">Key Insights</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Your savings {annualSavings > 0 ? 'increase' : 'decrease'} as your usage increases</li>
              <li>• At current rates, you save ${(annualSavings/annualUsage).toFixed(3)} per therm</li>
              <li>• Even with 20% less usage, you would still save ${sensitivityData[0].savings.toFixed(2)} annually</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingToolDemo;

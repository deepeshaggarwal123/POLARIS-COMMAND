import { useState, useEffect } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then(res => res.json())
      .then(data => setStatus(data.status))
      .catch(() => setStatus('Offline Mode'));
  }, []);

  return (
    <div className="min-h-screen bg-polarBlue-50">
      <header className="bg-polarBlue-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-2xl font-bold">PolarOps Dashboard</h1>
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${status === 'offline-ready' ? 'bg-polarGreen-500' : 'bg-orange-500'}`}>
          {status === 'offline-ready' ? 'API Connected' : status}
        </span>
      </header>

      <main className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-polarBlue-500">
            <h2 className="text-lg font-semibold text-polarBlue-900">Active Missions</h2>
            <p className="text-3xl font-bold text-polarBlue-700 mt-2">5</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-polarGreen-500">
            <h2 className="text-lg font-semibold text-polarGreen-900">Missions Ready</h2>
            <p className="text-3xl font-bold text-polarGreen-700 mt-2">4</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border-t-4 border-red-500">
            <h2 className="text-lg font-semibold text-red-900">Blocked Missions</h2>
            <p className="text-3xl font-bold text-red-700 mt-2">1</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold text-polarBlue-900 mb-4">Mission Dependency Graph (Mock)</h2>
          <div className="h-64 bg-polarBlue-50 flex items-center justify-center border border-polarBlue-100 rounded">
            <p className="text-polarBlue-500 italic">Graph Visualization will be rendered here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

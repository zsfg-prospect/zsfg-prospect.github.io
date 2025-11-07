import { useRouter } from 'next/router';
import React from 'react';

const mockPatients = [
  { id: 1, name: 'Patient 1' },
  { id: 2, name: 'Patient 2' },
  { id: 3, name: 'Patient 3' },
  { id: 4, name: 'Patient 4' },
];

const Sidebar: React.FC = () => {
  const router = useRouter();

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-blue-600 to-blue-700 shadow-lg">
      <button 
        onClick={() => router.push('/')}
        className="w-full p-4 border-b border-blue-500 text-left hover:bg-blue-500/20 transition-colors"
      >
        <h2 className="text-xl font-semibold text-white">Patient Records</h2>
      </button>
      <nav className="p-4">
        <ul className="space-y-2">
          {mockPatients.map((patient) => (
            <li key={patient.id}>
              <button
                onClick={() => router.push(`/patient/${patient.id}`)}
                className="w-full text-left px-4 py-3 rounded bg-white/10 hover:bg-white/20 transition-all transform hover:scale-[1.02]"
              >
                <div className="font-medium text-white">{patient.name}</div>
                <div className="text-sm text-blue-100">ID: {patient.id}</div>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 

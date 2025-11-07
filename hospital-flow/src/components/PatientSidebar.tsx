import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

interface PatientSidebarProps {
  currentPatientId?: string;
}

interface PatientData {
  pat_id_surrogate: number;
  enc_date: string;
}

export default function PatientSidebar({ currentPatientId }: PatientSidebarProps) {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      setIsLoading(true);
      try {
        // Load data from static JSON file
        const response = await fetch('/patient_discharge.json');
        if (!response.ok) {
          throw new Error('Failed to load static data');
        }
        const data = await response.json();
        
        // Extract patient data from array format
        const patientDataArray: PatientData[] = data.map((patient: any) => ({
          pat_id_surrogate: patient.pat_id_surrogate,
          enc_date: patient.enc_date
        }));
        
        setPatients(patientDataArray);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading patient data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handlePatientSelect = (patient: PatientData) => {
    // Format the enc_date to the expected timestamp format (YYYY-MM-DD-HH:MM:SS)
    // Use UTC methods to avoid timezone conversion issues
    const encDate = new Date(patient.enc_date);
    const timestamp = `${encDate.getUTCFullYear()}-${String(encDate.getUTCMonth() + 1).padStart(2, '0')}-${String(encDate.getUTCDate()).padStart(2, '0')}-${String(encDate.getUTCHours()).padStart(2, '0')}:${String(encDate.getUTCMinutes()).padStart(2, '0')}:${String(encDate.getUTCSeconds()).padStart(2, '0')}`;
    
    const encodedTimestamp = encodeURIComponent(timestamp);
    router.push(`/patient/${patient.pat_id_surrogate}?timestamp=${encodedTimestamp}`);
  };

  if (error) {
    return (
      <div className="w-64 bg-red-50 border-r border-red-200 p-4">
        <div className="text-red-800">
          <h3 className="text-sm font-medium mb-2">Error loading patients</h3>
          <p className="text-xs">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-screen">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Patients</h2>
        <p className="text-sm text-gray-600">
          {isLoading ? 'Loading...' : `${patients.length} patients available`}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4">
            <div className="animate-pulse space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-2">
            {patients.map((patient) => (
              <button
                key={`${patient.pat_id_surrogate}-${patient.enc_date}`}
                onClick={() => handlePatientSelect(patient)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-100 transition-colors duration-150 border-l-4 ${
                  currentPatientId === patient.pat_id_surrogate.toString()
                    ? 'bg-blue-50 border-blue-500 text-blue-900 font-medium'
                    : 'border-transparent text-gray-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>Patient {patient.pat_id_surrogate}</span>
                  {currentPatientId === patient.pat_id_surrogate.toString() && (
                    <svg className="h-4 w-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
            {patients.length === 0 && !isLoading && (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-gray-500">No patients available</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
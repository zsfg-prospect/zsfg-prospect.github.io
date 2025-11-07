import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import TabNavigation from '../components/TabNavigation';

interface HospitalFlowData {
  imaging_prioritization: {
    rubric: Record<string, any>;
    patients: Array<{
      patient_id: number;
      priority_score: number;
      max_score: number;
      rules_applied: Record<string, number>;
      llm_reasoning: string;
    }>;
  };
  consult_prioritization: {
    rubric: Record<string, any>;
    patients: Array<{
      patient_id: number;
      priority_score: number;
      max_score: number;
      rules_applied: Record<string, number>;
      llm_reasoning: string;
    }>;
  };
  discharge_referral_prioritization?: {
    rubric: Record<string, any>;
    patients: Array<{
      patient_id: number;
      priority_score: number;
      max_score: number;
      rules_applied: Record<string, number>;
      llm_reasoning: string;
    }>;
  };
}

export default function HospitalDischarge() {
  const [hospitalData, setHospitalData] = useState<HospitalFlowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        const response = await fetch('/hospital_flow.json');
        if (!response.ok) {
          throw new Error('Failed to load hospital flow data');
        }
        const data = await response.json();
        setHospitalData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred loading hospital data');
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, []);

  const getPriorityColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return { bg: 'bg-red-100', text: 'text-red-800', label: 'High Priority' };
    if (percentage >= 60) return { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Medium Priority' };
    return { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Low Priority' };
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Hospital Flow | Social Services Note Viewer</title>
          <meta name="description" content="Hospital flow analysis" />
        </Head>
        <div className="flex flex-col h-screen">
          <TabNavigation />
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-4">
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading hospital discharge data...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Hospital Flow | Social Services Note Viewer</title>
          <meta name="description" content="Hospital flow analysis" />
        </Head>
        <div className="flex flex-col h-screen">
          <TabNavigation />
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="max-w-7xl mx-auto p-4">
              <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <Head>
        <title>Hospital Flow | Social Services Note Viewer</title>
        <meta name="description" content="Hospital flow analysis" />
      </Head>
      <div className="flex flex-col h-screen">
        <TabNavigation />
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-7xl mx-auto p-4 flex gap-6">
            {/* Left Navigation */}
            <div className="w-80 flex-shrink-0">
              <nav className="sticky top-4 bg-white rounded-lg shadow-md p-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      const element = document.getElementById('imaging-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      Imaging Prioritization
                    </div>
                    {hospitalData?.imaging_prioritization && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {hospitalData.imaging_prioritization.patients.length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      const element = document.getElementById('consults-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Consult Prioritization
                    </div>
                    {hospitalData?.consult_prioritization && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {hospitalData.consult_prioritization.patients.length}
                      </span>
                    )}
                  </button>
                  
                  <button
                    onClick={() => {
                      const element = document.getElementById('discharge-referrals-section');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="flex items-center justify-between w-full px-4 py-2 border border-purple-300 rounded-md text-sm font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                  >
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Discharge Prioritization
                    </div>
                    {hospitalData?.discharge_referral_prioritization && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {hospitalData.discharge_referral_prioritization.patients.length}
                      </span>
                    )}
                  </button>
                </div>
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Hospital Flow</h1>
              </div>

              <div className="space-y-8">
              {/* Patients to prioritize for imaging */}
              {hospitalData?.imaging_prioritization && (
                <div id="imaging-section" className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Imaging Prioritization</h2>
                  </div>
                  <div className="p-6">
                    {/* Patient Priority List */}
                    <div className="space-y-4">
                      {hospitalData.imaging_prioritization.patients.map((patient) => {
                        const priority = getPriorityColor(patient.priority_score, patient.max_score);
                        return (
                          <div key={patient.patient_id} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <Link 
                                    href={`/patient/${patient.patient_id}?timestamps=03-20-2024+00%3A00`}
                                    className="text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                  >
                                    Patient {patient.patient_id}
                                  </Link>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-500">Priority Score:</span>
                                    <div className="relative group">
                                      <span className={`${priority.bg} ${priority.text} px-2 py-1 rounded-full text-sm font-bold cursor-help`}>
                                        {patient.priority_score}/{patient.max_score}
                                      </span>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-10">
                                        <div className="font-semibold mb-1">Imaging Priority Score Calculation:</div>
                                        <div className="space-y-1">
                                          {Object.entries(patient.rules_applied).map(([rule, points]) => {
                                            const ruleDesc = hospitalData.imaging_prioritization?.rubric[rule]?.description || rule.replace(/_/g, ' ');
                                            return (
                                              <div key={rule}>• {ruleDesc}: +{points} points</div>
                                            );
                                          })}
                                          <div className="border-t border-gray-600 pt-1 mt-1">
                                            <strong>Total: {patient.priority_score}/{patient.max_score} ({priority.label})</strong>
                                          </div>
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-gray-700">LLM Reasoning:</span>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {patient.llm_reasoning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Patients to prioritize for Consults */}
              {hospitalData?.consult_prioritization && (
                <div id="consults-section" className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Consult Prioritization</h2>
                  </div>
                  <div className="p-6">
                    {/* Patient Priority List */}
                    <div className="space-y-4">
                      {hospitalData.consult_prioritization.patients.map((patient) => {
                        const priority = getPriorityColor(patient.priority_score, patient.max_score);
                        return (
                          <div key={patient.patient_id} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <Link 
                                    href={`/patient/${patient.patient_id}?timestamps=03-20-2024+00%3A00`}
                                    className="text-lg font-semibold text-green-600 hover:text-green-800 transition-colors duration-200"
                                  >
                                    Patient {patient.patient_id}
                                  </Link>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-500">Priority Score:</span>
                                    <div className="relative group">
                                      <span className={`${priority.bg} ${priority.text} px-2 py-1 rounded-full text-sm font-bold cursor-help`}>
                                        {patient.priority_score}/{patient.max_score}
                                      </span>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-10">
                                        <div className="font-semibold mb-1">Consult Priority Score Calculation:</div>
                                        <div className="space-y-1">
                                          {Object.entries(patient.rules_applied).map(([rule, points]) => {
                                            const ruleDesc = hospitalData.consult_prioritization?.rubric[rule]?.description || rule.replace(/_/g, ' ');
                                            return (
                                              <div key={rule}>• {ruleDesc}: +{points} points</div>
                                            );
                                          })}
                                          <div className="border-t border-gray-600 pt-1 mt-1">
                                            <strong>Total: {patient.priority_score}/{patient.max_score} ({priority.label})</strong>
                                          </div>
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-gray-700">LLM Reasoning:</span>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {patient.llm_reasoning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Patients to prioritize for Discharge Referrals */}
              {hospitalData?.discharge_referral_prioritization && (
                <div id="discharge-referrals-section" className="bg-white rounded-lg shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Discharge Prioritization</h2>
                  </div>
                  <div className="p-6">
                    {/* Patient Priority List */}
                    <div className="space-y-4">
                      {hospitalData.discharge_referral_prioritization.patients.map((patient) => {
                        const priority = getPriorityColor(patient.priority_score, patient.max_score);
                        return (
                          <div key={patient.patient_id} className="border border-gray-200 rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors duration-200">
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-4">
                                  <Link 
                                    href={`/patient/${patient.patient_id}?timestamps=03-20-2024+00%3A00`}
                                    className="text-lg font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-200"
                                  >
                                    Patient {patient.patient_id}
                                  </Link>
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-500">Priority Score:</span>
                                    <div className="relative group">
                                      <span className={`${priority.bg} ${priority.text} px-2 py-1 rounded-full text-sm font-bold cursor-help`}>
                                        {patient.priority_score}/{patient.max_score}
                                      </span>
                                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none w-64 z-10">
                                        <div className="font-semibold mb-1">Discharge Referral Priority Score:</div>
                                        <div className="space-y-1">
                                          {Object.entries(patient.rules_applied).map(([rule, points]) => {
                                            const ruleDesc = hospitalData.discharge_referral_prioritization?.rubric[rule]?.description || rule.replace(/_/g, ' ');
                                            return (
                                              <div key={rule}>• {ruleDesc}: +{points} points</div>
                                            );
                                          })}
                                          <div className="border-t border-gray-600 pt-1 mt-1">
                                            <strong>Total: {patient.priority_score}/{patient.max_score} ({priority.label})</strong>
                                          </div>
                                        </div>
                                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-2">
                                  <span className="text-sm font-medium text-gray-700">LLM Reasoning:</span>
                                  <p className="text-sm text-gray-600 mt-1">
                                    {patient.llm_reasoning}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
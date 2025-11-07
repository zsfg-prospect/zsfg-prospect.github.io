import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../../../components/Layout';
import LoadingScreen from '../../../components/LoadingScreen';
import { FormData, FormFieldValue, Note } from '../../../types/api';
import { CitationBlock } from '../../../components/CitationBlock';

export default function FormViewer() {
  const router = useRouter();
  const { id, timestamp } = router.query;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedField, setSelectedField] = useState<FormFieldValue | null>(null);

  useEffect(() => {
    if (!id || !timestamp) return;

    const fetchFormData = async () => {
      setLoading(true);
      try {
        // Fetch form data with filled fields
        const formResponse = await fetch(`/api/forms/data/${id}?timestamp=${timestamp}`);
        if (!formResponse.ok) {
          throw new Error('Failed to fetch form data');
        }
        const form = await formResponse.json();
        setFormData(form);

        // Fetch notes for citations
        const notesResponse = await fetch(`http://127.0.0.1:5000/patients/${id}/summary?timestamp=${timestamp}`);
        if (!notesResponse.ok) {
          throw new Error('Failed to fetch notes');
        }
        const notesData = await notesResponse.json();
        setNotes(notesData.notes);

      } catch (error) {
        console.error('Error fetching form data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, [id, timestamp]);

  const handleFieldClick = (field: FormFieldValue) => {
    setSelectedField(field);
  };

  const handleNoteClick = (noteId: number, sectionId?: string, quote?: string) => {
    // Scroll to note or highlight functionality can be added here
    console.log('Note clicked:', noteId, quote);
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading Form Viewer... | Social Services Note Viewer</title>
        </Head>
        <LoadingScreen />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>Error | Social Services Note Viewer</title>
        </Head>
        <Layout showSidebar={false}>
          <div className="max-w-7xl mx-auto p-4">
            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>{error}</p>
              <button 
                onClick={() => router.back()}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-500"
              >
                Go Back
              </button>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  if (!formData) {
    return (
      <>
        <Head>
          <title>Form Not Found | Social Services Note Viewer</title>
        </Head>
        <Layout showSidebar={false}>
          <div className="max-w-7xl mx-auto p-4">
            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
              <p>Form data not found</p>
            </div>
          </div>
        </Layout>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Form Viewer - Patient {id} | Social Services Note Viewer</title>
        <meta name="description" content="View prefilled form with citations" />
      </Head>
      <Layout showSidebar={false}>
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {formData.name} - Patient {id}
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L4.414 9H17a1 1 0 110 2H4.414l5.293 5.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Back to Patient Summary
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Fields Panel */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="bg-green-50 border-b border-green-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-green-800">Prefilled Form Fields</h2>
                <p className="text-sm text-green-600">Click on fields to see supporting citations</p>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="space-y-4">
                  {formData.filled_fields?.map((field) => (
                    <div 
                      key={field.field_id}
                      onClick={() => handleFieldClick(field)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedField?.field_id === field.field_id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 mb-1">
                            {formData.fields.find(f => f.field_id === field.field_id)?.name || field.field_id}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {formData.fields.find(f => f.field_id === field.field_id)?.question}
                          </p>
                          <div className="bg-gray-100 p-2 rounded text-sm">
                            <strong>Value:</strong> {field.value || 'No value provided'}
                          </div>
                        </div>
                        {field.citation && (
                          <div className="ml-4 flex-shrink-0">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Citation Available
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Citations Panel */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="bg-blue-50 border-b border-blue-200 px-6 py-4">
                <h2 className="text-lg font-semibold text-blue-800">Supporting Evidence</h2>
                <p className="text-sm text-blue-600">
                  {selectedField 
                    ? `Citation for: ${formData.fields.find(f => f.field_id === selectedField.field_id)?.name || selectedField.field_id}`
                    : 'Select a field to view its supporting citation'
                  }
                </p>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {selectedField?.citation ? (
                  <div className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h3 className="font-medium text-yellow-800 mb-2">Field Information</h3>
                      <p className="text-sm text-yellow-700 mb-2">
                        <strong>Field:</strong> {formData.fields.find(f => f.field_id === selectedField.field_id)?.name}
                      </p>
                      <p className="text-sm text-yellow-700 mb-2">
                        <strong>Question:</strong> {formData.fields.find(f => f.field_id === selectedField.field_id)?.question}
                      </p>
                      <p className="text-sm text-yellow-700">
                        <strong>Answer:</strong> {selectedField.value}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Supporting Citation</h3>
                      <CitationBlock
                        citation={selectedField.citation}
                        sectionId={`form-field-${selectedField.field_id}`}
                        onNoteClick={handleNoteClick}
                      />
                    </div>
                  </div>
                ) : selectedField ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Citation Available</h3>
                    <p className="text-gray-600">
                      This field does not have a supporting citation from the patient notes.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Field</h3>
                    <p className="text-gray-600">
                      Click on a form field to view its supporting citation and evidence from the patient notes.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}
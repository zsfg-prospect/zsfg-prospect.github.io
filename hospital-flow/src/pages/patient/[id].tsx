import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import CollapsibleNote from '../../components/CollapsibleNote';
import Layout from '../../components/Layout';
import LoadingScreen from '../../components/LoadingScreen';
import PatientSidebar from '../../components/PatientSidebar';
import SummaryDisplay from '../../components/SummaryDisplay';
import TabNavigation from '../../components/TabNavigation';
import { Note, NoteSummary } from '../../types/api';
import { transformStaticDataToNoteSummary } from '../../utils/dataTransformer';

export default function PatientSummary() {
  const router = useRouter();
  const { id, timestamp } = router.query;
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<NoteSummary | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [highlightedNoteId, setHighlightedNoteId] = useState<string | null>(null);
  const [highlightedQuote, setHighlightedQuote] = useState<string | null>(null);
  const [showBackToSummary, setShowBackToSummary] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const [lastSummarySection, setLastSummarySection] = useState<string | null>(null);

  useEffect(() => {
    // Add scroll event listener to show/hide back to summary button
    const handleScroll = () => {
      if (summaryRef.current) {
        const summaryBottom = summaryRef.current.getBoundingClientRect().bottom;
        setShowBackToSummary(summaryBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function formatTimestamp(timeStr: string) {
    const [datePart, timePart] = timeStr.split(' ');
    const [month, day, year] = datePart.split('-');
    const [hours, minutes] = timePart.split(':');

    return `${year}-${month}-${day}-${hours}:${minutes}:00`;
  }

  function formatDateForFilename(timeStr: string) {
    const [datePart] = timeStr.split(' ');
    const [month, day, year] = datePart.split('-');
    return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
  }

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        console.log('Loading data from static JSON...');
        // Load data from static JSON file
        const response = await fetch('/patient_discharge.json');
        
        if (!response.ok) {
          throw new Error('Failed to load static data');
        }
        
        const data = await response.json();
        console.log('Static data loaded successfully:', data);
        
        // Find the patient with matching ID from the array
        const patientData = data.find((patient: any) => patient.pat_id_surrogate.toString() === id);
        
        if (patientData) {
          // Transform the static data to match expected format
          const transformedSummary = transformStaticDataToNoteSummary(patientData);
          setSummary(transformedSummary);
          
          const sortedNotes = patientData.notes.sort((a: Note, b: Note) => 
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          console.log('Notes loaded:', sortedNotes);
          setNotes(sortedNotes);
        } else {
          throw new Error(`No data found for patient ID ${id}`);
        }

      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'An error occurred loading patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Effect to scroll to highlighted note after state update
  useEffect(() => {
    if (highlightedNoteId && notes.length > 0) {
      // Small delay to ensure React has finished re-rendering
      const timer = setTimeout(() => {
        const element = document.querySelector(`[data-note-id="${highlightedNoteId}"]`);
        if (element) {
          console.log('📍 Scrolling to highlighted note:', highlightedNoteId);
          
          // Calculate the exact position to center the note
          const rect = element.getBoundingClientRect();
          const elementTop = window.pageYOffset + rect.top;
          const centerPosition = elementTop - (window.innerHeight / 2) + (rect.height / 2);
          
          window.scrollTo({
            top: centerPosition,
            behavior: 'smooth'
          });
        }
      }, 150); // Wait 150ms for React re-render
      
      return () => clearTimeout(timer);
    }
  }, [highlightedNoteId, notes.length]); // Trigger when highlighted note changes

  const handleNoteClick = (noteId: number, sectionId?: string, quote?: string) => {
    const noteIdStr = noteId.toString();
    console.log('handleNoteClick called:', { noteId, noteIdStr, sectionId, quote });
    
    setHighlightedNoteId(noteIdStr);
    setHighlightedQuote(quote || null);
    setLastSummarySection(sectionId || null);
    
    // Scrolling is now handled by the useEffect hook above
  };

  const handleBackToSummary = () => {
    if (lastSummarySection) {
      // First scroll to the summary section to ensure it's in view
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      
      // Then scroll to the specific section after a short delay
      setTimeout(() => {
        const sectionElement = document.querySelector(`[data-section-id="${lastSummarySection}"]`);
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add a temporary highlight effect to the section
          sectionElement.classList.add('bg-blue-50');
          setTimeout(() => {
            sectionElement.classList.remove('bg-blue-50');
          }, 2000);
        }
      }, 100);
    } else {
      summaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | Social Services Note Viewer</title>
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
        <div className="flex h-screen">
          <PatientSidebar currentPatientId={id as string} />
          <div className="flex-1 overflow-auto">
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
        <title>Patient {id} Summary | Social Services Note Viewer</title>
        <meta name="description" content="View and analyze social services notes and summaries" />
      </Head>
      <div className="flex flex-col h-screen">
        <TabNavigation />
        <div className="flex flex-1">
          <PatientSidebar currentPatientId={id as string} />
          <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4">

            <div className="flex flex-col space-y-12">
              {/* Summary Section */}
              <section id="generated-summary" className="scroll-mt-4">
                {summary ? (
                  <SummaryDisplay 
                    summary={summary}
                    onNoteClick={handleNoteClick}
                    summaryRef={summaryRef}
                    patientId={id as string}
                  />
                ) : (
                  <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                    No summary available
                  </div>
                )}
              </section>

              {/* Notes Section */}
              <section id="patient-notes" className="scroll-mt-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Patient Notes</h2>
                <div className="space-y-6">
                  {notes.map((note) => (
                    <CollapsibleNote 
                      key={`${note.timestamp}-${highlightedNoteId}-${highlightedQuote ? 'h' : 'n'}`}
                      note={note}
                      isHighlighted={highlightedNoteId === note.note_id.toString()}
                      highlightedQuote={highlightedNoteId === note.note_id.toString() ? highlightedQuote || undefined : undefined}
                    />
                  ))}
                </div>
              </section>
            </div>

            {/* Floating Back to Summary button */}
            {showBackToSummary && (
              <button
                onClick={handleBackToSummary}
                className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 z-50 group"
                aria-label="Back to summary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>
                  Back to{' '}
                  <span className="font-medium">
                    {lastSummarySection ? 'Last Section' : 'Summary'}
                  </span>
                </span>
              </button>
            )}
          </div>
          </div>
        </div>
      </div>
    </>
  );
} 

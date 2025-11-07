import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Action, SocialNeed, NoteSummary } from '../types/api';
import { NeedCard } from './NeedCard';
import { HousingCard } from './HousingCard';
import { ConsultCard } from './ConsultCard';
import { AdmissionCard } from './AdmissionCard';
import { OneLinerCard } from './OneLinerCard';
import { DischargeCard } from './DischargeCard';
import { TherapyCard } from './TherapyCard';
import { PatientContactsCard } from './PatientContactsCard';
import { SupportAtHomeCard } from './SupportAtHomeCard';
import { SubstanceUseCard } from './SubstanceUseCard';
import { SevereMedicalConditionsSection } from './SevereMedicalConditionsSection';
import { EDVisitsCard } from './EDVisitsCard';
import { PsychHospitalCard } from './PsychHospitalCard';
import { DMECard } from './DMECard';
import { DMESection } from './DMESection';
import { HighPriorityCard } from './HighPriorityCard';


interface SummaryDisplayProps {
    summary: NoteSummary;
    onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
    summaryRef: React.RefObject<HTMLDivElement>;
    patientId?: string;
}

interface ActionListProps {
    actions: Action[];
    title: string;
    sectionId: string;
    onNoteClick?: (noteId: number, sectionId?: string) => void;
}

// Helper function to remove all highlights from notes
const removeAllHighlights = () => {
    const highlights = document.querySelectorAll('.bg-yellow-200');
    highlights.forEach(highlight => {
        if (highlight instanceof HTMLElement) {
            const parent = highlight.parentNode;
            if (parent) {
                parent.textContent = parent.textContent; // This removes the span while preserving the text
            }
        }
    });
};

const ActionList = ({ actions, title, sectionId, onNoteClick }: ActionListProps) => {
    const handleEvidenceClick = useCallback((noteId: number, text: string) => {
        if (onNoteClick) {
            onNoteClick(noteId, sectionId);
        }
        
        console.log(`Attempting to find note with ID: ${noteId}`);
        // Remove all existing highlights first
        removeAllHighlights();

        // Find the note element in the DOM
        const noteElement = document.querySelector(`[data-note-id="${noteId}"]`);
        if (noteElement) {
            console.log('Found note element');
            
            // Check for and handle "Show More" button if it exists
            const showMoreButton = noteElement.querySelector('button');
            if (showMoreButton && showMoreButton.textContent?.includes('Show More')) {
                console.log('Found Show More button, expanding note');
                showMoreButton.click();
            }
            
            // Find the text content element and try to highlight the text
            const textContent = noteElement.querySelector('.whitespace-pre-wrap');
            if (textContent) {
                console.log('Found text content element, attempting to highlight text');
                // Create a temporary element to normalize the text for comparison
                const tempElement = document.createElement('div');
                tempElement.innerHTML = text;
                const normalizedSearchText = tempElement.textContent?.toLowerCase() || '';

                // Create a text node to compare with
                const noteText = textContent.textContent || '';
                
                // Find all positions of the text in the note (case insensitive)
                const normalizedNoteText = noteText.toLowerCase();
                const matches: number[] = [];
                let currentIndex = 0;
                
                while (true) {
                    const index = normalizedNoteText.indexOf(normalizedSearchText, currentIndex);
                    if (index === -1) break;
                    matches.push(index);
                    currentIndex = index + normalizedSearchText.length;
                }
                
                if (matches.length > 0) {
                    console.log(`Found ${matches.length} matches, highlighting all and scrolling to first match`);
                    
                    // Build the highlighted HTML by replacing all matches
                    let lastIndex = 0;
                    let highlightedHtml = '';
                    
                    matches.forEach((startIndex) => {
                        // Add the text before this match
                        highlightedHtml += noteText.slice(lastIndex, startIndex);
                        
                        // Add the highlighted match
                        const actualText = noteText.slice(startIndex, startIndex + normalizedSearchText.length);
                        highlightedHtml += `<span class="bg-yellow-200 transition-colors duration-500">${actualText}</span>`;
                        
                        lastIndex = startIndex + normalizedSearchText.length;
                    });
                    
                    // Add any remaining text after the last match
                    highlightedHtml += noteText.slice(lastIndex);
                    
                    textContent.innerHTML = highlightedHtml;
                    
                    // Scroll to the first match
                    noteElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    console.warn('Text not found in note content');
                    console.warn('Searching for text:', normalizedSearchText);
                    console.warn('In content:', noteText);
                    
                    // Create a warning element
                    const warningElement = document.createElement('div');
                    warningElement.className = 'bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4 flex justify-between items-center';
                    
                    // Create text content
                    const textDiv = document.createElement('div');
                    textDiv.textContent = 'Unable to find the exact text cited in this note. The text might be paraphrased or appear in a different format.';
                    warningElement.appendChild(textDiv);
                    
                    // Create close button
                    const closeButton = document.createElement('button');
                    closeButton.innerHTML = `
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    `;
                    closeButton.className = 'text-yellow-800 hover:text-yellow-900 focus:outline-none ml-4';
                    closeButton.onclick = () => {
                        warningElement.style.opacity = '0';
                        setTimeout(() => warningElement.remove(), 500);
                    };
                    warningElement.appendChild(closeButton);
                    
                    // Remove any existing warnings
                    const existingWarnings = noteElement.querySelectorAll('.bg-yellow-100');
                    existingWarnings.forEach(warning => warning.remove());
                    
                    // Insert the warning before the note content
                    noteElement.insertBefore(warningElement, noteElement.firstChild);
                    
                    // Scroll to include the warning
                    setTimeout(() => {
                        const elementRect = noteElement.getBoundingClientRect();
                        const absoluteElementTop = elementRect.top + window.pageYOffset;
                        const middle = absoluteElementTop - (window.innerHeight / 3);
                        window.scrollTo({ top: middle, behavior: 'smooth' });
                    }, 100);
                }
            } else {
                console.warn('Text content element not found');
            }
        } else {
            console.warn(`Note with ID ${noteId} not found in the DOM`);
            // Log all available note IDs for debugging
            const allNotes = document.querySelectorAll('[data-note-id]');
            console.log('Available note IDs:', Array.from(allNotes).map(el => el.getAttribute('data-note-id')));
        }
    }, [onNoteClick, sectionId]);

    if (actions.length === 0) return null;

    return (
        <div className="space-y-2 pl-4 border-l-2 border-gray-100" data-section-id={sectionId}>
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                {title}
            </h4>
            <div className="space-y-3">
                {actions.map((action, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                        <p className="text-gray-700 mb-2 text-sm">{action.description}</p>
                        <blockquote 
                            className="border-l-4 border-blue-500 pl-4 italic cursor-pointer bg-white rounded-r-lg transition-all duration-200 hover:shadow-md"
                            onClick={() => handleEvidenceClick(action.citation.note_id, action.citation.quote)}
                        >
                            <p className="text-sm text-gray-600">&ldquo;{action.citation.quote}&rdquo;</p>
                            <div className="mt-2 text-xs text-gray-500">
                                <span className="font-medium">Source:</span> Note {action.citation.note_id}
                            </div>
                        </blockquote>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Updated QuickNav component
const QuickNav = ({ 
    needs, 
    activeNeedId, 
    onNeedClick, 
    hasHousing,
    hasConsult,
    hasTherapy,
    hasReason,
    hasOneLiner,
    hasDischarge,
    hasDx,
    hasContacts,
    hasSupportAtHome,
    hasSubstanceUse,
    hasSevereMedCond,
    hasEdVisits,
    hasPsychHospital,
    hasDME,
    patientId
}: { 
    needs: SocialNeed[]; 
    activeNeedId: string | null;
    onNeedClick: (needId: string) => void;
    hasHousing: boolean;
    hasConsult: boolean;
    hasTherapy: boolean;
    hasReason: boolean;
    hasOneLiner: boolean;
    hasDischarge: boolean;
    hasDx: boolean;
    hasContacts: boolean;
    hasSupportAtHome: boolean;
    hasSubstanceUse: boolean;
    hasSevereMedCond: boolean;
    hasEdVisits: boolean;
    hasPsychHospital: boolean;
    hasDME: boolean;
    patientId?: string;
}) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        notes: true,
        additionalInfo: false,
        overview: true
    });

    const handleSectionClick = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleMainSectionClick = (sectionId: string) => {
        const element = document.querySelector(`#${sectionId}`);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <nav className="sticky top-4 bg-white rounded-lg shadow-md p-4 mb-6 max-h-[calc(100vh-2rem)] overflow-y-auto">
            <div className="space-y-4">
                {/* Overview Section */}
                {(hasReason || hasOneLiner) && (
                    <div className="border-b pb-3">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2 px-2">Overview</h4>
                        <div className="space-y-1">
                                {/* Reason for Admission */}
                                {hasReason && (
                                    <button
                                        onClick={() => onNeedClick('admission')}
                                        className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                            ${activeNeedId === 'admission'
                                                ? 'bg-yellow-50 text-yellow-700 font-medium'
                                                : 'text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-yellow-100 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </span>
                                        <span className="truncate text-sm">Reason for Admission</span>
                                    </button>
                                )}

                                {/* One Liner */}
                                {hasOneLiner && (
                                    <button
                                        onClick={() => onNeedClick('one-liner')}
                                        className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                            ${activeNeedId === 'one-liner'
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-900 hover:bg-gray-50'
                                            }`}
                                    >
                                        <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                                            <svg className="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </span>
                                        <span className="truncate text-sm">One Liner</span>
                                    </button>
                                )}
                        </div>
                    </div>
                )}

                {/* High Priority Section */}
                <div className="border-b pb-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 px-2">High Priority</h4>
                    <div className="space-y-1">
                        {/* Diagnostics */}
                        {hasDME && (
                            <button
                                onClick={() => onNeedClick('diagnostics')}
                                className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                    ${activeNeedId === 'diagnostics'
                                        ? 'bg-purple-50 text-purple-700 font-medium'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                                <span className="truncate text-sm">Diagnostics</span>
                            </button>
                        )}
                        
                        {/* Discharge */}
                        {hasDischarge && (
                            <button
                                onClick={() => onNeedClick('discharge')}
                                className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                    ${activeNeedId === 'discharge'
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                </span>
                                <span className="truncate text-sm">Discharge</span>
                            </button>
                        )}
                    </div>
                </div>


                {/* Social Needs Assessment Section */}
                <div className="border-b pb-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 px-2">Social Needs Assessment</h4>
                    <div className="space-y-1">
                        {/* Identified Needs */}
                        <button
                            onClick={() => onNeedClick('identified-needs')}
                            className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                ${activeNeedId === 'identified-needs'
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </span>
                            <span className="truncate text-sm">Identified Needs</span>
                        </button>
                        
                        {/* Substance Use */}
                        {hasSubstanceUse && (
                            <button
                                onClick={() => onNeedClick('substance-use')}
                                className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                    ${activeNeedId === 'substance-use'
                                        ? 'bg-amber-50 text-amber-700 font-medium'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-amber-100 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                    </svg>
                                </span>
                                <span className="truncate text-sm">Substance Use</span>
                            </button>
                        )}
                        
                        {/* Housing */}
                        {hasHousing && (
                            <button
                                onClick={() => onNeedClick('housing')}
                                className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                    ${activeNeedId === 'housing'
                                        ? 'bg-green-50 text-green-700 font-medium'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                    </svg>
                                </span>
                                <span className="truncate text-sm">Housing</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Medical Assessment Section */}
                <div className="border-b pb-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 px-2">Medical Assessment</h4>
                    <div className="space-y-1">
                        {/* Severe Medical Conditions */}
                        {hasSevereMedCond && (
                            <button
                                onClick={() => onNeedClick('severe-med-cond')}
                                className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                    ${activeNeedId === 'severe-med-cond'
                                        ? 'bg-red-50 text-red-700 font-medium'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-red-100 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </span>
                                <span className="truncate text-sm">Medical Conditions</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Resources Section */}
                <div className="border-b pb-3">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2 px-2">Resources</h4>
                    <div className="space-y-1">
                        {/* Patient Contacts */}
                        {hasContacts && (
                            <button
                                onClick={() => onNeedClick('patient-contacts')}
                                className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                    ${activeNeedId === 'patient-contacts'
                                        ? 'bg-indigo-50 text-indigo-700 font-medium'
                                        : 'text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </span>
                                <span className="truncate text-sm">Patient Contacts</span>
                            </button>
                        )}
                        
                        {/* Prefilled Forms */}
                        {patientId && patientId !== '782314' && (
                        <button
                            onClick={() => onNeedClick('prefilled-forms')}
                            className={`w-full flex items-center justify-start text-left px-2 py-1 rounded-md transition-colors duration-200
                                ${activeNeedId === 'prefilled-forms'
                                    ? 'bg-purple-50 text-purple-700 font-medium'
                                    : 'text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            <span className="w-4 h-4 mr-2 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </span>
                            <span className="truncate text-sm">Prefilled Forms</span>
                        </button>
                        )}
                    </div>
                </div>

                {/* Patient Notes */}
                <div>
                    <button
                        onClick={() => {
                            handleMainSectionClick('patient-notes');
                        }}
                        className="w-full flex items-center justify-start text-left px-2 py-1 rounded-md hover:bg-gray-50 transition-colors duration-200"
                    >
                        <span className="w-5 h-5 mr-2 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                            <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </span>
                        <span className="font-medium text-gray-900">Patient Notes</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default function SummaryDisplay({ summary, onNoteClick, summaryRef, patientId }: SummaryDisplayProps) {
    const [activeNeedId, setActiveNeedId] = useState<string | null>(null);
    const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
    const [allExpanded, setAllExpanded] = useState(false);
    const [housingExpanded, setHousingExpanded] = useState(false);
    const [consultExpanded, setConsultExpanded] = useState(false);
    const [therapyExpanded, setTherapyExpanded] = useState(false);
    const [reasonExpanded, setReasonExpanded] = useState(false);
    const [oneLinerExpanded, setOneLinerExpanded] = useState(false);
    const [dischargeExpanded, setDischargeExpanded] = useState(false);
    const [contactsExpanded, setContactsExpanded] = useState(false);
    const [supportAtHomeExpanded, setSupportAtHomeExpanded] = useState(false);
    const [substanceUseExpanded, setSubstanceUseExpanded] = useState(false);
    const [edVisitsExpanded, setEdVisitsExpanded] = useState(false);
    const [psychHospitalExpanded, setPsychHospitalExpanded] = useState(false);
    const [additionalInfoExpanded, setAdditionalInfoExpanded] = useState(false);
    const [highPriorityExpanded, setHighPriorityExpanded] = useState(false);
    const [dmeCardsExpanded, setDmeCardsExpanded] = useState<Record<number, boolean>>({});

    // Initialize all cards as collapsed
    useEffect(() => {
        const initialState = summary.identified_needs.reduce((acc, _, index) => {
            acc[index] = false;
            return acc;
        }, {} as Record<number, boolean>);
        setExpandedCards(initialState);
    }, [summary.identified_needs]);

    const toggleAllCards = () => {
        const newState = !allExpanded;
        setAllExpanded(newState);
        const updatedCards = Object.keys(expandedCards).reduce((acc, key) => {
            acc[Number(key)] = newState;
            return acc;
        }, {} as Record<number, boolean>);
        setExpandedCards(updatedCards);
        setHousingExpanded(newState);
        setConsultExpanded(newState);
        setTherapyExpanded(newState);
        setReasonExpanded(newState);
        setOneLinerExpanded(newState);
        setDischargeExpanded(newState);
        setContactsExpanded(newState);
        setSupportAtHomeExpanded(newState);
        setSubstanceUseExpanded(newState);
        setEdVisitsExpanded(newState);
        setPsychHospitalExpanded(newState);
        setAdditionalInfoExpanded(newState);
        setHighPriorityExpanded(newState);
    };

    const toggleCard = (index: number) => {
        setExpandedCards(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
        // Update allExpanded state based on whether all cards are now expanded
        const newExpandedState = {
            ...expandedCards,
            [index]: !expandedCards[index]
        };
        const areAllExpanded = Object.values(newExpandedState).every(value => value);
        setAllExpanded(areAllExpanded);
    };

    const toggleDmeCard = (index: number) => {
        setDmeCardsExpanded(prev => ({
            ...prev,
            [index]: !prev[index]
        }));
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setActiveNeedId(entry.target.getAttribute('data-section-id'));
                    }
                });
            },
            { threshold: 0.5 }
        );

        const needCards = document.querySelectorAll('[data-note-id]');
        needCards.forEach(card => observer.observe(card));

        return () => observer.disconnect();
    }, [summary]);

    const handleNeedClick = (needId: string) => {
        setActiveNeedId(needId);
        
        let selector = '';
        if (needId === 'identified-needs') {
            selector = '#identified-needs-section';
        } else if (needId === 'consult') {
            selector = '[data-section-id="consult"]';
        } else if (needId === 'housing') {
            selector = '[data-section-id="housing"]';
        } else if (needId === 'therapy') {
            selector = '[data-section-id="therapy"]';
        } else if (needId === 'admission') {
            selector = '[data-section-id="admission"]';
        } else if (needId === 'one-liner') {
            selector = '[data-section-id="one-liner"]';
        } else if (needId === 'discharge') {
            selector = '[data-section-id="discharge"]';
        } else if (needId === 'support-at-home') {
            selector = '[data-section-id="support-at-home"]';
        } else if (needId === 'patient-notes') {
            selector = '#patient-notes';
        } else if (needId === 'patient-contacts') {
            selector = '[data-section-id="patient-contacts"]';
        } else if (needId === 'substance-use') {
            selector = '[data-section-id="substance-use"]';
        } else if (needId === 'severe-med-cond') {
            selector = '[data-section-id="severe-med-cond"]';
        } else if (needId === 'ed-visits') {
            selector = '[data-section-id="ed-visits"]';
        } else if (needId === 'psych-hospital') {
            selector = '[data-section-id="psych-hospital"]';
        } else if (needId === 'diagnostics') {
            selector = '[data-section-id="diagnostics"]';
        } else if (needId === 'prefilled-forms') {
            selector = '[data-section-id="prefilled-forms"]';
        } else if (needId.startsWith('need-')) {
            selector = `[data-section-id="${needId}"]`;
        }
        
        const element = document.querySelector(selector);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="flex gap-6">
            <div className="w-1/4">
                <QuickNav 
                    needs={summary.identified_needs} 
                    activeNeedId={activeNeedId}
                    onNeedClick={handleNeedClick}
                    hasHousing={!!summary.housing_situation}
                    hasConsult={!!summary.reason_for_consult}
                    hasTherapy={summary.therapy && summary.therapy.length > 0}
                    hasReason={!!summary.reason_for_admission}
                    hasOneLiner={!!summary.one_liner}
                    hasDischarge={!!summary.discharge}
                    hasDx={false}
                    hasContacts={summary.patient_contacts.length > 0}
                    hasSupportAtHome={!!summary.support_at_home}
                    hasSubstanceUse={!!summary.substance_use}
                    hasSevereMedCond={summary.severe_med_cond && summary.severe_med_cond.length > 0}
                    hasEdVisits={!!summary.ed_visits}
                    hasPsychHospital={!!summary.psych_hospital}
                    hasDME={!!summary.dme && summary.dme.length > 0}
                    patientId={patientId}
                />
            </div>
            <div className="flex-1 space-y-8">
                <div id="generated-summary" ref={summaryRef}>
                    {/* Patient Timeline - Show for all patients since they use same data */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">Patient Timeline</h1>
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <Image
                                src="/images/patient_1_timeline.png"
                                alt={`Patient ${patientId} Timeline`}
                                width={600}
                                height={300}
                                className="w-1/2 h-auto rounded-lg border border-gray-200 mx-auto"
                            />
                        </div>
                    </div>

                    {/* Overview Section */}
                    {(summary.reason_for_admission || summary.one_liner) && (
                        <div className="mb-12">
                            <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">Overview</h1>

                            {/* Reason for Admission */}
                            {summary.reason_for_admission && (
                                <div className="mb-8" data-section-id="admission">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Reason for Admission</h2>
                                    <AdmissionCard
                                        admission={summary.reason_for_admission}
                                        onNoteClick={onNoteClick}
                                        isExpanded={reasonExpanded}
                                        onToggleExpand={() => setReasonExpanded(!reasonExpanded)}
                                    />
                                </div>
                            )}

                            {/* One Liner */}
                            {summary.one_liner && (
                                <div className="mb-8" data-section-id="one-liner">
                                    <h2 className="text-2xl font-bold text-gray-900 mb-6">One Liner</h2>
                                    <OneLinerCard
                                        oneLiner={summary.one_liner}
                                        onNoteClick={onNoteClick}
                                        isExpanded={oneLinerExpanded}
                                        onToggleExpand={() => setOneLinerExpanded(!oneLinerExpanded)}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* High Priority Section */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">High Priority</h1>
                        
                        {/* Diagnostics Section */}
                        {summary.dme && summary.dme.length > 0 && (
                            <div className="mb-8" data-section-id="diagnostics">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Diagnostics</h2>
                                <div className="space-y-4">
                                    {summary.dme.map((device, index) => (
                                        <DMECard
                                            key={index}
                                            device={device}
                                            index={index}
                                            onNoteClick={onNoteClick}
                                            isExpanded={dmeCardsExpanded[index] || false}
                                            onToggleExpand={() => toggleDmeCard(index)}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Discharge Section */}
                        {summary.discharge && (
                            <div className="mb-8" data-section-id="discharge">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Discharge</h2>
                                <DischargeCard
                                    discharge={summary.discharge}
                                    onNoteClick={onNoteClick}
                                    isExpanded={dischargeExpanded}
                                    onToggleExpand={() => setDischargeExpanded(!dischargeExpanded)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Social Needs Assessment Section */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">Social Needs Assessment</h1>

                        {/* Identified Needs Section */}
                        <div className="mb-8" id="identified-needs-section">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">Identified Needs</h2>
                                <button
                                    onClick={toggleAllCards}
                                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                >
                                    <svg 
                                        className={`w-5 h-5 mr-2 transition-transform duration-200 ${allExpanded ? 'transform rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {allExpanded ? 'Collapse All' : 'Expand All'}
                                </button>
                            </div>
                            {summary.identified_needs.map((need, index) => (
                                <NeedCard
                                    key={index}
                                    need={need}
                                    index={index}
                                    onNoteClick={onNoteClick}
                                    isExpanded={expandedCards[index] || false}
                                    onToggleExpand={() => toggleCard(index)}
                                />
                            ))}
                        </div>

                        {/* Substance Use Section */}
                        {summary.substance_use && (
                            <div className="mb-8" data-section-id="substance-use">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Substance Use</h2>
                                <SubstanceUseCard
                                    substanceUse={summary.substance_use}
                                    onNoteClick={onNoteClick}
                                    isExpanded={substanceUseExpanded}
                                    onToggleExpand={() => setSubstanceUseExpanded(!substanceUseExpanded)}
                                />
                            </div>
                        )}
                        
                        {/* Housing Section */}
                        {summary.housing_situation && (
                            <div className="mb-8" data-section-id="housing">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Housing</h2>
                                <HousingCard
                                    housing={summary.housing_situation}
                                    onNoteClick={onNoteClick}
                                    isExpanded={housingExpanded}
                                    onToggleExpand={() => setHousingExpanded(!housingExpanded)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Medical Assessment Section */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">Medical Assessment</h1>

                        {/* Severe Medical Conditions Section */}
                        {summary.severe_med_cond && summary.severe_med_cond.length > 0 && (
                            <SevereMedicalConditionsSection 
                                conditions={summary.severe_med_cond}
                                onNoteClick={onNoteClick}
                            />
                        )}
                    </div>

                    {/* Resources Section */}
                    <div className="mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-8 border-b-2 border-gray-200 pb-4">Resources</h1>

                        {/* Patient Contacts Section */}
                        {summary.patient_contacts.length > 0 && (
                            <div className="mb-8" data-section-id="patient-contacts">
                                <PatientContactsCard
                                    contacts={summary.patient_contacts}
                                    onNoteClick={onNoteClick}
                                    isExpanded={contactsExpanded}
                                    onToggleExpand={() => setContactsExpanded(!contactsExpanded)}
                                />
                            </div>
                        )}

                        {/* Prefilled Forms Section */}
                        {patientId && patientId !== '782314' && (
                        <div className="mb-8" data-section-id="prefilled-forms">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Prefilled Forms</h2>
                            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">IHSS Form</h3>
                                        <p className="text-gray-600">View prefilled IHSS form with supporting citations or download PDF</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => {
                                                window.open('/ihss.pdf', '_blank');
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                                            </svg>
                                            Download PDF
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
} 

import React from 'react';
import { Consult } from '../types/api'; // Assuming Consult type is defined here
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface ConsultCardProps {
    consult: Consult;
    onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
    isExpanded: boolean;
    onToggleExpand: () => void;
}

export function ConsultCard({ consult, onNoteClick, isExpanded, onToggleExpand }: ConsultCardProps) {
    const sectionId = 'consult-section';
    
    // Consult icon - using a chat/message icon
    const icon = (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
    );

    // Create a simple title string
    const titleText = consult.reason || "";

    return (
        consult.reason && <SummaryCard
            icon={icon}
            title={titleText}
            isExpanded={isExpanded}
            onToggleExpand={onToggleExpand}
            color="purple" // Different color to distinguish from other cards
        >
            {/* Priority badge if high priority */}
            {consult.priority === 'high' && (
                <div className="mb-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        {consult.priority.charAt(0).toUpperCase() + consult.priority.slice(1)} Priority
                    </span>
                </div>
            )}

            {/* Evidence/Citation */}
            <div>
                <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
                <CitationBlock
                    citation={consult.citation}
                    sectionId={sectionId}
                    onNoteClick={onNoteClick}
                />
            </div>
        </SummaryCard>
    );
}

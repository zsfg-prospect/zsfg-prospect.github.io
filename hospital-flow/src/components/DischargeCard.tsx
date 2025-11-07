import { Discharge } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface DischargeCardProps {
  discharge: Discharge;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function DischargeCard({ discharge, onNoteClick, isExpanded, onToggleExpand }: DischargeCardProps) {
  const sectionId = 'discharge-section';
  
  // Discharge icon - using an exit/discharge icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  );

  return (
    discharge.summary && <SummaryCard
      icon={icon}
      title={discharge.summary}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="green" // Different color to distinguish from other cards
    >
      {/* Summary section - if details available */}
      {discharge.details && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Summary</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-600 leading-relaxed text-base">{discharge.details}</p>
          </div>
        </div>
      )}
      
      
      {/* Evidence/Citation - only if citation exists */}
      {discharge.citation && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
          <CitationBlock
            citation={discharge.citation}
            sectionId={sectionId}
            onNoteClick={onNoteClick}
          />
        </div>
      )}
    </SummaryCard>
  );
} 
import { SummaryEDVisit } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface EDVisitsCardProps {
  edVisits: SummaryEDVisit;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function EDVisitsCard({ edVisits, onNoteClick, isExpanded, onToggleExpand }: EDVisitsCardProps) {
  const sectionId = 'ed-visits-section';
  
  // ED Visits icon - using a hospital/emergency icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  );

  return (
    <SummaryCard
      icon={icon}
      title="Emergency Department Visits"
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="red" // Different color for ED visits - red for emergency
    >
      {/* Summary */}
      {edVisits.summary && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{edVisits.summary}</p>
        </div>
      )}
      
      {/* Citations */}
      {edVisits.citations && edVisits.citations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
          {edVisits.citations.map((citation, index) => (
            <CitationBlock
              key={index}
              citation={citation}
              sectionId={sectionId}
              onNoteClick={onNoteClick}
            />
          ))}
        </div>
      )}
    </SummaryCard>
  );
} 
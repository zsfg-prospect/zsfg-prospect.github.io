import { Housing } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface HousingCardProps {
  housing: Housing;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function HousingCard({ housing, onNoteClick, isExpanded, onToggleExpand }: HousingCardProps) {
  const sectionId = 'housing-section';
  
  // Housing icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );

  return (
    <SummaryCard
      icon={icon}
      title={housing.current_living_arrangement ? `Current Living Arrangement: ${housing.current_living_arrangement}` : "Housing Situation"}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="green" // Different color to distinguish from needs
    >
      {/* Past living arrangement */}
      {housing.past_living_arrangement && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Past Living Arrangement</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{housing.past_living_arrangement}</p>
        </div>
      )}
      
      {/* Summary */}
      {housing.summary && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{housing.summary}</p>
        </div>
      )}
      
      {/* Citations */}
      {housing.citations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
          {housing.citations.map((citation, index) => (
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
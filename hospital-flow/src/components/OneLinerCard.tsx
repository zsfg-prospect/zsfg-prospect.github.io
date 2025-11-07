import { OneLiner } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface OneLinerCardProps {
  oneLiner: OneLiner;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function OneLinerCard({ oneLiner, onNoteClick, isExpanded, onToggleExpand }: OneLinerCardProps) {
  const sectionId = 'one-liner-section';
  
  // One liner icon - using a summary/document icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );

  return (
    oneLiner.summary && <SummaryCard
      icon={icon}
      title={oneLiner.summary}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="blue" // Different color to distinguish from admission card
    >
      
      {/* Evidence/Citation - only if citation exists */}
      {oneLiner.citation && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
          <CitationBlock
            citation={oneLiner.citation}
            sectionId={sectionId}
            onNoteClick={onNoteClick}
          />
        </div>
      )}
    </SummaryCard>
  );
} 
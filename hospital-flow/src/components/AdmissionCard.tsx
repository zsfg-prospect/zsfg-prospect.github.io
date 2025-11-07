import { Admission } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface AdmissionCardProps {
  admission: Admission;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function AdmissionCard({ admission, onNoteClick, isExpanded, onToggleExpand }: AdmissionCardProps) {
  const sectionId = 'admission-section';
  
  // Admission icon - using a hospital/bed icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    admission.reason && <SummaryCard
      icon={icon}
      title={admission.reason}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="amber" // Different color to distinguish from other cards
    >
      
      {/* Evidence/Citation - only if citation exists */}
      {admission.citation && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
          <CitationBlock
            citation={admission.citation}
            sectionId={sectionId}
            onNoteClick={onNoteClick}
          />
        </div>
      )}
    </SummaryCard>
  );
} 
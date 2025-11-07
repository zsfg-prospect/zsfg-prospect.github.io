import { SummaryPsychHosp } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface PsychHospitalCardProps {
  psychHospital: SummaryPsychHosp;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function PsychHospitalCard({ psychHospital, onNoteClick, isExpanded, onToggleExpand }: PsychHospitalCardProps) {
  const sectionId = 'psych-hospital-section';
  
  // Psych hospital icon - using a hospital/mental health icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <SummaryCard
      icon={icon}
      title="Psychiatric Hospitalization"
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="indigo" // Different color to distinguish from other cards
    >
      {/* Summary */}
      {psychHospital.summary && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{psychHospital.summary}</p>
        </div>
      )}
      
      {/* Citations */}
      {psychHospital.citations.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
          {psychHospital.citations.map((citation, index) => (
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
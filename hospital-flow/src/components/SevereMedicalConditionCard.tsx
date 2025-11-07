import { SevereMedicalCondition } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface SevereMedicalConditionCardProps {
  condition: SevereMedicalCondition;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  index?: number; // Optional index if we're showing multiple conditions
}

export function SevereMedicalConditionCard({ 
  condition, 
  onNoteClick, 
  isExpanded, 
  onToggleExpand,
  index
}: SevereMedicalConditionCardProps) {
  const sectionId = index !== undefined ? `severe-med-cond-${index}` : 'severe-med-cond-section';
  
  // Medical condition icon - using a heart/pulse icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  );

  return (
    <SummaryCard
      icon={icon}
      title={condition.diagnosis}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="red" // Using red to signify medical severity
    >
      {/* Date of diagnosis (if available) */}
      {condition.date_of_diagonsis && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Date of Diagnosis</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{condition.date_of_diagonsis}</p>
        </div>
      )}
      
      {/* Citation/Evidence */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
        <CitationBlock
          citation={condition.citation}
          sectionId={sectionId}
          onNoteClick={onNoteClick}
        />
      </div>
    </SummaryCard>
  );
} 
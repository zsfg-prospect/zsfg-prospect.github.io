import { SubstanceUse, SubstanceUseStatus } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface SubstanceUseCardProps {
  substanceUse: SubstanceUse;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function SubstanceUseCard({ substanceUse, onNoteClick, isExpanded, onToggleExpand }: SubstanceUseCardProps) {
  const sectionId = 'substance-use-section';
  
  // Substance use icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  );

  // Status badge color mapping
  const getStatusColor = (status: SubstanceUseStatus) => {
    switch (status) {
      case SubstanceUseStatus.CURRENT:
        return 'bg-red-100 text-red-800';
      case SubstanceUseStatus.PAST:
        return 'bg-yellow-100 text-yellow-800';
      case SubstanceUseStatus.NO_USE:
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    substanceUse.summary &&<SummaryCard
      icon={icon}
      title={substanceUse.summary}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="amber" // Distinct color for substance use
    >
      {/* Date of last use (if available) */}
      {substanceUse.date_of_last_use && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Last Use</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{substanceUse.date_of_last_use}</p>
        </div>
      )}
      
      {/* Methadone information (if available) */}
      {substanceUse.on_methadone && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-700 mb-2">Methadone Treatment</h4>
          <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{substanceUse.on_methadone}</p>
        </div>
      )}
      
      {/* Citation/Evidence */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
        <CitationBlock
          citation={substanceUse.citation}
          sectionId={sectionId}
          onNoteClick={onNoteClick}
        />
      </div>
    </SummaryCard>
  );
} 

import { SupportAtHome } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface SupportAtHomeCardProps {
  supportAtHome: SupportAtHome;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function SupportAtHomeCard({ 
  supportAtHome, 
  onNoteClick, 
  isExpanded, 
  onToggleExpand 
}: SupportAtHomeCardProps) {
  const sectionId = 'support-at-home-section';
  
  // Support at home icon - using a home with heart icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
    </svg>
  );

  return (
    supportAtHome.summary &&<SummaryCard
      icon={icon}
      title={supportAtHome.summary}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="amber" // Using amber color theme to distinguish from other cards
    >
      
      {/* Evidence/Citation */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
        <CitationBlock
          citation={supportAtHome.citation}
          sectionId={sectionId}
          onNoteClick={onNoteClick}
        />
      </div>
    </SummaryCard>
  );
} 
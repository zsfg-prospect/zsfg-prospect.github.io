import { Therapy } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface TherapyCardProps {
  therapy: Therapy[];
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function TherapyCard({ therapy, onNoteClick, isExpanded, onToggleExpand }: TherapyCardProps) {
  const sectionId = 'therapy-section';
  
  // Therapy icon - using a medical/rehab related icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
    </svg>
  );

  // Helper function to get human-readable rehab type
  const formatRehabType = (type: string): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  // Helper function to get human-readable binary status
  const formatBinaryStatus = (status: string): string => {
    return status === 'yes' ? 'Yes' : 'No';
  };

  return (
    <SummaryCard
      icon={icon}
      title=""
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="indigo" // Using indigo color to distinguish from other cards
    >
      {therapy.length === 0 ? (
        <p className="text-gray-500 italic">No therapy information available</p>
      ) : (
        <div className="space-y-6">
          {therapy.map((item, index) => (
            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
              {/* Therapy Type */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Therapy Type</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {formatRehabType(item.rehab_type)}
                </p>
              </div>
              
              {/* Has Consult */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Has Consult</h4>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.has_consult === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {formatBinaryStatus(item.has_consult)}
                  </span>
                </div>
              </div>
              
              {/* Summary */}
              <div className="mb-4">
                <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{item.summary}</p>
              </div>
              
              {/* Citation */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
                <CitationBlock
                  citation={item.citation}
                  sectionId={`${sectionId}-${index}`}
                  onNoteClick={onNoteClick}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </SummaryCard>
  );
} 
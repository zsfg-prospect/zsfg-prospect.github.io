import { DMEDevice } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface DMECardProps {
  device: DMEDevice;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  index?: number; // Optional index if we're showing multiple devices
}

export function DMECard({ 
  device, 
  onNoteClick, 
  isExpanded, 
  onToggleExpand,
  index
}: DMECardProps) {
  const sectionId = index !== undefined ? `dme-device-${index}` : 'dme-section';
  
  // DME icon - using a medical equipment icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );

  return (
    <SummaryCard
      icon={icon}
      title={device.device_type}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="indigo" // Using indigo to distinguish from other components
    >
      
      {/* Summary */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-700 mb-2">Summary</h4>
        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{device.summary}</p>
      </div>
      
      {/* Citation/Evidence */}
      <div>
        <h4 className="font-medium text-gray-700 mb-2">Evidence</h4>
        <CitationBlock
          citation={device.citation}
          sectionId={sectionId}
          onNoteClick={onNoteClick}
        />
      </div>
    </SummaryCard>
  );
} 
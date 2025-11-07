import { DMEDevice } from '../types/api';
import { DMECard } from './DMECard';
import { useState } from 'react';

interface DMESectionProps {
  devices: DMEDevice[];
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
}

export function DMESection({ devices, onNoteClick }: DMESectionProps) {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  const toggleCard = (index: number) => {
    setExpandedCards(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
    
    // Update allExpanded based on new state
    const newExpandedState = {
      ...expandedCards,
      [index]: !expandedCards[index]
    };
    const allCardsExpanded = devices.every((_, i) => newExpandedState[i] === true);
    setAllExpanded(allCardsExpanded);
  };

  const toggleAllCards = () => {
    const newState = !allExpanded;
    setAllExpanded(newState);
    
    const newExpandedCards = devices.reduce((acc, _, index) => {
      acc[index] = newState;
      return acc;
    }, {} as Record<number, boolean>);
    
    setExpandedCards(newExpandedCards);
  };

  if (!devices.length) return null;

  return (
    <div data-section-id="dme-section">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Medical Equipment</h2>
        {devices.length > 1 && (
          <button
            onClick={toggleAllCards}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <svg 
              className={`w-5 h-5 mr-2 transition-transform duration-200 ${allExpanded ? 'transform rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {allExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        )}
      </div>
      <div className="space-y-4">
        {devices.map((device, index) => (
          <DMECard
            key={index}
            device={device}
            index={index}
            onNoteClick={onNoteClick}
            isExpanded={expandedCards[index] || false}
            onToggleExpand={() => toggleCard(index)}
          />
        ))}
      </div>
    </div>
  );
} 
import { SevereMedicalCondition } from '../types/api';
import { SevereMedicalConditionCard } from './SevereMedicalConditionCard';
import { useState } from 'react';

interface SevereMedicalConditionsSectionProps {
  conditions: SevereMedicalCondition[];
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
}

export function SevereMedicalConditionsSection({ 
  conditions, 
  onNoteClick 
}: SevereMedicalConditionsSectionProps) {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({});
  const [allExpanded, setAllExpanded] = useState(false);

  // Toggle a specific card
  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const newState = { ...prev, [index]: !prev[index] };
      
      // Update allExpanded status based on current state
      const areAllExpanded = Object.values(newState).every(expanded => expanded) && 
                            Object.keys(newState).length === conditions.length;
      setAllExpanded(areAllExpanded);
      
      return newState;
    });
  };

  // Toggle all cards
  const toggleAllCards = () => {
    const newExpandedState = !allExpanded;
    setAllExpanded(newExpandedState);
    
    const newState = conditions.reduce((acc, _, index) => {
      acc[index] = newExpandedState;
      return acc;
    }, {} as Record<number, boolean>);
    
    setExpandedCards(newState);
  };

  if (!conditions.length) {
    return null;
  }

  return (
    <div className="mb-8" data-section-id="severe-med-cond">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Medical Conditions</h2>
        {conditions.length > 1 && (
          <button
            onClick={toggleAllCards}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
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
        {conditions.map((condition, index) => (
          <div key={index} data-section-id={`severe-med-cond-${index}`}>
            <SevereMedicalConditionCard
              condition={condition}
              onNoteClick={onNoteClick}
              isExpanded={expandedCards[index] || false}
              onToggleExpand={() => toggleCard(index)}
              index={index}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 
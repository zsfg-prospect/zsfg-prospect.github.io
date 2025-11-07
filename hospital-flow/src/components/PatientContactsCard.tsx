import { PatientContact } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

interface PatientContactsCardProps {
  contacts: PatientContact[];
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function PatientContactsCard({ 
  contacts, 
  onNoteClick, 
  isExpanded, 
  onToggleExpand 
}: PatientContactsCardProps) {
  const sectionId = 'patient-contacts-section';
  
  // Contacts icon
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  return (
    <SummaryCard
      icon={icon}
      title="Patient Contacts"
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="indigo" // Different color to distinguish from other cards
    >
      {contacts.length === 0 ? (
        <p className="text-gray-500 italic">No contact information available.</p>
      ) : (
        <div className="space-y-6">
          {contacts.map((contact, index) => (
            <div key={index} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 flex-shrink-0 rounded-full bg-indigo-100 flex items-center justify-center">
                  <span className="text-xs text-indigo-600 font-medium">{index + 1}</span>
                </span>
                <h4 className="font-medium text-gray-800">{contact.name}</h4>
              </div>
              
              {/* Contact details */}
              <div className="space-y-2 pl-7">
                {contact.relation && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 font-medium w-24 flex-shrink-0">Relation:</span>
                    <span className="text-gray-700">{contact.relation}</span>
                  </div>
                )}
                
                {contact.contact_info && (
                  <div className="flex items-start gap-2">
                    <span className="text-gray-500 font-medium w-24 flex-shrink-0">Contact Info:</span>
                    <span className="text-gray-700">{contact.contact_info}</span>
                  </div>
                )}
                
                {/* Citation */}
                <div className="mt-2">
                  <CitationBlock
                    citation={contact.citation}
                    sectionId={`${sectionId}-contact-${index}`}
                    onNoteClick={onNoteClick}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </SummaryCard>
  );
} 
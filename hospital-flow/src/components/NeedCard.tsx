import { SocialNeed } from '../types/api';
import { SummaryCard } from './SummaryCard';
import { CitationBlock } from './CitationBlock';

export function NeedCard({
  need,
  index,
  onNoteClick,
  isExpanded,
  onToggleExpand,
}: {
  need: SocialNeed;
  index: number;
  onNoteClick?: (noteId: number, sectionId?: string) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}) {
  const needId = `need-${index}`;

  // Status logic
  const hasCurrentActions = need.current_actions.length > 0;
  const hasPlannedActions = need.planned_actions.length > 0;
  const status = hasCurrentActions ? 'active' : hasPlannedActions ? 'pending' : 'completed';

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  const statusText = {
    active: 'Active',
    pending: 'Pending',
    completed: 'Completed',
  };

  // Icon for needs
  const icon = (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h8" />
    </svg>
  );

  return (
    <SummaryCard
      icon={icon}
      title={need.description}
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="blue"
    >
      <div className="flex items-center gap-3 mb-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {statusText[status]}
        </span>
        {need.priority && (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {need.priority.charAt(0).toUpperCase() + need.priority.slice(1)} Priority
          </span>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
        {need.previous_actions.length > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {need.previous_actions.length} Previous
          </span>
        )}
        {need.current_actions.length > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {need.current_actions.length} Current
          </span>
        )}
        {need.planned_actions.length > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {need.planned_actions.length} Planned
          </span>
        )}
      </div>
      {/* Main citation - only if citation exists */}
      {need.citation && (
        <CitationBlock
          citation={need.citation}
          sectionId={needId}
          onNoteClick={onNoteClick}
        />
      )}

      {/* Actions */}
      <div className="mt-4">
        {need.previous_actions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Previous Actions</h4>
            {need.previous_actions.map((action, idx) => (
              <div key={idx} className="mb-2">
                <p className="text-gray-700 text-sm">{action.description}</p>
                <CitationBlock
                  citation={action.citation}
                  sectionId={`${needId}-previous`}
                  onNoteClick={onNoteClick}
                />
              </div>
            ))}
          </div>
        )}
        {need.current_actions.length > 0 && (
          <div className="mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Current Actions</h4>
            {need.current_actions.map((action, idx) => (
              <div key={idx} className="mb-2">
                <p className="text-gray-700 text-sm">{action.description}</p>
                <CitationBlock
                  citation={action.citation}
                  sectionId={`${needId}-current`}
                  onNoteClick={onNoteClick}
                />
              </div>
            ))}
          </div>
        )}
        {need.planned_actions.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-700 mb-2">Planned Actions</h4>
            {need.planned_actions.map((action, idx) => (
              <div key={idx} className="mb-2">
                <p className="text-gray-700 text-sm">{action.description}</p>
                <CitationBlock
                  citation={action.citation}
                  sectionId={`${needId}-planned`}
                  onNoteClick={onNoteClick}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </SummaryCard>
  );
}

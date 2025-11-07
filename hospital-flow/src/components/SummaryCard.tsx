import { ReactNode } from 'react';

export function SummaryCard({
  icon,
  title,
  isExpanded,
  onToggleExpand,
  children,
  color = 'blue',
}: {
  icon: ReactNode;
  title: string;
  isExpanded: boolean;
  onToggleExpand: () => void;
  children: ReactNode;
  color?: string; // e.g. 'blue', 'purple', etc.
}) {
  const bgFrom = `from-${color}-50`;
  const iconBg = `bg-${color}-100`;
  const iconText = `text-${color}-600`;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div
        className={`bg-gradient-to-r ${bgFrom} to-white p-6 border-b cursor-pointer transition-colors duration-200 ${
          !isExpanded ? `hover:bg-${color}-50` : ''
        }`}
        onClick={onToggleExpand}
      >
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
            <span className={iconText}>{icon}</span>
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none transition-transform duration-200"
                style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isExpanded && <div className="p-6">{children}</div>}
    </div>
  );
}
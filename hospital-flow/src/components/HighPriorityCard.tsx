import { ReactNode } from 'react';
import { SummaryCard } from './SummaryCard';

interface HighPriorityCardProps {
  children: ReactNode;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export function HighPriorityCard({ children, isExpanded, onToggleExpand }: HighPriorityCardProps) {
  return (
    <SummaryCard
      icon={
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      }
      title="High Priority Discharge Tasks"
      isExpanded={isExpanded}
      onToggleExpand={onToggleExpand}
      color="red"
    >
      {children}
    </SummaryCard>
  );
}
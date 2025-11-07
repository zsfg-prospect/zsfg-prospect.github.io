import { Citation } from '../types/api';

export function CitationBlock({
  citation,
  sectionId,
  onNoteClick,
}: {
  citation: Citation;
  sectionId: string;
  onNoteClick?: (noteId: number, sectionId?: string, quote?: string) => void;
}) {
  const handleClick = () => {
    console.log('Citation clicked:', { noteId: citation.note_id, sectionId, quote: citation.quote });
    onNoteClick?.(citation.note_id, sectionId, citation.quote);
  };

  return (
    <blockquote
      className="border-l-4 border-blue-500 pl-4 italic cursor-pointer bg-white rounded-r-lg transition-all duration-200 hover:shadow-md mt-4"
      onClick={handleClick}
    >
      <p className="text-sm text-gray-600">&ldquo;{citation.quote}&rdquo;</p>
      <div className="mt-2 text-xs text-gray-500">
        <span className="font-medium">Source:</span> Note {citation.note_id}
      </div>
    </blockquote>
  );
}

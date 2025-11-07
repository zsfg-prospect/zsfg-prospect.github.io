import { useEffect, useRef, useState } from 'react';
import { Note } from '../types/api';

// Helper function to format note text
const formatNoteText = (text: string): string => {
  // First normalize the text encoding
  const normalizedText = new TextDecoder('utf-8')
    .decode(new TextEncoder().encode(text))
    // Replace any non-printable characters with spaces
    .replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');

  return normalizedText
    .replace(/[ \t]{4,}/g, '\n\n')
    .replace(/ +\n/g, '\n')
    .trim();
};

interface CollapsibleNoteProps {
  note: Note;
  maxHeight?: number;
  isHighlighted?: boolean;
  highlightedQuote?: string;
}

export default function CollapsibleNote({
  note,
  maxHeight = 500,
  isHighlighted,
  highlightedQuote,
}: CollapsibleNoteProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [shouldShowButton, setShouldShowButton] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [highlightedText, setHighlightedText] = useState<string | null>(null);

  // Auto-expand when highlighted
  useEffect(() => {
    if (isHighlighted) {
      // Auto-expand the note when it's highlighted
      setIsExpanded(true);
    }
  }, [isHighlighted, highlightedQuote, note.note_id]);

  useEffect(() => {
    if (contentRef.current) {
      const shouldCollapse = contentRef.current.scrollHeight > maxHeight;
      setShouldShowButton(shouldCollapse);
      // If the note is short enough, keep it expanded
      setIsExpanded(!shouldCollapse);
    }
  }, [maxHeight, note.note_text]);

  // Clear highlight after a few seconds
  useEffect(() => {
    if (highlightedText) {
      const timer = setTimeout(() => {
        setHighlightedText(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedText]);

  // Function to render text with highlighting
  const renderNoteText = (text: string) => {
    if (!highlightedQuote) {
      return text;
    }

    try {
      const normalizedHighlightedText = highlightedQuote.replace(/\s+/g, ' ').trim();
      
      const wordsToMatch = normalizedHighlightedText
        .split(' ')
        .map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .join('\\s+');
      
      const regex = new RegExp(wordsToMatch, 'i');
      
      const match = text.match(regex);
      
      if (match && match[0]) {
        const startIndex = text.toLowerCase().indexOf(match[0].toLowerCase());
        if (startIndex !== -1) {
          const beforeMatch = text.slice(0, startIndex);
          const matchedText = text.slice(startIndex, startIndex + match[0].length);
          const afterMatch = text.slice(startIndex + match[0].length);
          
          return (
            <>
              {beforeMatch}
              <span className="bg-yellow-300 font-bold border-2 border-yellow-500 px-1 rounded transition-colors duration-500" style={{ backgroundColor: '#fef08a', border: '2px solid #eab308' }}>
                {matchedText}
              </span>
              {afterMatch}
            </>
          );
        }
      } else {
        // If no match found, highlight the entire text
        return (
          <span className="bg-yellow-200 transition-colors duration-500">
            {text}
          </span>
        );
      }
      return text;

    } catch (error) {
      console.error('Error highlighting text with flexible whitespace:', error);
      return text;
    }
  };

  const handleExpandCollapse = () => {
    if (isExpanded && contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-md p-6 transition-colors duration-500 ${
        isHighlighted ? 'bg-yellow-50' : ''
      }`}
      data-note-id={note.note_id}
    >
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-semibold">
                {note.type}
              </h3>
              <span className="text-sm text-gray-500">
                (ID: {note.note_id})
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {note.clinical_service}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Note Date: {new Date(note.timestamp).toLocaleString()}
            </div>
            {shouldShowButton && (
              <button
                onClick={handleExpandCollapse}
                className="text-blue-500 hover:text-blue-600 text-sm font-medium focus:outline-none whitespace-nowrap"
              >
                {isExpanded ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>
        <div 
          ref={contentRef}
          className={`text-gray-600 relative ${
            !shouldShowButton || isExpanded 
              ? '' 
              : 'overflow-hidden'
          }`}
          style={{ maxHeight: !shouldShowButton || isExpanded ? undefined : `${maxHeight}px` }}
        >
          <div className="whitespace-pre-wrap">
            {renderNoteText(formatNoteText(note.note_text))}
          </div>
          {!isExpanded && shouldShowButton && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent"></div>
          )}
        </div>
      </div>
    </div>
  );
} 

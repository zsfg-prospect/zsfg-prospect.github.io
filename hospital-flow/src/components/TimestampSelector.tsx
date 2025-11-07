import { useEffect, useRef, useState } from 'react';
import { TimestampsResponse } from '../types/api';

interface TimestampSelectorProps {
    patientId: number | null;
    onTimestampSelect: (timestamp: string) => void;
}

export default function TimestampSelector({ patientId, onTimestampSelect }: TimestampSelectorProps) {
    const [timestamps, setTimestamps] = useState<string[]>([]);
    const [selectedTimestamp, setSelectedTimestamp] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const fetchTimestamps = async () => {
            if (!patientId) {
                setTimestamps([]);
                setSelectedTimestamp('');
                return;
            }

            try {
                setIsLoading(true);
                const response = await fetch(`/api/patients/${patientId}/timestamps`);
                if (!response.ok) throw new Error('Failed to fetch timestamps');
                
                const data: TimestampsResponse = await response.json();
                setTimestamps(data.timestamps);
                setSelectedTimestamp('');
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch timestamps');
            } finally {
                setIsLoading(false);
            }
        };

        fetchTimestamps();
    }, [patientId]);

    const handleTimestampSelect = (timestamp: string) => {
        setSelectedTimestamp(timestamp);
        onTimestampSelect(timestamp);
        setIsOpen(false);
    };

    const formatDate = (timestamp: string) => {
        return new Date(timestamp).toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (!patientId) {
        return null;
    }

    if (error) {
        return (
            <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error loading timestamps</h3> <p className="mt-2 text-sm text-red-700">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="timestamp-select" className="block text-sm font-medium text-gray-900 mb-2">
                    Select Note Date
                </label>
                <p className="text-sm text-gray-500 mb-3">
                    The summary will be generated using this note and all previous notes for this patient.
                </p>
                <div className="relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => !isLoading && setIsOpen(!isOpen)}
                        className={`
                            relative w-full text-left
                            rounded-lg border-2 bg-white px-4 py-2.5 text-gray-900
                            transition-colors duration-200
                            ${selectedTimestamp 
                                ? 'border-blue-500 ring-2 ring-blue-200' 
                                : 'border-gray-200 hover:border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                            }
                            disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:cursor-not-allowed
                            text-base sm:text-sm
                        `}
                        disabled={isLoading}
                    >
                        <span className={selectedTimestamp ? 'text-gray-900' : 'text-gray-500'}>
                            {selectedTimestamp 
                                ? formatDate(selectedTimestamp)
                                : isLoading 
                                    ? 'Loading dates...' 
                                    : 'Select a date...'}
                        </span>

                        {/* Custom dropdown arrow */}
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                            <svg 
                                className={`h-5 w-5 transition-transform duration-200 
                                    ${selectedTimestamp ? 'text-blue-500' : 'text-gray-400'}
                                    ${isLoading ? 'animate-spin' : ''}
                                    ${isOpen ? 'transform rotate-180' : ''}`
                                }
                                xmlns="http://www.w3.org/2000/svg" 
                                viewBox="0 0 20 20" 
                                fill="currentColor" 
                                aria-hidden="true"
                            >
                                {isLoading ? (
                                    <path fillRule="evenodd" d="M4 8a6 6 0 1112 0c0 1.017-.07 2.019-.203 3h-2.113c.144-.82.22-1.669.22-2.537a4.5 4.5 0 00-9 0c0 .868.076 1.717.22 2.537H3.203A24.25 24.25 0 014 8z" clipRule="evenodd" />
                                ) : (
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                )}
                            </svg>
                        </span>
                    </button>

                    {/* Dropdown menu */}
                    {isOpen && !isLoading && (
                        <div className="absolute z-10 mt-1 w-full rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 max-h-60 overflow-auto">
                            <div className="py-1">
                                {timestamps.map((timestamp) => (
                                    <button
                                        key={timestamp}
                                        onClick={() => handleTimestampSelect(timestamp)}
                                        className={`
                                            w-full text-left px-4 py-2 text-sm
                                            ${selectedTimestamp === timestamp
                                                ? 'bg-blue-100 text-blue-900'
                                                : 'text-gray-900 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        {formatDate(timestamp)}
                                    </button>
                                ))}
                                {timestamps.length === 0 && (
                                    <div className="px-4 py-2 text-sm text-gray-500">
                                        No dates available
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Helper text */}
                {/* <p className="mt-2 text-sm text-gray-500">
                    {isLoading 
                        ? 'Loading available dates...'
                        : timestamps.length > 0 
                            ? `${timestamps.length} dates available`
                            : 'No dates available'
                    }
                </p> */}
            </div>
        </div>
    );
} 

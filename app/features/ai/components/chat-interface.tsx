import React, { useEffect, useRef, useState } from 'react';
import { useChat } from '../hooks/use-chat';
import { Button } from '~/components/ui/button';
import { Send, Loader2, Filter, Search, X } from 'lucide-react';
import { authJson } from '~/lib/api-client';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

type TranscriptOption = {
    id: string;
    agenda: string;
    date: string;
};

export const ChatInterface: React.FC = () => {
    const {
        currentMessages,
        currentSession,
        currentSuggestions,
        isSending,
        error,
        sendMessage,
        fetchSessionMessages,
        currentSessionId,
    } = useChat();

    const [input, setInput] = useState('');
    const [transcriptOptions, setTranscriptOptions] = useState<TranscriptOption[]>([]);
    const [selectedMeetingId, setSelectedMeetingId] = useState('');
    const [isLoadingFilters, setIsLoadingFilters] = useState(false);
    const [isAgendaPickerOpen, setIsAgendaPickerOpen] = useState(false);
    const [agendaSearchQuery, setAgendaSearchQuery] = useState('');
    const [filteredAgendas, setFilteredAgendas] = useState<TranscriptOption[]>([]);
    const [hoveredAgendaId, setHoveredAgendaId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const agendaPickerRef = useRef<HTMLDivElement>(null);

    // Load messages when session changes
    useEffect(() => {
        if (currentSessionId) {
            fetchSessionMessages(currentSessionId);
        }
    }, [currentSessionId]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [currentMessages]);

    useEffect(() => {
        const loadTranscriptFilters = async () => {
            setIsLoadingFilters(true);
            try {
                const data = await authJson<TranscriptOption[]>(`${API_BASE_URL}/api/transcripts`);
                const sortedAgendas = (data ?? []).sort((a, b) =>
                    a.agenda.localeCompare(b.agenda, 'id', { sensitivity: 'base' })
                );
                setTranscriptOptions(sortedAgendas);
                setFilteredAgendas(sortedAgendas);
            } catch (err) {
                console.error('Failed to load transcript agendas:', err);
                setTranscriptOptions([]);
                setFilteredAgendas([]);
            } finally {
                setIsLoadingFilters(false);
            }
        };

        loadTranscriptFilters();
    }, []);

    // Filter agendas based on search query
    useEffect(() => {
        if (agendaSearchQuery.trim() === '') {
            setFilteredAgendas(transcriptOptions);
        } else {
            const filtered = transcriptOptions.filter((t) =>
                t.agenda.toLowerCase().includes(agendaSearchQuery.toLowerCase())
            );
            setFilteredAgendas(filtered);
        }
    }, [agendaSearchQuery, transcriptOptions]);

    // Close agenda picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (agendaPickerRef.current && !agendaPickerRef.current.contains(event.target as Node)) {
                setIsAgendaPickerOpen(false);
            }
        };

        if (isAgendaPickerOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isAgendaPickerOpen]);

    const getYearFromDate = (dateStr: string): string => {
        try {
            const date = new Date(dateStr);
            return date.getFullYear().toString();
        } catch {
            return '';
        }
    };

    const handleSelectAgenda = (agendaId: string, agendaName: string) => {
        setSelectedMeetingId(agendaId);
        setIsAgendaPickerOpen(false);
        setAgendaSearchQuery('');
    };

    const handleResetAgenda = () => {
        setSelectedMeetingId('');
        setAgendaSearchQuery('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isSending) return;

        const question = input.trim();
        setInput('');

        try {
            // Jika tidak ada agenda yang dipilih, kirim tanpa filter (meetingId undefined)
            await sendMessage(question, selectedMeetingId || undefined);
        } catch (err) {
            console.error('Failed to send message:', err);
        }
    };

    const handleSuggestionClick = async (suggestion: string) => {
        if (isSending) return;

        try {
            await sendMessage(suggestion, selectedMeetingId || undefined);
        } catch (err) {
            console.error('Failed to send suggestion:', err);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#034391] to-[#0256b8]">
                <h2 className="text-lg font-semibold text-white">
                    {currentSession?.agenda || 'New Chat'}
                </h2>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-4 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-4xl mx-auto space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm shadow-sm">
                            {error}
                        </div>
                    )}

                    {currentMessages.length === 0 && !isSending && (
                        <div className="flex items-center justify-center h-96">
                            <div className="text-center text-gray-400 dark:text-gray-500">
                                <p className="text-lg">Start a conversation by asking a question about your meeting documents.</p>
                            </div>
                        </div>
                    )}

                    {currentMessages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                    ? 'bg-[#034391] text-white shadow-md'
                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
                                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-100' : 'text-gray-400 dark:text-gray-500'
                                    }`}>
                                    {new Date(message.created_at).toLocaleTimeString('id-ID', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {isSending && (
                        <div className="flex justify-start">
                            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl px-4 py-3">
                                <Loader2 className="w-5 h-5 animate-spin text-[#034391]" />
                            </div>
                        </div>
                    )}

                    {currentSuggestions.length > 0 && !isSending && (
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800/50 dark:to-blue-900/20 rounded-2xl p-5 shadow-lg">
                            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
                                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#034391] text-white text-xs">💡</span>
                                Rekomendasi pertanyaan
                            </p>
                            <div className="grid grid-cols-1 gap-2">
                                {currentSuggestions.map((suggestion, index) => (
                                    <button
                                        key={`${suggestion}-${index}`}
                                        type="button"
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-4 py-3 text-sm rounded-xl bg-white dark:bg-gray-700/40 text-gray-700 dark:text-gray-100 hover:bg-[#034391]/10 dark:hover:bg-[#034391]/20 hover:text-[#034391] dark:hover:text-[#60a5fa] transition-all duration-200 shadow-sm hover:shadow-md hover:scale-[1.02] cursor-pointer"
                                    >
                                        <span className="flex items-start gap-2">
                                            <span className="text-[#034391] dark:text-[#60a5fa] mt-0.5">→</span>
                                            <span className="flex-1">{suggestion}</span>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="px-6 py-4 bg-white dark:bg-gray-900 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                        <div className="flex-1 flex flex-col gap-2">
                            <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question about your meetings..."
                                disabled={isSending}
                                rows={2}
                                className="flex-1 w-full px-5 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#034391]/20 focus:bg-white dark:focus:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all min-h-20 max-h-40 resize-none overflow-y-auto leading-relaxed"
                            />
                        </div>

                        {/* Agenda Picker with Icon Button */}
                        <div className="relative" ref={agendaPickerRef}>
                            <button
                                type="button"
                                onClick={() => setIsAgendaPickerOpen(!isAgendaPickerOpen)}
                                disabled={isSending || isLoadingFilters}
                                className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#034391]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                title={selectedMeetingId ? 'Change agenda' : 'Select agenda'}
                            >
                                <Filter className="w-5 h-5" />
                            </button>

                            {/* Dropdown Picker */}
                            {isAgendaPickerOpen && (
                                <div className="absolute bottom-full right-0 mb-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    {/* Search Input */}
                                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input
                                                type="text"
                                                value={agendaSearchQuery}
                                                onChange={(e) => setAgendaSearchQuery(e.target.value)}
                                                placeholder="Search agenda..."
                                                className="w-full pl-9 pr-3 py-2 rounded-lg bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#034391]/20"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* Agenda List */}
                                    <div className="max-h-80 overflow-y-auto">
                                        {isLoadingFilters ? (
                                            <div className="p-8 text-center">
                                                <Loader2 className="w-5 h-5 animate-spin text-[#034391] mx-auto" />
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Loading agendas...</p>
                                            </div>
                                        ) : filteredAgendas.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {agendaSearchQuery ? 'No agendas found' : 'No agendas available'}
                                                </p>
                                            </div>
                                        ) : (
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {filteredAgendas.map((agenda) => {
                                                    const year = getYearFromDate(agenda.date);
                                                    return (
                                                        <li key={agenda.id} className="relative">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleSelectAgenda(agenda.id, agenda.agenda)}
                                                                onMouseEnter={() => setHoveredAgendaId(agenda.id)}
                                                                onMouseLeave={() => setHoveredAgendaId(null)}
                                                                className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group ${selectedMeetingId === agenda.id
                                                                    ? 'bg-blue-50 dark:bg-blue-950/30'
                                                                    : ''
                                                                    }`}
                                                            >
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-[#034391] dark:group-hover:text-[#60a5fa] transition-colors">
                                                                        {agenda.agenda}
                                                                    </p>
                                                                </div>
                                                                {year && (
                                                                    <span className="ml-2 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md flex-shrink-0">
                                                                        {year}
                                                                    </span>
                                                                )}
                                                            </button>

                                                            {/* Tooltip */}
                                                            {hoveredAgendaId === agenda.id && (
                                                                <div className="absolute left-4 top-full mt-2 z-50 bg-gray-900 dark:bg-gray-950 text-white text-sm rounded-lg px-3 py-2 max-w-xs whitespace-normal shadow-lg">
                                                                    {agenda.agenda}
                                                                    <div className="absolute bottom-full left-4 w-2 h-2 bg-gray-900 dark:bg-gray-950 transform rotate-45 -mb-1"></div>
                                                                </div>
                                                            )}
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={!input.trim() || isSending}
                            className="bg-[#034391] hover:bg-[#034391]/90 px-3 py-3 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all h-auto flex-shrink-0"
                        >
                            {isSending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </Button>

                        {selectedMeetingId && (
                            <button
                                type="button"
                                onClick={handleResetAgenda}
                                disabled={isSending}
                                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 focus:outline-none focus:ring-2 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                                title="Clear agenda selection"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </form>

                    {/* Selected Agenda Info */}
                    {selectedMeetingId && (
                        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                            Selected: {transcriptOptions.find(t => t.id === selectedMeetingId)?.agenda}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
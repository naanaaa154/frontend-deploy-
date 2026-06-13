import React, { useEffect } from 'react';
import { useChat } from '../hooks/use-chat';
import { Button } from '~/components/ui/button';
import { Plus, MessageSquare } from 'lucide-react';
import { cn } from '~/lib/utils';

export const ChatSessionList: React.FC = () => {
    const {
        sessions,
        currentSessionId,
        isLoading,
        fetchSessions,
        createNewSession,
        setCurrentSession,
    } = useChat();

    useEffect(() => {
        fetchSessions();
    }, []);

    const formatDate = (value?: string | Date) => {
        if (!value) return 'Unknown';
        const date = typeof value === 'string' ? new Date(value) : value;
        if (Number.isNaN(date.getTime())) return 'Unknown';
        return date.toLocaleDateString();
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <Button
                    onClick={createNewSession}
                    className="w-full flex items-center gap-2"
                    disabled={isLoading}
                >
                    <Plus className="w-4 h-4" />
                    New Chat
                </Button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-2">
                {isLoading && sessions.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        <p className="text-sm">Loading sessions...</p>
                    </div>
                ) : sessions.length === 0 ? (
                    <div className="text-center text-gray-500 mt-4">
                        <p className="text-sm">No chat sessions yet</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => setCurrentSession(session.id)}
                                className={cn(
                                    'w-full text-left p-3 rounded-lg transition-colors',
                                    'hover:bg-gray-100 dark:hover:bg-gray-700',
                                    currentSessionId === session.id
                                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                                        : 'border border-transparent'
                                )}
                            >
                                <div className="flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 mt-1 flex-shrink-0 text-gray-500" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {session.agenda || 'New Chat'}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(session.created_at ?? session.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

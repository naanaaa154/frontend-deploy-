import React from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
    Plus,
    MessageSquare,
    Trash2,
    Pin,
    MoreVertical,
    PanelLeftClose,
    PanelLeft,
    Edit2
} from "lucide-react";
import { swal } from "~/lib/swal";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { useChat } from "../hooks/use-chat";
import type { ChatSession } from "../types";

export function ChatSidebar() {
    const { aiId } = useParams();
    const navigate = useNavigate();
    const {
        sessions,
        currentSessionId,
        createNewSession,
        setCurrentSession,
        fetchSessions,
        deleteSession,
        pinSession
    } = useChat();

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [editingId, setEditingId] = React.useState<string | null>(null);
    const [editAgenda, setEditAgenda] = React.useState("");

    React.useEffect(() => {
        fetchSessions();
    }, []);

    const handleNewChat = () => {
        createNewSession();
    };

    const handleDeleteSession = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const result = await swal.fire({
            title: "Hapus percakapan ini?",
            text: "Riwayat chat akan dihapus permanen.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Hapus",
            cancelButtonText: "Batal",
            reverseButtons: true,
        });

        if (!result.isConfirmed) {
            return;
        }

        try {
            await deleteSession(id);
            if (aiId === id || currentSessionId === id) {
                navigate("/dashboard/ai");
            }
            await swal.fire({
                icon: "success",
                title: "Percakapan dihapus",
                timer: 1200,
                showConfirmButton: false,
            });
        } catch (error: any) {
            const message = error?.message || "Gagal menghapus percakapan.";
            await swal.fire({
                icon: "error",
                title: "Gagal",
                text: message,
            });
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const handlePinSession = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        e.stopPropagation();
        const session = sessions.find((item) => item.id === id);
        if (!session) return;
        try {
            await pinSession(id, !session.is_pinned);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Sort sessions by created_at (newest first)
    const sortedSessions = [...sessions].sort((a, b) => {
        const pinA = a.is_pinned ? 1 : 0;
        const pinB = b.is_pinned ? 1 : 0;
        if (pinA !== pinB) {
            return pinB - pinA;
        }
        const timeA = new Date(a.created_at || 0).getTime();
        const timeB = new Date(b.created_at || 0).getTime();
        return timeB - timeA;
    });

    if (!isSidebarOpen) {
        return (
            <div className="w-14 bg-white dark:bg-gray-900 flex flex-col items-center py-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="mb-4 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <PanelLeft className="w-5 h-5" />
                </Button>
            </div>
        );
    }

    return (
        <div className="w-72 bg-white dark:bg-gray-900 flex flex-col shadow-sm">
            {/* Header */}
            <div className="p-4 pb-3 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-gray-900 dark:text-white">Chats</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                        <PanelLeftClose className="w-5 h-5" />
                    </Button>
                </div>
                <Button
                    onClick={handleNewChat}
                    className="w-full flex items-center justify-center gap-2 bg-[#034391] hover:bg-[#034391]/90 text-white rounded-lg shadow-md hover:shadow-lg transition-all"
                    size="sm"
                >
                    <Plus className="w-4 h-4" />
                    New Chat
                </Button>
            </div>

            {/* Session List */}
            <div className="flex-1 overflow-y-auto p-3 pt-2">
                {sortedSessions.length === 0 ? (
                    <div className="text-center py-12 px-4">
                        <MessageSquare className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-700 mb-3" />
                        <p className="text-sm text-gray-400 dark:text-gray-500">
                            No conversations yet
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {sortedSessions.map((session) => (
                            <SessionItem
                                key={session.id}
                                session={session}
                                isActive={aiId === session.id || currentSessionId === session.id}
                                onDelete={handleDeleteSession}
                                onPin={handlePinSession}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

interface SessionItemProps {
    session: ChatSession;
    isActive: boolean;
    onDelete: (e: React.MouseEvent, id: string) => void;
    onPin: (e: React.MouseEvent, id: string) => void;
}

function SessionItem({ session, isActive, onDelete, onPin }: SessionItemProps) {
    const [showActions, setShowActions] = React.useState(false);

    const formatDate = (dateString: string | undefined) => {
        if (!dateString) return "Unknown";
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days < 7) return `${days} days ago`;
        return date.toLocaleDateString();
    };

    return (
        <Link
            to={`/dashboard/ai/${session.id}`}
            className={cn(
                "block p-3 rounded-xl transition-all relative group",
                isActive
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800/30"
            )}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-start gap-3">
                <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                    isActive
                        ? "bg-gradient-to-br from-[#034391] to-[#0256b8] shadow-sm"
                        : "bg-gray-100 dark:bg-gray-800"
                )}>
                    <MessageSquare className={cn(
                        "w-4 h-4",
                        isActive ? "text-white" : "text-gray-400 dark:text-gray-500"
                    )} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        {session.is_pinned && (
                            <Pin className="w-3 h-3 text-[#034391] flex-shrink-0 fill-[#034391]" />
                        )}
                        <h3 className={cn(
                            "text-sm font-medium truncate",
                            isActive ? "text-[#034391] dark:text-white font-semibold" : "text-gray-700 dark:text-gray-300"
                        )}>
                            {session.agenda || 'New Chat'}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                        <span className={cn(
                            "text-xs",
                            isActive ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-500"
                        )}>
                            {formatDate(session.updated_at || session.created_at)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Action buttons */}
            {showActions && (
                <div className="absolute right-2 top-2 flex items-center gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-1">
                    <button
                        onClick={(e) => onPin(e, session.id)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                        title={session.is_pinned ? "Unpin" : "Pin"}
                    >
                        <Pin className={cn(
                            "w-3.5 h-3.5",
                            session.is_pinned ? "text-[#034391] fill-[#034391]" : "text-gray-500"
                        )} />
                    </button>
                    <button
                        onClick={(e) => onDelete(e, session.id)}
                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                </div>
            )}
        </Link>
    );
}

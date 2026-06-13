import React from "react";
import { useParams, useNavigate } from "react-router";
import { AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ChatInterface } from "~/features/ai/components/chat-interface";
import { useChat } from "~/features/ai/hooks/use-chat";

export default function ChatPage() {
    const { aiId } = useParams();
    const navigate = useNavigate();
    const { sessions, setCurrentSession, fetchSessions, fetchSessionMessages } = useChat();

    React.useEffect(() => {
        fetchSessions();
    }, []);

    React.useEffect(() => {
        if (aiId) {
            setCurrentSession(aiId);
            fetchSessionMessages(aiId);
        }
    }, [aiId]);

    const session = sessions.find(s => s.id === aiId);

    if (!session && sessions.length === 0) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center space-y-4">
                    <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Conversation not found
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            This chat session doesn't exist or has been deleted.
                        </p>
                        <Button onClick={() => navigate("/dashboard/ai")}>
                            Back to AI Assistant
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return <ChatInterface />;
}

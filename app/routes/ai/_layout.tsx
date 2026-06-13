import { Outlet } from "react-router";
import { ChatSidebar } from "~/features/ai/components/chat-sidebar";

export default function AILayout() {
    return (
        <div className="flex h-full">
            {/* Chat Sessions Sidebar */}
            <ChatSidebar />

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                <Outlet />
            </div>
        </div>
    );
}
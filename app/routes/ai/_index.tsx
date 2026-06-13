import { ChatInterface } from "~/features/ai/components/chat-interface";

export default function AIIndex() {
  return (
    <div className="flex h-full">
      {/* Main chat area */}
      <div className="flex-1">
        <ChatInterface />
      </div>
    </div>
  );
}

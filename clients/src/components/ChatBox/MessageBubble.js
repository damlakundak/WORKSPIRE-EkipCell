const MessageBubble = ({ message, isOwn }) => {
    const time = new Date(message.timestamp).toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
        <div
          className={`px-4 py-2 rounded-xl max-w-[75%] shadow-sm
            ${isOwn ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}
          `}
        >
          {!isOwn && (
            <div className="text-sm font-semibold mb-1">{message.username}</div>
          )}
          <div className="whitespace-pre-wrap break-words">{message.content}</div>
          <div className="text-xs text-right mt-1 opacity-70">{time}</div>
        </div>
      </div>
    );
  };
  
  export default MessageBubble;
  
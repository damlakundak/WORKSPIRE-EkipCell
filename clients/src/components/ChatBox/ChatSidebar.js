// components/ChatBox/ChatSidebar.js

const ChatSidebar = ({ conversations, onSelect, selected }) => {
    return (
      <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "0.5rem" }}>
        <h4>Sohbetler</h4>
        <div
          onClick={() => onSelect("group")}
          style={{
            cursor: "pointer",
            fontWeight: selected === "group" ? "bold" : "normal",
            marginBottom: "0.5rem",
          }}
        >
          📢 Grup Sohbeti
        </div>
        {conversations.map((email, i) => (
          <div
            key={i}
            onClick={() => onSelect(email)}
            style={{
              cursor: "pointer",
              fontWeight: selected === email ? "bold" : "normal",
              marginBottom: "0.3rem",
            }}
          >
            👤 {email}
          </div>
        ))}
      </div>
    );
  };
  
  export default ChatSidebar;
  
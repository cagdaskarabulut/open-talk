import React, { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

const Home = () => {
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  useEffect(() => {
    socketInitializer();

    return () => {
      socket.disconnect();
    };
  }, []);

  async function socketInitializer() {
    await fetch("/api/socket");

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000");

    socket.on("receive-message", (data) => {
      setAllMessages((pre) => [...pre, data]);
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    socket.emit("send-message", {
      username,
      message,
    });
    setMessage("");
  }

  return (
    <div className="chat-container">
      <div className="header">
        Open Talk - ChatStory: No membership, no limits, free sharing for
        everyone!
      </div>
      <div className="message-list">
        {allMessages.map(({ username, message }, index) => (
          <div key={index} className="message">
            <strong>{username}:</strong> {message}
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit(e)}
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
    </div>
  );
};

export default Home;

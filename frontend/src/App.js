import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import './App.css';

const socket = io('http://localhost:5000');

function App() {
  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState('Connecting...');
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    socket.on('qr', (qr) => {
      setQrCode(qr);
      setStatus('Scan QR Code to Connect');
    });

    socket.on('authenticated', () => {
      setStatus('Authenticated');
    });

    socket.on('ready', () => {
      setStatus('Connected and Ready');
    });

    socket.on('message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (recipient && message) {
      socket.emit('sendMessage', { to: recipient, message });
      setMessage('');
    }
  };

  return (
    <div className="App">
      <h1>WhatsApp Bot</h1>
      <div className="status">Status: {status}</div>
      
      {qrCode && (
        <div className="qr-container">
          <QRCodeSVG value={qrCode} size={256} />
        </div>
      )}

      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className="message">
              <div className="from">{msg.from}</div>
              <div className="body">{msg.body}</div>
              <div className="timestamp">{new Date(msg.timestamp * 1000).toLocaleTimeString()}</div>
            </div>
          ))}
        </div>

        <div className="message-input">
          <input
            type="text"
            placeholder="Recipient"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;

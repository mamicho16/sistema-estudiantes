// components/Message.js
import React, { useState } from 'react';
import './Message.css'; // Make sure to create appropriate CSS for styling

const Message = ({ message }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        if (!message.isRead) {
            message.isRead = true;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className={`message ${isOpen ? 'open' : 'closed'}`} onClick={handleToggle}>
            <div className="message-header">
                <span>{message.sender}</span>
                <span className="toggle-icon">{message.isRead ? '👁️‍🗨️' : '👁'}</span>
            </div>
            {isOpen && (
                <div className="message-body">
                    <p>{message.text}</p>
                    <p>{message.date}</p>
                </div>
            )}
        </div>
    );
};

export default Message;

// components/Message.js
import React, { useState } from 'react';
import './Message.css'; // Make sure to create appropriate CSS for styling

const Message = ({ message }) => {
    const [isOpen, setIsOpen] = useState(message.isRead);

    const handleToggle = () => {
        if (!isOpen) {
            setIsOpen(true);
            message.isRead = true;
        }
    };

    return (
        <div className="message">
            <div onClick={handleToggle} className="message-header">
                <span>{message.sender}</span>
                <span className="toggle-icon">{isOpen ? '👁' : '👁️‍🗨️'}</span>
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
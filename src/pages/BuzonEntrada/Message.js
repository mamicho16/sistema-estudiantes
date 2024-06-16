// components/Message.js
import React, { useState } from 'react';
import './Message.css'; // Make sure to create appropriate CSS for styling
import { updateMessageInFirestore } from "../../contexts/buzon";

const Message = ({ message }) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = async () => {
        if (message.state != 'visto') {
            try {
                // Actualizar el estado del mensaje a 'visto' en Firestore
                //console.log(message.id);
                await updateMessageInFirestore(message.id, { state: 'visto' });
                message.state = 'visto';
            } catch (error) {
                console.error('Error updating document:', error);
            }
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className={`message ${isOpen ? 'open' : 'closed'}`} onClick={handleToggle}>
            <div className="message-header">
                <span>{message.sender}</span>
                <span className="toggle-icon">{message.state === 'visto' ? '👁️‍🗨️' : '👁'}</span>
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

// export default Message;
// const Message = ({ message }) => {
//     const [isOpen, setIsOpen] = useState(false);

//     const handleToggle = () => {
//         if (!message.isRead) {
//             message.isRead = true;
//         }
//         setIsOpen(!isOpen);
//     };

//     return (
//         <div className={`message ${isOpen ? 'open' : 'closed'}`} onClick={handleToggle}>
//             <div className="message-header">
//                 <span>{message.sender}</span>
//                 <span className="toggle-icon">{message.isRead ? '👁️‍🗨️' : '👁'}</span>
//             </div>
//             {isOpen && (
//                 <div className="message-body">
//                     <p>{message.text}</p>
//                     <p>{message.date}</p>
//                 </div>
//             )}
//         </div>
//     );
// };

export default Message;

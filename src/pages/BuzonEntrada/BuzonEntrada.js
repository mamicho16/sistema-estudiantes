import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import Message from './Message';


import './BuzonEntrada.css'; // Make sure to create appropriate CSS for styling

const BuzonEntrada = () => {
    const [messages, setMessages] = useState([
        { id: 1, sender: 'Place Holder Name', text: 'Example open text', date: 'Date - time', isRead: false },
        { id: 2, sender: 'Place Holder Name', text: 'Place holder text', date: 'Date - time', isRead: false },
        // Add more messages as needed
    ]);

    return (
        <>
            <Helmet>
                <title>BuzonEntrada</title>
            </Helmet>
            <div>
                <NavBar titulo="BuzonEntrada" />
                <div className="buzon-container">
                    {messages.map((message) => (
                        <Message key={message.id} message={message} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default BuzonEntrada;
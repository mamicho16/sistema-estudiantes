import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import Message from './Message';
import { addMessageToFirestore, getMessagesFromFirestore  } from "../../contexts/buzon";

import './BuzonEntrada.css'; 

const BuzonEntrada = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await getMessagesFromFirestore();
                setMessages(messages);
            } catch (error) {
                console.error('Error getting messages:', error);
            }
        };
        fetchMessages();
    }, []);

    return (
        <>
            <Helmet>
                <title>BuzonEntrada</title>
            </Helmet>
            <div>
                <NavBar titulo="BuzonEntrada" />
                <div className="buzon-container">
                    {messages.map((message) => {
                        return (
                            <Message
                                key={message.id}
                                message={{
                                    sender: message.emisor,
                                    text: message.contenido,
                                    date: `${message.fecha} - ${message.hora}`
                                }}
                            />
                        );
                    })}
                </div>
            </div>
        </>
    );
};







export default BuzonEntrada;
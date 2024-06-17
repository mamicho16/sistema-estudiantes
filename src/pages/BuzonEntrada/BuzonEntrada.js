import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import Message from './Message';
import { getMessagesByEmail, deleteReadMessages } from "../../contexts/buzon";
import { useAuth } from "../../contexts/auth";
import './BuzonEntrada.css';

const BuzonEntrada = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('todo');

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await getMessagesByEmail(user.email);
                setMessages(messages);
            } catch (error) {
                console.error('Error getting messages:', error);
            }
        };
        fetchMessages();

        
    }, [filter, user.email]);

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleDeleteReadMessages = async () => {
        try {
            await deleteReadMessages(user.email);
            const messages = await getMessagesByEmail(user.email);
            setMessages(messages);
        } catch (error) {
            console.error('Error deleting read messages:', error);
        }
    };

    const filteredMessages = messages.filter((message) => {
        if (filter === 'todo') return true;
        if (filter === 'leido') return message.estado === 'visto';
        if (filter === 'noLeido') return message.estado === 'sent';
        return true;
    });

    const sortedMessages = filteredMessages.sort((a, b) => {
        const dateA = new Date(`${a.fecha} ${a.hora}`);
        const dateB = new Date(`${b.fecha} ${b.hora}`);
        return dateB - dateA;
    });

    return (
        <>
            <Helmet>
                <title>BuzonEntrada</title>
            </Helmet>
            <div>
                <NavBar titulo="BuzonEntrada" />
                <div className="filter-container">
                    <label htmlFor="filter">Filtrar por estado: </label>
                    <select id="filter" value={filter} onChange={handleFilterChange}>
                        <option value="todo">Todo</option>
                        <option value="leido">Leído</option>
                        <option value="noLeido">No leído</option>
                    </select>
                </div>
                <button onClick={handleDeleteReadMessages}>Eliminar todos los mensajes vistos</button>
                <div className="buzon-container">
                    {sortedMessages.map((message) => (
                        <Message
                            key={message.id}
                            message={{
                                email: user.email,
                                id: message.id,
                                state: message.estado,
                                sender: message.emisor,
                                text: message.contenido,
                                date: `${message.fecha} - ${message.hora}`
                            }}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default BuzonEntrada;
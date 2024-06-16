import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import Message from './Message';
import { addMessageToFirestore, getMessagesFromFirestore, getMessagesByEmail, deleteReadMessages } from "../../contexts/buzon";
import { crearContador, getContador, editContador } from "../../contexts/profesor";

import './BuzonEntrada.css'; 

const BuzonEntrada = () => {
    const [messages, setMessages] = useState([]);
    const [filter, setFilter] = useState('todo'); // Estado para el filtro

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const messages = await getMessagesByEmail('aaraya@estudiantec.cr');
                setMessages(messages);
            } catch (error) {
                console.error('Error getting messages:', error);
            }
        };
        fetchMessages();
    }, [filter]); // Dependencia en el estado del filtro

    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    const handleDeleteReadMessages = async () => {
        try {
            await deleteReadMessages('aaraya@estudiantec.cr');
            const messages = await getMessagesByEmail('aaraya@estudiantec.cr');
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
                    {filteredMessages.map((message) => (
                        <Message
                            key={message.id}
                            message={{
                                email: 'aaraya@estudiantec.cr',
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


// const BuzonEntrada = () => {
//     const [messages, setMessages] = useState([]);

//     useEffect(() => {
//         const fetchMessages = async () => {
//             try {
//                 const messages = await getMessagesByEmail('gnunez@estudiantec.cr');
//                 setMessages(messages);
//             } catch (error) {
//                 console.error('Error getting messages:', error);
//             }
//         };
//         fetchMessages();
//     }, []);

//     return (
//         <>
//             <Helmet>
//                 <title>BuzonEntrada</title>
//             </Helmet>
//             <div>
//                 <NavBar titulo="BuzonEntrada" />
//                 <div className="buzon-container">
//                     {messages.map((message) => {
//                         console.log(message);
//                         return (
//                             <Message
//                                 key={message.id}
//                                 message={{
//                                     email: 'gnunez@estudiantec.cr',
//                                     id: message.id,
//                                     state: message.estado,
//                                     sender: message.emisor,
//                                     text: message.contenido,
//                                     date: `${message.fecha} - ${message.hora}`
//                                 }}
//                             />
//                         );
//                     })}
//                 </div>
//             </div>
//         </>
//     );
// };

// 0
// : 
// {email: 'mnavarro@estudiantec.cr'}
// 1
// : 
// {email: 'gnunez@estudiantec.cr'}
// 2
// : 
// {email: 'amolina@estudiantec.cr'}
// 3
// : 
// {email: 'avega@estudiantec.cr'}
// 4
// : 
// {email: 'gfiatt@estudiantec.cr'}
// 5
// : 
// {email: 'jsanchez@estudiantec.cr'}
// 6
// : 
// {email: 'jvillalta@estudiantec.cr'}
// 7
// : 
// {email: 'aaraya@estudiantec.cr'}


// {hora: '0:42:13', emisor: 'John Doe Smith Johnson', contenido: 'This is a new test message.', estado: 'sent', fecha: '2024-06-16'}
// contenido
// : 
// "This is a new test message."
// emisor
// : 
// "John Doe Smith Johnson"
// estado
// : 
// "sent"
// fecha
// : 
// "2024-06-16"
// hora
// : 
// "0:42:13"
// [[Prototype]]
// : 
// Object

// const BuzonEntrada = () => {
//     const [messages, setMessages] = useState([
//         { id: 1, sender: 'Place Holder Name', text: 'Example open text Example open text Example open text Example open textExample open textv Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text', date: 'Date - time', isRead: false },
//         { id: 2, sender: 'Place Holder Name', text: 'Place holder text', date: 'Date - time', isRead: false },
//         // Add more messages as needed
//     ]);

//     const handleAddMessage = async () => {
//         try {
//             const fetchedMessages = await getMessagesByEmail('mnavarro@estudiantec.cr');
//             console.log(fetchedMessages);
//             //await crearContador("mensajeId"); //AE6b1TXG3AGKovYRcHwH
//         } catch (error) {
//             console.error('Error fetching messages:', error);
//         }
//     };
//     return (
//         <>
//             <Helmet>
//                 <title>BuzonEntrada</title>
//             </Helmet>
//             <div>
//                 <NavBar titulo="BuzonEntrada" />
//                 <button onClick={handleAddMessage}>Add Message</button>
//                 <div className="buzon-container">
//                     {messages.map((message) => (
//                         <Message key={message.id} message={message} />
//                     ))}
//                 </div>
//             </div>
//         </>
//     );
// };

// const BuzonEntrada = () => {
//     const [messages, setMessages] = useState([
//         { id: 1, sender: 'Place Holder Name', text: 'Example open text Example open text Example open text Example open textExample open textv Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text Example open text', date: 'Date - time', isRead: false },
//         { id: 2, sender: 'Place Holder Name', text: 'Place holder text', date: 'Date - time', isRead: false },
//         // Add more messages as needed
//     ]);

//     const handleAddMessage = async () => {
//         const nombre = "John";
//         const nombre2 = "Doe";
//         const apellido1 = "Smith";
//         const apellido2 = "Johnson";
//         const date = new Date().toISOString().split('T')[0];
//         const hour = new Date().toLocaleTimeString();
//         const content = "This is a new test message.";
//         const state = "sent";

//         await addMessageToFirestore(nombre, nombre2, apellido1, apellido2, date, hour, content, state);
//     };

//     return (
//         <>
//             <Helmet>
//                 <title>BuzonEntrada</title>
//             </Helmet>
//             <div>
//                 <NavBar titulo="BuzonEntrada" />
//                 <button onClick={handleAddMessage}>Add Message</button>
//                 <div className="buzon-container">
//                     {messages.map((message) => (
//                         <Message key={message.id} message={message} />
//                     ))}
//                 </div>
//             </div>
//         </>
// //     );
// };





export default BuzonEntrada;
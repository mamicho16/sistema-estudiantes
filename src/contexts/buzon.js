
 import { db } from "../firebase/firebase";
 import { setDoc, getDoc,collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
 import { auth } from "../firebase/firebase";
 import { crearContador, getContador, editContador } from "./profesor.js";





export const addMessageToFirestore = async (emisor, date, hour, content) => {
    try {
        const contador = await getContador('mensajeId'); // Adjusted to always fetch 'SJ' for demonstration


        const formatomsg = {
            id: contador.count,
            emisor: emisor,
            fecha: date,
            hora: hour,
            contenido: content,
            estado: "sent"
        };

        const newCount = contador.count + 1;
        await editContador(contador.id, { cont: newCount });

        const emailEstudiantes = await getEstudiantes();

        for (const estudiante of emailEstudiantes) {
            const emailEstudiante = estudiante.email;
            const messageStudentRef = doc(collection(db, 'messageStudent'), emailEstudiante);

            const messageStudentDoc = await getDoc(messageStudentRef);

            let listaMensajes = [];
            if (messageStudentDoc.exists()) {
                listaMensajes = messageStudentDoc.data().listamensajes || [];
            }
            listaMensajes = listaMensajes.filter(msg => contador.count !== msg.id);

            listaMensajes.push(formatomsg);

            await setDoc(messageStudentRef, { correo: emailEstudiante, listamensajes: listaMensajes });
            console.log("MessageStudent updated successfully with new message");
        }
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const deleteReadMessages = async (email) => {
    try {
        const messageStudentRef = collection(db, 'messageStudent');
        const q = query(messageStudentRef, where('correo', '==', email));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(async (doc) => {
            const messageStudent = doc.data();
            const { listamensajes } = messageStudent;

            const readMessages = listamensajes.filter(message => message.estado === 'visto');

            for (const message of readMessages) {
                await deleteDoc(doc.ref);
            }

            const updatedMessages = listamensajes.filter(message => message.estado !== 'visto');
            await setDoc(doc.ref, { correo: email, listamensajes: updatedMessages });
        });

        console.log("Read messages deleted successfully");
    } catch (error) {
        console.error("Error deleting read messages: ", error);
    }
};

export const getMessagesByEmail = async (email) => {
    try {
        const messageStudentRef = doc(collection(db, 'messageStudent'), email);

        const messageStudentDoc = await getDoc(messageStudentRef);

        if (!messageStudentDoc.exists()) {
            console.log("No messages found for this email");
            return [];
        }

        const listaMensajes = messageStudentDoc.data().listamensajes || [];

        return listaMensajes;
    } catch (error) {
        console.error("Error getting messages by email: ", error);
        throw error; 
    }
};


export const getEstudiantes = async () => {
    try {
        const estudiantesCollection = collection(db, 'Estudiantes');

        const querySnapshot = await getDocs(query(estudiantesCollection));

        const estudiantes = [];

        querySnapshot.forEach((doc) => {
            estudiantes.push({
                email: doc.data().email
            });
        });

        console.log("Estudiantes obtenidos y ordenados exitosamente:", estudiantes);
        return estudiantes;
    } catch (error) {
        console.error("Error al obtener y ordenar los estudiantes:", error);
        throw error; 
    }
};

export const getMessagesFromFirestore = async () => {
    try {
        const messagesCollection = collection(db, 'message');
        const messagesSnapshot = await getDocs(messagesCollection);
        const messagesList = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ref: doc.ref,  
            ...doc.data()
        }));
        return messagesList;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw error;
    }
};

export const updateMessageInFirestore = async (email, messageId) => {
    try {
        const messageStudentRef = doc(collection(db, 'messageStudent'), email);

        const messageStudentDoc = await getDoc(messageStudentRef);

        if (!messageStudentDoc.exists()) {
            console.log("No messages found for this email");
            return;
        }

        let listaMensajes = messageStudentDoc.data().listamensajes || [];

        listaMensajes = listaMensajes.map((msg) =>
            
            msg.id === messageId ? { ...msg, estado: 'visto' } : msg
        );

        await setDoc(messageStudentRef, { ...messageStudentDoc.data(), listamensajes: listaMensajes });
        console.log("Message updated successfully");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};


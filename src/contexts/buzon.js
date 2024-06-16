
 import { db } from "../firebase/firebase";
 import { addDoc, setDoc, getDoc,collection, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
 import { auth } from "../firebase/firebase";




 export const addMessageToFirestore = async (nombre, nombre2, apellido1, apellido2, date, hour, content, state) => {
    try {
        const formatomsg = {
            emisor: `${nombre} ${nombre2} ${apellido1} ${apellido2}`,
            fecha: date,
            hora: hour,
            contenido: content,
            estado: state
        };

        await addDoc(collection(db, 'message'), formatomsg);
        console.log("Message added successfully");
    
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};


export const getMessagesFromFirestore = async () => {
    try {
        const messagesCollection = collection(db, 'message');
        const messagesSnapshot = await getDocs(messagesCollection);
        const messagesList = messagesSnapshot.docs.map(doc => ({
            id: doc.id,
            ref: doc.ref,  // Agregar la referencia al documento
            ...doc.data()
        }));

        return messagesList;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw error;
    }
};

export const updateMessageInFirestore = async (messageId, newMessage) => {
    try {
        const messageRef = doc(db, 'message', messageId);
        const updatedMessage = { ...newMessage, estado: 'visto' }; // Actualizar el estado del mensaje a 'visto'
        await updateDoc(messageRef, updatedMessage);
        console.log("Message updated successfully");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};

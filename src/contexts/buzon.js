
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
            ...doc.data()
        }));

        return messagesList;
    } catch (error) {
        console.error("Error getting documents: ", error);
        throw error;  // Re-lanzar el error para manejarlo en el llamado de la función
    }
};
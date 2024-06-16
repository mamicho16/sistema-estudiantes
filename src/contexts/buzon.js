
 import { db } from "../firebase/firebase";
 import { addDoc, setDoc, getDoc,collection, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
 import { auth } from "../firebase/firebase";




//  export const addMessageToFirestore = async (nombre, nombre2, apellido1, apellido2, date, hour, content, state) => {
//     try {
//         const formatomsg = {
//             emisor: `${nombre} ${nombre2} ${apellido1} ${apellido2}`,
//             fecha: date,
//             hora: hour,
//             contenido: content,
//             estado: state
//         };

//         await addDoc(collection(db, 'message'), formatomsg);
//         console.log("Message added successfully");
    
//     } catch (error) {
//         console.error("Error adding document: ", error);
//     }
// };

export const addMessageToFirestore = async (nombre, nombre2, apellido1, apellido2, date, hour, content, state) => {
    try {
        const formatomsg = {
            emisor: `${nombre} ${nombre2} ${apellido1} ${apellido2}`,
            fecha: date,
            hora: hour,
            contenido: content,
            estado: state
        };

        // Agregar el mensaje a la colección 'message'
        const messageDocRef = await addDoc(collection(db, 'message'), formatomsg);
        console.log("Message added successfully");

        // Obtener correos de los estudiantes
        const emailEstudiantes = await getEstudiantes();

        // Para cada correo electrónico de estudiante proporcionado
        for (const estudiante of emailEstudiantes) {
            const emailEstudiante = estudiante.email;
            // Obtener una referencia a la colección 'messageStudent' del estudiante
            const messageStudentRef = doc(collection(db, 'messageStudent'), emailEstudiante);

            // Obtener el documento de 'messageStudent'
            const messageStudentDoc = await getDoc(messageStudentRef);

            // Obtener la lista de mensajes del estudiante o inicializarla si es la primera vez
            let listaMensajes = [];
            if (messageStudentDoc.exists()) {
                listaMensajes = messageStudentDoc.data().listamensajes || [];
            }

            // Agregar el ID del nuevo mensaje a la lista de mensajes del estudiante
            listaMensajes.push(messageDocRef.id);

            // Actualizar el documento 'messageStudent' con la nueva lista de mensajes
            await setDoc(messageStudentRef, { correo: emailEstudiante, listamensajes: listaMensajes });
            console.log("MessageStudent updated successfully with new message");
        }
    } catch (error) {
        console.error("Error adding document: ", error);
    }
};

export const getEstudiantes = async () => {
    try {
        // Obtener una referencia a la colección de estudiantes en Firestore
        const estudiantesCollection = collection(db, 'Estudiantes');

        // Consultar los documentos de la colección
        const querySnapshot = await getDocs(query(estudiantesCollection));

        // Crear un array para almacenar los estudiantes
        const estudiantes = [];

        // Iterar sobre los documentos y agregar los datos de cada estudiante al array
        querySnapshot.forEach((doc) => {
            estudiantes.push({
                email: doc.data().email
            });
        });

        console.log("Estudiantes obtenidos y ordenados exitosamente:", estudiantes);
        return estudiantes;
    } catch (error) {
        console.error("Error al obtener y ordenar los estudiantes:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};

export const getMessagesByEmail = async (emailEstudiante) => {
    try {
        // Obtener la referencia al documento en 'messageStudent' correspondiente al correo del estudiante
        const messageStudentRef = doc(db, 'messageStudent', emailEstudiante);
        
        // Obtener el documento
        const messageStudentDoc = await getDoc(messageStudentRef);

        // Verificar si el documento existe
        if (!messageStudentDoc.exists()) {
            console.log("No messages found for this email");
            return [];
        }

        // Obtener la lista de IDs de mensajes
        const { listamensajes } = messageStudentDoc.data();

        // Obtener los detalles de cada mensaje en la colección 'message'
        const messages = [];
        for (const messageId of listamensajes) {
            const messageDoc = await getDoc(doc(db, 'message', messageId));
            if (messageDoc.exists()) {
                messages.push({ id: messageDoc.id, ...messageDoc.data() });
            } else {
                console.log(`Message with ID ${messageId} does not exist`);
            }
        }

        return messages;
    } catch (error) {
        console.error("Error getting messages: ", error);
        throw error; // Propagar el error para manejarlo en el llamado de la función
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
        const updatedMessage = { ...newMessage, state: 'visto' }; // Actualizar el estado del mensaje a 'visto'
        await updateDoc(messageRef, updatedMessage);
        console.log("Message updated successfully");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};



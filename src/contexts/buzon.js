
 import { db } from "../firebase/firebase";
 import { setDoc, getDoc,collection, getDocs, doc, deleteDoc, query, where } from "firebase/firestore";
 import { auth } from "../firebase/firebase";
 import { crearContador, getContador, editContador } from "./profesor.js";





export const addMessageToFirestore = async (nombre, nombre2, apellido1, apellido2, date, hour, content, state) => {
    try {
        const contador = await getContador('mensajeId'); // Adjusted to always fetch 'SJ' for demonstration


        const formatomsg = {
            id: contador.count,
            emisor: `${nombre} ${nombre2} ${apellido1} ${apellido2}`,
            fecha: date,
            hora: hour,
            contenido: content,
            estado: state
        };

        const newCount = contador.count + 1;
        await editContador(contador.id, { cont: newCount });

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
            listaMensajes.push(formatomsg);

            // Actualizar el documento 'messageStudent' con la nueva lista de mensajes
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

            // Filtrar los mensajes leídos
            const readMessages = listamensajes.filter(message => message.estado === 'visto');

            // Eliminar cada mensaje leído
            for (const message of readMessages) {
                await deleteDoc(doc.ref);
            }

            // Actualizar el documento messageStudent sin los mensajes eliminados
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
        // Obtener una referencia al documento de 'messageStudent' correspondiente al correo electrónico
        const messageStudentRef = doc(collection(db, 'messageStudent'), email);

        // Obtener el documento de 'messageStudent'
        const messageStudentDoc = await getDoc(messageStudentRef);

        if (!messageStudentDoc.exists()) {
            console.log("No messages found for this email");
            return [];
        }

        // Obtener la lista de mensajes del estudiante
        const listaMensajes = messageStudentDoc.data().listamensajes || [];

        // Retornar la lista de mensajes
        return listaMensajes;
    } catch (error) {
        console.error("Error getting messages by email: ", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
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

export const updateMessageInFirestore = async (email, messageId) => {
    try {
        // Obtener una referencia al documento de 'messageStudent' correspondiente al correo electrónico
        const messageStudentRef = doc(collection(db, 'messageStudent'), email);

        // Obtener el documento de 'messageStudent'
        const messageStudentDoc = await getDoc(messageStudentRef);

        if (!messageStudentDoc.exists()) {
            console.log("No messages found for this email");
            return;
        }

        // Obtener la lista de mensajes del estudiante
        let listaMensajes = messageStudentDoc.data().listamensajes || [];

        // Actualizar el estado del mensaje específico en la lista
        listaMensajes = listaMensajes.map((msg) =>
            
            msg.id === messageId ? { ...msg, estado: 'visto' } : msg
        );

        // Actualizar el documento 'messageStudent' con la nueva lista de mensajes
        await setDoc(messageStudentRef, { ...messageStudentDoc.data(), listamensajes: listaMensajes });
        console.log("Message updated successfully");
    } catch (error) {
        console.error("Error updating document: ", error);
    }
};


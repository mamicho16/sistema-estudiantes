import React, { useState, useContext, useEffect, createContext } from "react";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, query, where, getDocs, getFirestore, updateDoc} from "firebase/firestore";
import { doc, setDoc, getDoc } from "firebase/firestore";



export const uploadFileAndSaveReference = async (file, nameSede) => {
    try {
        // Obtener una referencia al Storage service
        const storage = getStorage();
        console.log(file.name);

        // Crear una referencia a la ubicación donde se almacenará el archivo
        const fileRef = ref(storage, `/excel/${nameSede}.xlsx`);

        // Subir el archivo
        await uploadBytes(fileRef, file);

        // Obtener una referencia a la colección en Firestore
        const archivosCollection = collection(db, 'archivos');

        // Buscar si ya existe un documento con la misma sede
        const querySnapshot = await getDocs(query(collection(db, 'archivos'), where('sede', '==', nameSede)));


        if (!querySnapshot.empty) {
            // Si ya existe un documento con la misma sede, actualizarlo
            const docSnapshot = querySnapshot.docs[0]; // Suponiendo que solo habrá uno
            await updateDoc(docSnapshot.ref, {
                archivoRef: `/excel/${nameSede}.xlsx`
            });
            return docSnapshot.ref;
        } else {
            // Si no existe un documento con la misma sede, agregar uno nuevo
            const docRef = await addDoc(archivosCollection, {
                sede: nameSede,
                archivoRef: `/excel/${nameSede}.xlsx`
            });
            return docRef;
        }

    } catch (error) {
        console.error("Error al subir el archivo:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};

export const obtenerEstudiantes = async () => {
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
                nombre: doc.data().nombre,
                apellido1: doc.data().apellido1,
                apellido2: doc.data().apellido2,
                email: doc.data().email,
                celular: doc.data().celular,
                sede: doc.data().sede // Asegúrate de que este campo exista en tus documentos
                // Agrega más campos si es necesario
            });
        });

        // Ordenar los estudiantes por la sede
        estudiantes.sort((a, b) => {
            if (a.sede < b.sede) return -1;
            if (a.sede > b.sede) return 1;
            return 0;
        });

        console.log("Estudiantes obtenidos y ordenados exitosamente:", estudiantes);
        return estudiantes;
    } catch (error) {
        console.error("Error al obtener y ordenar los estudiantes:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};

export const obtenerEstudiantesPorSede = async (namesede) => {
    try {
        // Obtener una referencia a la colección de estudiantes en Firestore
        const estudiantesCollection = collection(db, 'Estudiantes');

        // Consultar los documentos de la colección
        const querySnapshot = await getDocs(query(estudiantesCollection, where("sede", "==", namesede)));

        // Crear un array para almacenar los estudiantes
        const estudiantes = [];

        // Iterar sobre los documentos y agregar los datos de cada estudiante al array
        querySnapshot.forEach((doc) => {
            estudiantes.push({
                nombre: doc.data().nombre,
                apellido1: doc.data().apellido1,
                apellido2: doc.data().apellido2,
                email: doc.data().email,
                celular: doc.data().celular,
                sede: doc.data().sede // Asegúrate de que este campo exista en tus documentos
                // Agrega más campos si es necesario
            });
        });

        // Ordenar los estudiantes por la sede
        estudiantes.sort((a, b) => {
            if (a.sede < b.sede) return -1;
            if (a.sede > b.sede) return 1;
            return 0;
        });

        console.log("Estudiantes obtenidos y ordenados exitosamente:", estudiantes);
        return estudiantes;
    } catch (error) {
        console.error("Error al obtener y ordenar los estudiantes:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};

export const uploadEstudiantesSede = async (columns, nameSede) => { 
    try {
        // Obtener una referencia a la colección en Firestore
        

        // Iterar sobre los datos de las columnas para subir cada estudiante
        for (let i = 0; i < columns[0].length; i++) {
            const nombre = columns[0][i];
            const apellido1 = columns[1][i];
            const apellido2 = columns[2][i];
            const correo = columns[3][i]; // Asumiendo que hay un tercer dato
            const celular = columns[4][i];
            const password = columns[5][i];


            // Verificar si el correo ya existe en la base de datos
            //const querySnapshot = await getDocs(query(estudiantesCollection, where('correo', '==', correo)));

            /*
            if (!querySnapshot.empty) {
                console.log(`El correo ${correo} ya existe en la base de datos. No se subirá este estudiante.`);
                continue; // Saltar al siguiente estudiante
            }
            */

            const infouser = await createUserWithEmailAndPassword(auth, correo, password).then((userCredential) => {
                return userCredential;
            });
            const user = infouser.user;

            const docuRef = doc(db, `Estudiantes/${user.uid}`);

            // Agregar el nuevo estudiante si el correo no existe
            setDoc(docuRef, {
                nombre: nombre,
                apellido1: apellido1,
                apellido2: apellido2,
                email: correo,
                password: password,
                celular: celular,
                sede: nameSede,
                foto : ""
            });

            console.log("Documento agregado con ID: ", docuRef);
        }

        return true;
    } catch (error) {
        console.error("Error al subir el archivo:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
}



export const obtenerExcel = async (nameSede) => {
    try {
        // Obtener una referencia a la colección en Firestore
        const archivosCollection = collection(db, 'archivos');

        // Consultar los documentos donde el campo 'sede' sea igual al nombre de la sede
        const querySnapshot = await getDocs(query(archivosCollection, where("sede", "==", nameSede)));

        // Obtener los datos del primer documento encontrado
        let archivo = null;
        querySnapshot.forEach((doc) => {
            archivo = {
                archivoRef: doc.data().archivoRef,
                sede: doc.data().sede
            };
            // Solo necesitamos el primero, así que salimos del bucle después de encontrar uno
            return;
        });
        if (!archivo) {
            throw new Error("No se encontraron archivos para la sede especificada.");
        }
        const storage = getStorage();
        const fileRef = ref(storage, archivo.archivoRef);
        const fileUrl = await getDownloadURL(fileRef);

        // Descargar el archivo y retornarlo como un objeto File
        const response = await fetch(fileUrl);
        const blob = await response.blob();
        const file = new File([blob], archivo.archivoRef);

        console.log("Archivo descargado exitosamente:", file);
        return file;
    } catch (error) {
        console.error("Error al cargar los archivos:", error);
        //throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};


export const obtenerTodosLosExcels = async () => {
    try {
        // Obtener una referencia a la colección en Firestore
        const archivosCollection = collection(db, 'archivos');

        // Obtener todos los documentos de la colección
        const querySnapshot = await getDocs(archivosCollection);

        // Obtener los datos de los documentos y devolverlos
        const archivos = [];
        for (const doc of querySnapshot.docs) {
            const archivo = {
                archivoRef: doc.data().archivoRef,
                sede: doc.data().sede
            };
            archivos.push(archivo);
        }

        // Descargar todos los archivos y retornarlos como objetos File
        const storage = getStorage();
        const archivosDescargados = await Promise.all(archivos.map(async (archivo) => {
            const fileRef = ref(storage, archivo.archivoRef);
            const fileUrl = await getDownloadURL(fileRef);
            const response = await fetch(fileUrl);
            const blob = await response.blob();
            return new File([blob], archivo.archivoRef);
        }));

        console.log("Archivos descargados exitosamente:", archivosDescargados);
        return archivosDescargados;
    } catch (error) {
        console.error("Error al obtener todos los archivos:", error);
        //throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};


export const updateUserData = async (profileData) => {
    const collections = ['Admins', 'Profesores', 'Estudiantes'];
    let userDocRef = null;

    for (const collectionName of collections) {
    const currentCollection = collection(db, collectionName);
    const q = query(currentCollection, where("email", "==", profileData.email));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        userDocRef = querySnapshot.docs[0].ref;
        break;
    }
    }

    if (userDocRef) {
    try {
        await updateDoc(userDocRef, {
        nombre: profileData.nombre,
        apellido1: profileData.apellido1,
        apellido2: profileData.apellido2,
        celular: profileData.celular,
        nombre2: profileData.nombre2,
        sede: profileData.sede
        });
        console.log('User data updated successfully');
    } catch (error) {
        console.error('Error updating user data:', error);
    }
    } else {
    console.log("No se encontró el documento del usuario en ninguna colección");
    }
};

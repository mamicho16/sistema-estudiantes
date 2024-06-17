import React, { useState, useContext, useEffect, createContext } from "react";
import { auth, db, storage } from "../firebase/firebase";
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

export const uploadEstudiantesSede = async (estudiantes, nameSede) => {
    try {
        // Iterar sobre los datos de los estudiantes para subir cada uno
        for (let i = 0; i < estudiantes.length; i++) {
            const estudiante = estudiantes[i];

            // Verificar si el correo ya existe en la base de datos
            // const querySnapshot = await getDocs(query(estudiantesCollection, where('correo', '==', estudiante.email)));

            /*
            if (!querySnapshot.empty) {
                console.log(`El correo ${estudiante.email} ya existe en la base de datos. No se subirá este estudiante.`);
                continue; // Saltar al siguiente estudiante
            }
            */

            const infouser = await createUserWithEmailAndPassword(auth, estudiante.getEmail(), estudiante.getCarne())
                .then((userCredential) => {
                    return userCredential;
                });

            const user = infouser.user;

            const docuRef = doc(db, `Estudiantes/${user.uid}`);

            // Agregar el nuevo estudiante si el correo no existe
            await setDoc(docuRef, {
                nombre: estudiante.getNombre(),
                apellido1: estudiante.getApellido(),
                apellido2: '', // Asumiendo que el segundo apellido no está disponible
                email: estudiante.getEmail(),
                password: estudiante.getCarne(),
                celular: '', // Asumiendo que el celular no está disponible
                sede: nameSede,
                foto: ""
            });

            console.log("Documento agregado con ID: ", docuRef.id);
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
    try {
        console.log(profileData);
        const collections = ['Admins', 'Profesores', 'Estudiantes'];
        let updated = false;

        const filteredProfileData = { ...profileData }; // Copia para modificarla sin afectar la original

        // Si hay una nueva foto, subimos la foto a Firebase Storage y guardamos la URL de descarga en Firestore
        if (profileData.fotoFile) {
            const photoRef = ref(storage, `profilePhotos/${profileData.uid}`);
            await uploadBytes(photoRef, profileData.fotoFile);
            const photoURL = await getDownloadURL(photoRef);
            filteredProfileData.foto = photoURL;
            delete filteredProfileData.fotoFile; // Eliminamos el campo fotoFile para evitar problemas
        }

        for (const collectionName of collections) {
            const currentCollection = collection(db, collectionName);
            const q = query(currentCollection, where("email", "==", profileData.email));
            const querySnapshot = await getDocs(q);
            
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userDocRef = userDoc.ref;
                const userData = userDoc.data();
                console.log(`Found user in collection ${collectionName}:`, userData);

                await setDoc(userDocRef, filteredProfileData, { merge: true });

                console.log(`User data updated successfully in collection: ${collectionName}`);
                updated = true;
                break;
            }
        }

        if (!updated) {
            console.log("No se encontró el documento del usuario en ninguna colección");
        }
    } catch (error) {
        console.error('Error updating user data:', error);
    }
};
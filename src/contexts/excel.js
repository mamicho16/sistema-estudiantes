import React, { useState, useContext, useEffect, createContext } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from "../firebase/firebase";
import { collection, addDoc, query, where, getDocs, getFirestore, updateDoc} from "firebase/firestore";




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




import React, { useState, useContext, useEffect, createContext } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase/firebase";
import { collection, addDoc, query, where, getDocs, getFirestore } from "firebase/firestore";




export const uploadFileAndSaveReference = async (file, nameSede) => {
    try {
        // Obtener una referencia al Storage service
        const storage = getStorage();
        console.log(file.name);

        // Crear una referencia a la ubicación donde se almacenará el archivo
        const fileRef = ref(storage, "/excel/archivo.xlsx");

        // Subir el archivo
        await uploadBytes(fileRef, file);

        // Obtener una referencia a la colección en Firestore
        const archivosCollection = collection(db, 'archivos');

        // Agregar un documento con la referencia al archivo en Firestore
        const docRef = await addDoc(archivosCollection, {
            nombre: file.name,
            sede: nameSede,
            archivoRef: "/excel/" // Guardar la referencia del archivo en Firestore
        });
        

        return docRef;

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

        // Obtener los datos de los documentos y devolverlos
        const archivos = [];
        querySnapshot.forEach((doc) => {
            archivos.push({
                id: doc.id,
                data: doc.data()
            });
        });

        console.log("Archivos obtenidos exitosamente:", archivos);
        return archivos;
    } catch (error) {
        console.error("Error al cargar los archivos:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
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
        querySnapshot.forEach((doc) => {
            archivos.push({
                id: doc.id,
                data: doc.data()
            });
        });

        console.log("Todos los archivos obtenidos exitosamente:", archivos);
        return archivos;
    } catch (error) {
        console.error("Error al obtener todos los archivos:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};



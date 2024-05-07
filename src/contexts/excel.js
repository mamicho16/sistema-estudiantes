import React, { useState, useContext, useEffect, createContext } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase/firebase";
import { getFirestore, collection, addDoc } from "firebase/firestore";




export const uploadFileAndSaveReference = async (file) => {
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
            archivoRef: "/excel/" // Guardar la referencia del archivo en Firestore
        });
        

        return docRef;

    } catch (error) {
        console.error("Error al subir el archivo:", error);
        throw error; // Propagar el error para que sea manejado por el código que llama a esta función
    }
};

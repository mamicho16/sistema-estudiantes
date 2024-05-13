import React, { useState, useContext, useEffect, createContext } from "react";
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { db } from "../firebase/firebase";
import { collection, addDoc, query, where, getDocs, getFirestore, serverTimestamp, orderBy } from "firebase/firestore";




export const guardarComentario = async (emailUsuario, texto, actividad) => {
    try {
        const comentariosCollection = collection(db, 'comentarios');

        const docRef = await addDoc(comentariosCollection, {
            emailUsuario: emailUsuario,
            texto: texto,
            actividad: actividad,
            fecha: serverTimestamp()
        });

        console.log("Comentario guardado exitosamente:", docRef.id);
        return docRef.id;
    } catch (error) {
        console.error("Error al guardar el comentario:", error);
        throw error;
    }
};





export const obtenerComentariosPorActividad = async (idActividad) => {
    try {
        const comentariosCollection = collection(db, 'comentarios');

        const querySnapshot = await getDocs(query(comentariosCollection, where("actividad", "==", idActividad)));

        //console.log("querySnap: ", querySnapshot);

        const comentarios = [];
        querySnapshot.forEach((doc) => {
            //console.log(doc.metadata.createTime.toDate());
            comentarios.push({
                id: doc.id,
                emailUsuario: doc.data().emailUsuario,
                texto: doc.data().texto,
                actividad: doc.data().actividad, 
                fecha: doc.data().fecha
            });
        });

        comentarios.sort((a, b) => a.fecha - b.fecha);

        console.log("Comentarios obtenidos exitosamente:", comentarios);
        return comentarios;
    }
    catch(error) {
        console.error("Error al obtener los comentarios del usuario:", error);
        throw error;
    }
};
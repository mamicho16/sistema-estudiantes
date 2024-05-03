import React, { useState, useContext, useEffect, createContext } from "react";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth debe ser usado dentro de un AuthProvider");
    }
    return context;
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return unsubscribe; 
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userinfo = userCredential.user;
    
            if (!userinfo.uid) {
                throw new Error("UID del usuario no está disponible");
            }
    
            const docuSnap = await loginProfesores(userinfo.uid);
    
            if (!docuSnap) {
                throw new Error("No se pudieron obtener los datos del profesor");
            }
    
            const usuariofirebase = {
                uid: userinfo.uid,
                email: userinfo.email,
                nombre: docuSnap.nombre,
                nombre2: docuSnap.nombre2,
                apellido1: docuSnap.apellido1,
                apellido2: docuSnap.apellido2,
                codigo: docuSnap.codigo,
                celular: docuSnap.celular,
                numOficina: docuSnap.numOficina,
                foto: docuSnap.foto,
                coordinador: docuSnap.coordinador,
                estado: docuSnap.estado                
            }
    
            setUser(usuariofirebase);
    
            return true; 
        } catch (error) {
            console.error("Error en el login:", error);
            return false;
        }
    };
    
    const loginProfesores = async (uid) => {
        const docuRef = doc(db, `Profesores/${uid}`);
        const docuSnap = await getDoc(docuRef);
        if (docuSnap.exists()) {
            console.log("Datos del profesor:", docuSnap.data());
            return docuSnap.data();
        } else {
            console.log("No se encontró el documento del profesor");
            return null;
        }
    }

    const register = async (email, password) => {
        try {
            const infouser = await createUserWithEmailAndPassword(auth, email, password).
            then((userCredential) => {
                return userCredential;
            });
            const user = infouser.user;
            const docuRef = doc(db, `Profesores/${user.uid}`);
            setDoc(docuRef, {
                email: email,
                nombre: "Ericka",
                nombre2: "",
                apellido1: "Solano",
                apellido2: "Fernández",
                codigo: "SA-01",
                celular: "88888888",
                numOficina: "1",
                foto : "",
                coordindor: true,
                estado: "activo"
            });

        } catch (error) {
            console.log(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
        }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default { AuthContext };
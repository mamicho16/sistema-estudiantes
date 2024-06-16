import React, { useState, useContext, useEffect, createContext } from "react";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc, collection, getDocs, query, where} from "firebase/firestore";

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
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                fetchUserDetails(firebaseUser.uid);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return unsubscribe; 
    }, []);

    async function fetchUserDetails(uid) {
        setLoading(true);
        const userDetails = await getUserDetailsCacheOrFirebase(uid);
        setUser(userDetails);
        setLoading(false);
    }

    async function getUserDetailsCacheOrFirebase(uid) {
        // Obtener el usuario de la caché si está disponible
        let userDetails = localStorage.getItem("userDetails");
        // Si no hay usuario en la caché, obtenerlo de Firebase
        if (!userDetails) {
            let docSnap = await loginProfesores(uid);
            if (!docSnap) {
                docSnap = await loginAdmins(uid);
            }
            if (!docSnap) {
                docSnap = await loginEstudiante(uid);
            }
            // Si se encontró el documento, almacenarlo en la caché
            if (docSnap) {
                localStorage.setItem("userDetails", JSON.stringify(docSnap));
                return docSnap;
            // Si no se encontró el documento, devolver nulo
            } else {
                return null;
            }
        // Si hay usuario en la caché, devolverlo
        } else {
            return JSON.parse(userDetails);
        }
    }

    const login = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const userinfo = userCredential.user;

        if (!userinfo.uid) {
            throw new Error("UID del usuario no está disponible");
        }

        let docuSnap = await loginProfesores(userinfo.uid);  // Intenta obtener datos como profesor

        if (!docuSnap) {
            docuSnap = await loginAdmins(userinfo.uid);  // Si no es profesor, intenta como administrador
        }

        if (!docuSnap) {
            docuSnap = await loginEstudiante(userinfo.uid);  // Si no es profesor, intenta como administrador
        }

        if (!docuSnap) {
            throw new Error("No se pudieron obtener los datos del usuario");
        }

        let usuariofirebase;

        // Verifica si el documento contiene el campo 'coordinador'
        if (docuSnap.hasOwnProperty("coordinador")) {
            usuariofirebase = {
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
                estado: docuSnap.estado,
                sede: docuSnap.sede                
            };
        } else if (docuSnap.hasOwnProperty("estudiante")) {
            usuariofirebase = {
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
                estudiante: docuSnap.estudiante,
                estado: docuSnap.estado,
                sede: docuSnap.sede                
            };
        }
        else{
            usuariofirebase = {
                uid: userinfo.uid,
                email: userinfo.email,
                nombre: docuSnap.nombre,
                nombre2: docuSnap.nombre2,
                apellido1: docuSnap.apellido1,
                apellido2: docuSnap.apellido2,
                celular: docuSnap.celular,
                sede: docuSnap.sede
            };
        }
        console.log(usuariofirebase);

        setUser(usuariofirebase);  // Establece los datos del usuario en la sesión o donde corresponda

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

    const loginAdmins = async (uid) => {
        const docuRef = doc(db, `Admins/${uid}`);
        const docuSnap = await getDoc(docuRef);
        if (docuSnap.exists()) {
            console.log("Datos del administrador:", docuSnap.data());
            return docuSnap.data();
        } else {
            console.log("No se encontró el documento del administrador");
            return null;
        }
    }

    const loginEstudiante = async (uid) => {
        const docuRef = doc(db, `Estudiantes/${uid}`);
        const docuSnap = await getDoc(docuRef);
        if (docuSnap.exists()) {
            console.log("Datos del estudiante:", docuSnap.data());
            return docuSnap.data();
        } else {
            console.log("No se encontró el documento del estudiante");
            return null;
        }
    }

    const register = async (email, password) => {
        try {
            const infouser = await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                return userCredential;
            });
            const user = infouser.user;
            const docuRef = doc(db, `Profesores/${user.uid}`);
            setDoc(docuRef, {
                email: email,
                nombre: "Rafael",
                nombre2: "Mauricio",
                apellido1: "Arroyo",
                apellido2: "Herrera",
                codigo: "CA-01",
                celular: "88888888",
                numOficina: "1",
                foto : "",
                coordindor: false,
                estado: "activo"
            });

        } catch (error) {
            console.log(error);
        }
    };

    const registerAdmin = async (email, password) => {
        try {
            const infouser = await createUserWithEmailAndPassword(auth, email, password).then((userCredential) => {
                return userCredential;
            });
            const user = infouser.user;
            const docuRef = doc(db, `Admins/${user.uid}`);
            setDoc(docuRef, {
                email: email,
                nombre : "Ariana",
                nombre2 : "",
                apellido1 : "Guillen",
                apellido2 : "Masis",
                celular : "12345678",
                sede : "San Jose",
            });

        } catch (error) {
            console.log(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setUser(null);
            localStorage.removeItem("userDetails");
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    };

    const actualizarUser = async (email) => {
        const collections = ["Profesores", "Admins", "Estudiantes"];
    
        for (const collectionName of collections) {
            const q = query(collection(db, collectionName), where("email", "==", email));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                const userDoc = querySnapshot.docs[0];
                const userData = userDoc.data();
                setUser(userData);
                localStorage.setItem("userDetails", JSON.stringify(userData));
                break;
            }
        }
    }; 

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout,
            registerAdmin,
            fetchUserDetails,
            actualizarUser
        }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export default { AuthContext };
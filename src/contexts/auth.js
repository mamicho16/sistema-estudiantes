import React, { useState, useContext, useEffect, createContext } from "react";
import { auth, db } from "../firebase/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

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
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log(error);
        }
    };

    const register = async (email, password) => {
        try {
            const infouser = await createUserWithEmailAndPassword(auth, email, password).
            then((userCredential) => {
                const user = userCredential.user;
                console.log(user.uid);
            });

            const docuRef = doc(db, `Profesores/${user.uid}`);
            setDoc(docuRef, {
                email: email,
                password: password,
                role: "coordinador"
            });

        } catch (error) {
            console.log(error);
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setUser(user);
        });
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            login,
            register,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default { AuthContext };
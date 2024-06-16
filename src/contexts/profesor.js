
 import { db,storage } from "../firebase/firebase";
 import { addDoc, setDoc, getDoc,collection, getDocs, updateDoc, doc, deleteDoc, query, where } from "firebase/firestore";
import { createUserWithEmailAndPassword} from "firebase/auth";
import { auth } from "../firebase/firebase";



 //addProfessorToFirestore(name, photo, sede, correo, numeroOficina, telefono);

// export const createprofesor = (name, photo, sede, correo, numeroOficina, telefono) => {
//      addProfessorToFirestore(name, photo, sede, correo, numeroOficina, telefono);
//     console.log("XD");
// }



function isValidProfessor(name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado) {
    const validSedes = ['San Jose', 'Cartago', 'Limon', 'Alajuela', 'San Carlos'];
    const hasValidName = typeof name === 'string' && name.trim() !== '' && typeof nombre2 === 'string' || nombre2 === null && typeof apellido1 === 'string' && apellido1.trim() !== '' && typeof apellido2 === 'string'  || nombre2 === null ;
    const hasValidPhoto = typeof photo === 'string' || photo === null || photo === undefined;
    const hasValidSede = validSedes.includes(sede);
    const hasValidEmail = typeof correo === 'string' && correo.trim() !== '';
    const hasValidOfficeNumber = typeof numeroOficina === "string";
    const hasValidCellNumber = isValidPhoneNumber(telefono);
    const hasValidCoordinador = typeof coordinador === "boolean";
    const hasValidestado = typeof estado === "boolean";
    console.log(hasValidName, hasValidPhoto, hasValidSede, hasValidEmail, hasValidOfficeNumber, hasValidCellNumber, hasValidCoordinador, hasValidestado);

    return hasValidName && hasValidPhoto && hasValidSede && hasValidEmail && hasValidOfficeNumber && hasValidCellNumber && hasValidestado && hasValidCoordinador;
    //return hasValidName && hasValidPhoto && hasValidSede && hasValidEmail && hasValidOfficeNumber && hasValidCellNumber && hasValidCoordinador && hasValidestado ;
}

function isValidPhoneNumber(phone) {
    	if (phone.length === 8){return true;} else {return false;}
}


async function formatProf(name, photo, campus, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado, uid){
    let codigo
    let numOficina = numeroOficina.substring(0, 4) + '-' +numeroOficina.substring(4);
    let teleCelular = telefono.substring(0, 4) + '-' +telefono.substring(4);
    if(campus === "San Jose"){ 

        const counterData = await getContador('SJ'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `SJ-${counterData.count}`;}

        // const counterData = await getContador('SJ'); // Adjusted to always fetch 'SJ' for demonstration
        // const newCount = counterData.count + 1;
        // await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        // codigo = `SJ-${counterData.count}`;}
        
    else if(campus === "Cartago"){ 
        const counterData = await getContador('CA'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `CA-${counterData.count}`;
    }
    else if(campus === "San Carlos"){
        const counterData = await getContador('SC'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `SC-${counterData.count}`;}
    else if(campus === "Alajuela"){
        const counterData = await getContador('AL'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `AL-${counterData.count}`;}
    else if(campus === "Limon"){
        const counterData = await getContador('LI'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `LI-${counterData.count}`;}
    return {
        nombre: name,
        nombre2: nombre2,
        apellido1: apellido1,
        apellido2: apellido2,
        foto: photo,
        sede: campus,
        email: correo,
        numOficina: numOficina,
        celular: teleCelular,
        codigo: codigo,
        coordinador: coordinador,
        estado: estado,
    };
}

async function editProfesores(id, newField){
    try{
        updateDoc(doc(db, 'Profesores', id),newField);
    }
    catch(error){
        console.error("Error updating Profesores: ", error);
    }

}

export const updateProfessor = async (codigoUnico, updatedData) => {
    // Verificación inicial para asegurarse de que el código no es undefined
    if (!codigoUnico) {
        console.error("Provided 'codigoUnico' is undefined");
        throw new Error("Invalid 'codigoUnico' provided. It must not be undefined.");
    }

    const professorsRef = collection(db, "Profesores");
    const q = query(professorsRef, where("codigo", "==", codigoUnico));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents found with code:", codigoUnico);
            throw new Error("No matching professor found to update");
        }

        // Asumiendo que el código es único, solo debería haber un documento.
        querySnapshot.forEach(async (document) => {
            const professorRef = document.ref;
            console.log("Updating professor with code:", document.data());
            updatedData = formatUpdateProfessor(updatedData);
            console.log("New professor data:", updatedData);
            await updateDoc(professorRef, updatedData);
            console.log("Professor updated successfully with code:", codigoUnico);
        });
    } catch (error) {
        console.error("Error updating professor: ", error);
        throw new Error("Failed to update professor");
    }
};

export const formatUpdateProfessor = (profesor) => {
    // Divide el nombre completo en partes
    const parts = profesor.name.split(" ");

    // Asegúrate de que hay suficientes partes para llenar los campos requeridos
    const nombre = parts[0] || ""; // Primer nombre
    const nombre2 = parts.length > 1 ? parts[1] : ""; // Segundo nombre, si existe
    const apellido1 = parts.length > 2 ? parts[2] : ""; // Primer apellido
    const apellido2 = parts.length > 3 ? parts[3] : ""; // Segundo apellido

    return {
        email: profesor.email,
        nombre: nombre,
        nombre2: nombre2,
        apellido1: apellido1,
        apellido2: apellido2,
        celular: profesor.cellNumber,
        numOficina: profesor.officeNumber,
        coordinador: profesor.coordinador || false, // Asume falso si no está especificado
        sede: profesor.location.trim() // Elimina espacios adicionales
    };
};

export const darBaja = async (codigoUnico) => {
    // Verificación inicial para asegurarse de que el código no es undefined
    if (!codigoUnico) {
        console.error("Provided 'codigoUnico' is undefined");
        throw new Error("Invalid 'codigoUnico' provided. It must not be undefined.");
    }

    const professorsRef = collection(db, "Profesores");
    const q = query(professorsRef, where("codigo", "==", codigoUnico));

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("No matching documents found with code:", codigoUnico);
            throw new Error("No matching professor found to delete");
        }

        // Asumiendo que el código es único, solo debería haber un documento.
        querySnapshot.forEach(async (document) => {
            const professorRef = document.ref;
            console.log("Deleting professor with code:", document.data());
            await updateDoc(professorRef, { estado: false });
            console.log("Professor inactive successfully with code:", codigoUnico);
        });
    } catch (error) {
        console.error("Error deleting professor: ", error);
        throw new Error("Failed to delete professor");
    }
};

export const addProfessorToFirestore = async (name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado, password) => {
    if (isValidProfessor(name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado)) {
        //const professorCode = await incrementProfessorCounter(); // This ensures the code is incremented
        try {
            // Creación de usuario
            const user = await createUserWithEmailAndPassword(auth, correo, password);
            //formatted professor
            const formatProfessor = await formatProf(name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado);
           // add professor to firestore
            const docRef = doc(db, `Profesores/${user.user.uid}`);
            setDoc(docRef, formatProfessor);
    
        } catch (error) {
            console.error("Error adding document or creating user: ", error);
        }
    } else {
        console.error("Invalid professor data");
    }
};


export const getProfessors = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'Profesores'));
      const professorsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return professorsList; // Returns an array of professors
    } catch (error) {
      console.error("Error fetching documents: ", error);
      return []; // Returns an empty array in case of error
    }
  };


  export const crearContador = async (name) => {
        try {
          let contador = {
                Name: name,
                cont: 1}
           const docRef =  addDoc(collection (db,'Contador'),contador);



            //const docRef = await db.collection('professors').add(formatProfessor);
            console.log("Contador added with ID: ", (await docRef).id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
};

export async function getContador(name) {
    try {
        const snapshot = await getDocs(collection(db, 'Contador'));
        const doc = snapshot.docs.find(doc => doc.data().Name === name);
        return doc ? { id: doc.id, count: doc.data().cont } : null; // Returns the document ID and count if found
    } catch (error) {
        console.error("Error fetching contador: ", error);
        return null;
    }
}

export async function editContador(id, newField){
    try{
        updateDoc(doc(db, 'Contador', id),newField);
    }
    catch(error){
        console.error("Error updating contador: ", error);
    }

}

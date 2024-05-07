
 import {db } from "../firebase/firebase";
 import { addDoc, setDoc, getDoc,collection, getDocs, updateDoc, doc, deleteDoc } from "firebase/firestore";

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
    const hasValidOfficeNumber = isValidPhoneNumber(numeroOficina);
    const hasValidCellNumber = isValidPhoneNumber(telefono);
    const hasValidCoordinador = typeof coordinador === "boolean";
    const hasValidestado = typeof estado === 'string' && estado.trim() !== '' 

    return hasValidName && hasValidPhoto && hasValidSede && hasValidEmail && hasValidOfficeNumber && hasValidCellNumber && hasValidestado && hasValidCoordinador;
    //return hasValidName && hasValidPhoto && hasValidSede && hasValidEmail && hasValidOfficeNumber && hasValidCellNumber && hasValidCoordinador && hasValidestado ;
}

function isValidPhoneNumber(phone) {
    	if (phone.length === 8){return true;} else {return false;}
}


async function formatProf(name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado){
    let codigo
    let numOficina = numeroOficina.substring(0, 4) + '-' +numeroOficina.substring(4);
    let teleCelular = telefono.substring(0, 4) + '-' +telefono.substring(4);
    if(sede === "San Jose"){ 

        const counterData = await getContador('SJ'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `SJ-${counterData.count}`;}

        // const counterData = await getContador('SJ'); // Adjusted to always fetch 'SJ' for demonstration
        // const newCount = counterData.count + 1;
        // await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        // codigo = `SJ-${counterData.count}`;}
        
    else if(sede === "Cartago"){ 
        const counterData = await getContador('CA'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `CA-${counterData.count}`;
    }
    else if(sede === "San Carlos"){
        const counterData = await getContador('SC'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `SC-${counterData.count}`;}
    else if(sede === "Alajuela"){
        const counterData = await getContador('AL'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `AL-${counterData.count}`;}
    else if(sede === "Limon"){
        const counterData = await getContador('LI'); // Adjusted to always fetch 'SJ' for demonstration
        const newCount = counterData.count + 1;
        await editContador(counterData.id, { cont: newCount }); // Pass the document ID and new count
        codigo = `LI-${counterData.count}`;}
    let prof = {
        nombre: name,
        nombre2: nombre2,
        apellido1: apellido1,
        apellido2: apellido2,
        foto: photo,
        campus: sede,
        email: correo,
        numOficina: numOficina,
        celular: teleCelular,
        codigo: codigo,
        coordinador: coordinador,
        estado: estado
     }
     return prof



}

async function editProfesores(id, newField){
    try{
        updateDoc(doc(db, 'Profesores', id),newField);
    }
    catch(error){
        console.error("Error updating Profesores: ", error);
    }

}


export const addProfessorToFirestore = async (name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado) => {
    if (isValidProfessor(name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado)) {
        //const professorCode = await incrementProfessorCounter(); // This ensures the code is incremented
        try {
            let formatProfessor = await formatProf(name, photo, sede, correo, numeroOficina, telefono, nombre2, apellido1, apellido2, coordinador, estado);
           const docRef =  addDoc(collection (db,'Profesores'),formatProfessor);



            //const docRef = await db.collection('professors').add(formatProfessor);
            console.log("Professor added with ID: ", (await docRef).id);
        } catch (error) {
            console.error("Error adding document: ", error);
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

async function getContador(name) {
    try {
        const snapshot = await getDocs(collection(db, 'Contador'));
        const doc = snapshot.docs.find(doc => doc.data().Name === name);
        return doc ? { id: doc.id, count: doc.data().cont } : null; // Returns the document ID and count if found
    } catch (error) {
        console.error("Error fetching contador: ", error);
        return null;
    }
}

async function editContador(id, newField){
    try{
        updateDoc(doc(db, 'Contador', id),newField);
    }
    catch(error){
        console.error("Error updating contador: ", error);
    }

}

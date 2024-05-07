
 import {db } from "../firebase/firebase";
 import { addDoc, setDoc, getDoc,collection, getDocs } from "firebase/firestore";

 //addProfessorToFirestore(name, photo, sede, correo, numeroOficina, telefono);

// export const createprofesor = (name, photo, sede, correo, numeroOficina, telefono) => {
//      addProfessorToFirestore(name, photo, sede, correo, numeroOficina, telefono);
//     console.log("XD");
// }




function isValidProfessor(name, photo, sede, correo, numeroOficina, telefono) {
    const validSedes = ['San Jose', 'Cartago', 'Limon', 'Alajuela', 'San Carlos'];

    const hasValidName = typeof name === 'string' && name.trim() !== '';
    const hasValidPhoto = typeof photo === 'string' || photo === null || photo === undefined;
    const hasValidSede = validSedes.includes(sede);
    const hasValidEmail = typeof correo === 'string' && correo.trim() !== '';
    const hasValidOfficeNumber = isValidPhoneNumber(numeroOficina);
    const hasValidCellNumber = isValidPhoneNumber(telefono);

    return hasValidName && hasValidPhoto && hasValidSede && hasValidEmail && hasValidOfficeNumber && hasValidCellNumber;
}

function isValidPhoneNumber(phone) {
    	if (phone.length === 8){return true;} else {return false;}
}


function formatProf(name, photo, sede, correo, numeroOficina, telefono){
    let codigo
    let numOficina = numeroOficina.substring(0, 4) + '-' +numeroOficina.substring(4);
    let teleCelular = telefono.substring(0, 4) + '-' +telefono.substring(4);
    if(sede === "San Jose"){ codigo = "SJ-2"}
    else if(sede === "Cartago"){ codigo = "CA-2"}
    else if(sede === "San Carlos"){ codigo = "SC-2"}
    else if(sede === "Alajuela"){ codigo = "AL-2"}
    else if(sede === "Limon"){ codigo = "LI-2"}
    let prof = {
        Name: name,
        Photo: photo,
        Sede: sede,
        CorreoElectronico: correo,
        NumeroOficina: numOficina,
        TelefonoCelular: teleCelular,
        Codigo: codigo
     }
     return prof



}

export const addProfessorToFirestore = async (name, photo, sede, correo, numeroOficina, telefono) => {
    if (isValidProfessor(name, photo, sede, correo, numeroOficina, telefono)) {
        //const professorCode = await incrementProfessorCounter(); // This ensures the code is incremented
        try {
            let formatProfessor = formatProf(name, photo, sede, correo, numeroOficina, telefono);
           const docRef =  addDoc(collection (db,'Profesor'),formatProfessor);



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
      const snapshot = await getDocs(collection(db, 'Profesor'));
      const professorsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return professorsList; // Returns an array of professors
    } catch (error) {
      console.error("Error fetching documents: ", error);
      return []; // Returns an empty array in case of error
    }
  };
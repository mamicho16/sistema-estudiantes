
 import {db } from "../firebase/firebase";
 import { addDoc, setDoc, getDoc,collection } from "firebase/firestore";

 //addProfessorToFirestore(name, photo, sede, correo, numeroOficina, telefono);

export const createprofesor = (name, photo, sede, correo, numeroOficina, telefono) => {
     //addProfessorToFirestore(name, photo, sede, correo, numeroOficina, telefono);
    //console.log("XD");
}




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
    if(sede === "San Jose"){ codigo = "SJ-1"}
    else if(sede === "Cartago"){ codigo = "CA-1"}
    else if(sede === "San Carlos"){ codigo = "SC-1"}
    else if(sede === "Alajuela"){ codigo = "AL-1"}
    else if(sede === "Limon"){ codigo = "LI-1"}
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

const addProfessorToFirestore = async (name, photo, sede, correo, numeroOficina, telefono) => {
    if (isValidProfessor(name, photo, sede, correo, numeroOficina, telefono)) {
        //const professorCode = await incrementProfessorCounter(); // This ensures the code is incremented
        try {
            let formatProfessor = formatProf(name, photo, sede, correo, numeroOficina, telefono);
            addDoc(collection (db,'Profesor'),{Name: formatProfessor.Name , Photo: formatProfessor.Photo ,Sede: formatProfessor.Sede,
            CorreoElectronico: formatProfessor.CorreoElectronico, NumeroOficina: formatProfessor.NumeroOficina,
             TelefonoCelular: formatProfessor.TelefonoCelular});


            //const docRef = await db.collection('professors').add(formatProfessor);
            console.log("Professor added with ID: ");
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    } else {
        console.error("Invalid professor data");
    }
};


export const getProfessors = () => {console.log(":C")};
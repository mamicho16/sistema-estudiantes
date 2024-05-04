function isValidProfessor(professor) {
    const validSedes = ['San Jose', 'Cartago', 'Limon', 'Alajuela', 'San Carlos'];
    
    // Validar que el nombre no sea vacío
    const hasValidName = typeof professor.Name === 'string' && professor.Name.trim() !== '';

    // La foto es opcional, pero si está presente debe ser un string
    const hasValidPhoto = typeof professor.Photo === 'string' || professor.Photo === null || professor.Photo === undefined;

    // Validar que la sede sea una de las permitidas
    const hasValidSede = validSedes.includes(professor.Sede);

    // Validar que el correo electrónico no sea vacío
    const hasValidEmail = typeof professor.CorreoElectronico === 'string' && professor.CorreoElectronico.trim() !== '';

    // Validar los números telefónicos
    const hasValidOfficeNumber = isValidPhoneNumber(professor.NumeroOficina);
    const hasValidCellNumber = isValidPhoneNumber(professor.TelefonoCelular);

    return hasValidName && hasValidPhoto && hasValidSede && hasValidEmail && hasValidOfficeNumber && hasValidCellNumber;
}

function isValidPhoneNumber(phone) {
    	if (phone.length ==8){return true;} else {return false;}
}


function formatProf(professor){
    let codigo
    let numOficina = professor.NumeroOficina.substring(0, 4) + '-' +professor.NumeroOficina.substring(4);
    let teleCelular =  professor.TelefonoCelular.substring(0, 4) + '-' +professor.TelefonoCelular.substring(4);
    if(professor.Sede == "San Jose"){ codigo = "SJ-"}
    else if(professor.Sede == "Cartago"){ codigo = "CA-"}
    else if(professor.Sede == "San Carlos"){ codigo = "SC-"}
    else if(professor.Sede == "Alajuela"){ codigo = "AL-"}
    else if(professor.Sede == "Limon"){ codigo = "LI-"}
    let prof = {
        Name: professor.Name,
        Photo: professor.Photo,
        Sede: professor.Sede,
        CorreoElectronico: professor.CorreoElectronico,
        NumeroOficina: numOficina,
        TelefonoCelular: teleCelular,
        Codigo: codigo
     }
     return prof



}

const addProfessorToFirestore = async (professor) => {
    if (isValidProfessor(professor)) {
        try {
            let formatProfessor = formatProf(professor);
            const docRef = await db.collection('professors').add(formatProfessor);
            console.log("Professor added with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    } else {
        console.error("Invalid professor data");
    }
};

// Llamar a la función con datos de ejemplo
addProfessorToFirestore(professor);
// Ejemplo de uso
const professor = {
    Name: "Juan Pérez",
    Photo: "http://example.com/photo.jpg",
    Sede: "San Jose",
    CorreoElectronico: "juan.perez@example.com",
    NumeroOficina: "12345678",
    TelefonoCelular: "87654321"
};

console.log(isValidProfessor(professor), formatProf(professor));
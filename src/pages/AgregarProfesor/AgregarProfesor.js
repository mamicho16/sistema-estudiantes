import React, { useState } from "react";
import { Helmet } from "react-helmet";
import NavBar from "../../components/navBar/navBar";
import { Form, InputGroup, FormControl, Button, FormLabel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addProfessorToFirestore } from "../../contexts/profesor";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import { useAuth } from "../../contexts/auth";

const AgregarProfesor = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [nombre1, setNombre1] = useState("");
    const [nombre2, setNombre2] = useState("");
    const [apellido1, setApellido1] = useState("");
    const [apellido2, setApellido2] = useState("");
    const [sede, setSede] = useState(user.sede);
    const [email, setEmail] = useState("");
    const [numOficina, setNumOficina] = useState("");
    const [celular, setCelular] = useState("");
    const [coordinador, setCoordinador] = useState(false);
    const [file, setFile] = useState(null);
    const [password, setPassword] = useState("");

    const admin = user.coordinador === undefined;
    const cartago = user.sede === "Cartago";

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nombre1 === "" || apellido1 === "" || sede === "" || email === "" || numOficina === "" || celular === "") {
            alert("Por favor, llena todos los campos");
            return;
        }
        try {
            const photoRef = ref(storage, `Profesores/${nombre1}-${file.name}`);
            const uploadTask = uploadBytesResumable(photoRef, file);
    
            uploadTask.on('state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },
                (error) => {
                    throw error;
                },
                async () => {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    console.log('File available at', downloadURL);
                    // Llamar a la función para agregar el profesor con todos los datos incluyendo la URL de la imagen
                    await addProfessorToFirestore(nombre1, downloadURL, sede, email, numOficina, celular, nombre2, apellido1, apellido2, coordinador, true, password);
                    navigate("/edicionGuia");
                }
            );
        } catch (error) {
            console.error("Error during the image upload: ", error);
            alert("Error al subir la imagen. Por favor, intenta de nuevo.");
        }
        
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]); // Guarda el primer archivo seleccionado
    };

    return (
        <>
        <Helmet>
            <title>Agregar Profesor - Tecnológico de Costa Rica</title>
        </Helmet>
        <div>
            <NavBar titulo="Agregar Profesor"/>
            <div className="Container">
                <Form id="form" onSubmit={handleSubmit}>
                    <Form.Group className="input-control">
                        <Form.Label>Subir Imagen</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="file"
                                onChange={handleFileChange}
                                accept="image/*" // Acepta solo imágenes
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Nombre</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Nombre"
                            value={nombre1}
                            onChange={(e) => setNombre1(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Segundo Nombre</Form.Label>
                        <InputGroup>
                            <FormControl 
                            type="text" 
                            placeholder="Segundo Nombre" 
                            value={nombre2}
                            onChange={(e) => setNombre2(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Apellido</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Apellido"
                            value={apellido1}
                            onChange={(e) => setApellido1(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Segundo Apellido</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Segundo Apellido"
                            value={apellido2}
                            onChange={(e) => setApellido2(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Email</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label htmlFor="password">Password</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="password"
                                value={password}
                                placeholder="Password"
                                onChange={(e) => setPassword(e.target.value)}     
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Número de oficina</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Número de oficina"
                            value={numOficina}
                            onChange={(e) => setNumOficina(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Celular</Form.Label>
                        <InputGroup>
                            <FormControl
                            type="text"
                            placeholder="Celular"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                            />
                        </InputGroup>
                    </Form.Group>
                    {admin && cartago &&( 
                        <>
                        <Form.Group className="input-control">
                            <Form.Label></Form.Label>
                            <InputGroup>
                                <Form.Check
                                    type="checkbox"
                                    label="Coordinador"
                                    value={coordinador}
                                    onChange={(e) => setCoordinador(e.target.checked)}
                                />
                            </InputGroup>
                        </Form.Group>
                        </>
                    )}
                    <Button className="Button" variant="primary" type="submit">
                        Agregar
                    </Button>
                </Form>
            </div>
        </div>
        </>
    );
}

export default AgregarProfesor;
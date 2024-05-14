import React, { useState, useRef, useEffect } from "react";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import './ListaDeEstudiantes.css';
import * as XLSX from 'xlsx';
import { uploadFileAndSaveReference, obtenerExcel, obtenerTodosLosExcels } from "../../contexts/excel";
import { useAuth } from "../../contexts/auth";

const ListaDeEstudiantes = () => {
    const { user } = useAuth();
    const [excelData, setExcelData] = useState([[]]); // Inicializar con una hoja de Excel vacía
    const [excelButton2Text, setExcelButton2Text] = useState('Cambiar Excel');
    const [isButtonDisabled, setIsButtonDisabled] = useState(true);
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [mensaje, setMensaje] = useState({});
    const boton2Ref = useRef(null);
    const boton3Ref = useRef(null);
    const boton4Ref = useRef(null);
    const [isButton2Active, setIsButton2Active] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false); // Estado para controlar la visibilidad del modal

    useEffect(() => {
        obtenerExcel(user.sede)
            .then(archivos => {
                console.log(archivos);
                cargarArchivoPredeterminado(archivos);
            })
            .catch(error => {
                console.error("Error al cargar los archivos:", error);
                setEstadoAlerta(true);
                setMensaje({ tipo: 'error', mensaje: 'No se pudo cargar los archivos' });
            });
    }, [user.sede]);

    const cargarArchivoPredeterminado = (archivo) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Obtener la primera hoja de cálculo
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convertir la hoja de cálculo a JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Almacena los datos del Excel en el estado
            setExcelData(jsonData);
        };

        reader.readAsArrayBuffer(archivo);
    }

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        cargarArchivoPredeterminado(file);
    }

    const upload = async () => {
        try {
            const fileInput = document.getElementById('excelFileInput');
            if (fileInput.files.length === 0) {
                console.log("No se ha seleccionado ningún archivo.");
                return; // Salir de la función si no hay ningún archivo seleccionado
            }
            const file = fileInput.files[0]; // Obtener el primer archivo seleccionado
            console.log(user.sede);
            await uploadFileAndSaveReference(file, user.sede);

            // Mostrar modal de éxito
            setShowSuccessModal(true);

            toggleButton2();
        } catch (error) {
            console.error("Error en subir archivo:", error);
            setEstadoAlerta(true);
            setMensaje({ tipo: 'error', mensaje: 'No se pudo iniciar sesión' });
        }
    }

    const toggleButton2 = () => {
        setIsButtonDisabled(!isButtonDisabled);
        if (isButton2Active) {
            boton2Ref.current.disabled = true;
            boton3Ref.current.disabled = true;
            boton4Ref.current.disabled = true;
            setExcelButton2Text('Cambiar Excel');
        } else {
            boton2Ref.current.disabled = false;
            boton3Ref.current.disabled = false;
            boton4Ref.current.disabled = false;
            setExcelButton2Text('Cancelar');
        }
        setIsButton2Active(!isButton2Active);
    };

    const generateAlphabet = () => {
        const alphabet = [];
        for (let i = 65; i <= 90; i++) {
            alphabet.push(String.fromCharCode(i));
        }
        return alphabet;
    }

    return (
        <>
            <NavBar titulo="Lista De Estudiantes" />
            <Helmet>
                <title>Lista De Estudiantes - Tecnológico de Costa Rica</title>
            </Helmet>
            <div className="subtituloH">
                <h1>Lista de Estudiantes de la sede del TEC</h1>
            </div>
            <label className="file-label" ref={boton4Ref} htmlFor="excelFileInput" disabled>Subir archivo</label>
            <input className="file" type="file" id="excelFileInput" ref={boton3Ref} accept=".xlsx, .xls" onChange={handleFileSelect} disabled />

            <div className="excelDataContainer">
                <div className="tableWrapper">
                    <table className="excelTable">
                        <tbody>
                            {/* Encabezado de columna */}
                            <tr>
                                <td className="indexCell"></td> {/* Celda en blanco para el índice de fila */}
                                {excelData.length > 0 && excelData[0].map((_, index) => (
                                    <td key={index} className="indexCell">{generateAlphabet()[index]}</td>
                                ))}
                            </tr>
                            {/* Contenido de la tabla */}
                            {[...Array(excelData.length).keys()].map(rowIndex => (
                                <tr key={rowIndex}>
                                    <td className="indexCell">{rowIndex + 1}</td> {/* Índice de fila */}
                                    {excelData[rowIndex].map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <button ref={boton2Ref} className="excel-button" onClick={upload} disabled={isButtonDisabled}>Guardar Excel</button>
            <button className="excel-button2" onClick={toggleButton2}>{excelButton2Text}</button>

            {/* Modal de éxito */}
            {showSuccessModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={() => setShowSuccessModal(false)}>&times;</span>
                        <div className="alert alert-success" role="alert">
                            El archivo se ha cargado correctamente.
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ListaDeEstudiantes;

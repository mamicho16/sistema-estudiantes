import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import './ListaEstudiantesProfesores.css';
import { obtenerExcel, obtenerTodosLosExcels } from "../../contexts/excel";
import { useAuth } from "../../contexts/auth";
import * as XLSX from 'xlsx';

const ListaDeEstudiantesProfesores = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('estudiantes');
    const [excelData, setExcelData] = useState([[]]); // Inicializar con una hoja de Excel vacía
    const [opcionesMenu, setOpcionesMenu] = useState([]); // Opciones del menú
    const [selectedOption, setSelectedOption] = useState(null); // Estado para la opción seleccionada
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [mensaje, setMensaje] = useState({});

    const [archivosExcel, setArchivosExcel] = useState([]);
    const [ultimoArchivoSeleccionado, setUltimoArchivoSeleccionado] = useState(null);

    useEffect(() => { 
        if (activeTab === 'estudiantes') {
            sedeUser();
        }
    }, [user.sede]);

    const todos = () => {
        obtenerTodosLosExcels(user.sede)
            .then(archivos => {
                // Extraer los nombres de los archivos
                const nombresArchivos = archivos.map(archivo => archivo.name);
                cargarArchivoPredeterminado(archivos[0]);
                setArchivosExcel(archivos);
                setUltimoArchivoSeleccionado(archivos[0]);
                // Establecer los nombres de los archivos como opciones de menú
                setOpcionesMenu(nombresArchivos);
                // Si deseas seleccionar automáticamente el primer archivo, descomenta la siguiente línea:
                setSelectedOption(nombresArchivos[0]);
            })
            .catch(error => {
                console.error("Error al cargar los archivos:", error);
                setEstadoAlerta(true);
                setMensaje({ tipo: 'error', mensaje: 'No se pudo cargar los archivos' });
            });
    };

    const sedeUser = () => {
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
    }


    const cargarArchivoPredeterminado = (archivo) => {
        const reader = new FileReader();

        reader.onload = function (event) {
            const data = event.target.result;
            const workbook = XLSX.read(data, { type: 'binary' });

            // Obtener la primera hoja de cálculo
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // Convertir la hoja de cálculo a JSON
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

            // Almacena los datos del Excel en el estado
            setExcelData(jsonData);
        };
        reader.readAsBinaryString(archivo);
    }

    const handleOptionClick = (opcion, archivo) => {
        setSelectedOption(opcion);
        setUltimoArchivoSeleccionado(archivo);
        cargarArchivoPredeterminado(archivo);
    };

    // Función para generar los botones del menú dinámicamente
    const renderizarBotones = () => {
        return opcionesMenu.map((opcion, index) => (
            <button
                key={index}
                className={`menuButton ${opcion === selectedOption ? 'active' : ''}`}
                onClick={() => handleOptionClick(opcion, archivosExcel[index])}
            >
                {opcion}
            </button>
        ));
    };

    // Función para cambiar de pestaña
    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    const downloadAll = () => {
        // Crear un nuevo libro de trabajo vacío
        let combinedWorkbook = XLSX.utils.book_new();
    
        // Iterar sobre cada opción seleccionada del menú
        archivosExcel.forEach((archivo) => {
            // Obtener el archivo correspondiente al nombre de la opción
            
    
            if (archivo) {
                // Leer el contenido del archivo
                const reader = new FileReader();
                reader.onload = function (event) {
                    const data = event.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
    
                    // Agregar cada hoja del archivo al libro de trabajo combinado
                    workbook.SheetNames.forEach((sheetName) => {
                        const sheet = workbook.Sheets[sheetName];
                        XLSX.utils.book_append_sheet(combinedWorkbook, sheet, sheetName);
                    });
    
                    // Si has procesado todos los archivos, descarga el archivo combinado
                    if (archivo === archivosExcel[archivosExcel.length - 1]) {
                        XLSX.writeFile(combinedWorkbook, 'sedes.xlsx');
                    }
                };
                reader.readAsBinaryString(archivo);
            }
        });
    };
    const download = () => {
        if (ultimoArchivoSeleccionado) {
            const archivo = ultimoArchivoSeleccionado;
            const reader = new FileReader();
            reader.onload = function (event) {
                const data = event.target.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                workbook.SheetNames.forEach((sheetName) => {
                    const sheet = workbook.Sheets[sheetName];
                    const combinedWorkbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(combinedWorkbook, sheet, sheetName);
                    XLSX.writeFile(combinedWorkbook, archivo.name);
                });
            };
            reader.readAsBinaryString(archivo);
        }
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
            <div className="tabs">
                {/* Botones de pestaña */}
                <button className={activeTab === 'estudiantes' ? 'active' : ''} onClick={() => {switchTab('estudiantes'); sedeUser()}}>Mi Sede</button>
                <button className={activeTab === 'profesores' ? 'active' : ''} onClick={() => {switchTab('profesores'); todos()}}>Todas las Sedes</button>
            </div>
            <div className="subtituloH">
                <h1>Lista de Estudiantes de la sede del TEC</h1>
            </div>
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
            {/* Contenido de la tabla dependiendo de la pestaña activa */}
            {activeTab === 'estudiantes' && (
                <div className="excelDataContainer">
                    {/* Contenido de la tabla de estudiantes */}
                    <div className="tableWrapper">
                        {/* Contenido de la tabla de estudiantes */}
                    </div>
                </div>
            )}
            {activeTab === 'profesores' && (
                <div className="excelDataContainer">
                     <div className="menuContainer">
                        <div className="menu">
                            {renderizarBotones()} {/* Renderiza los botones del menú */}
                        </div>
                    </div>
                    <div className="tableWrapper">
                        {/* Contenido de la tabla de profesores */}
                    </div>
                    <button className="excel-button2" onClick={downloadAll}>Descargar Todo</button>
                </div>
            )}
            
            {/* Botón para descargar el archivo */}
            <button className="excel-button" onClick={download}>Descargar Sede</button>
        </>
    );
};

export default ListaDeEstudiantesProfesores;

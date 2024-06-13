import React, { useState, useEffect } from "react";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import './ListaEstudiantesProfesores.css';
import { obtenerEstudiantes, obtenerEstudiantesPorSede } from "../../contexts/excel";
import { useAuth } from "../../contexts/auth";
import * as XLSX from 'xlsx';

const ListaDeEstudiantesProfesores = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('estudiantes');
    const [excelData, setExcelData] = useState([[]]);
    const [workbook, setWorkbook] = useState(null);
    const [opcionesMenu, setOpcionesMenu] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [estadoAlerta, setEstadoAlerta] = useState(false);
    const [mensaje, setMensaje] = useState({});
    const [estudiantes, setEstudiantes] = useState([]);
    const [archivosExcel, setArchivosExcel] = useState([]);

    useEffect(() => {
        if (activeTab === 'estudiantes') {
            sedeUser();
        }
    }, [user.sede]);

    const todos = () => {
        obtenerEstudiantes()
            .then(estudiantes => {
                setEstudiantes(estudiantes);
                const sedes = estudiantes.map(estudiante => estudiante.sede);
                const nombresSedesUnicas = [...new Set(sedes)];
                setOpcionesMenu(nombresSedesUnicas);
                setSelectedOption(nombresSedesUnicas[0]);
                setArchivosExcel(estudiantes);
                const estudiantesFiltrados = estudiantes.filter(estudiante => estudiante.sede === nombresSedesUnicas[0]);
                cargarArchivoPredeterminado(estudiantesFiltrados);
            })
            .catch(error => {
                console.error("Error al cargar los archivos:", error);
                setEstadoAlerta(true);
                setMensaje({ tipo: 'error', mensaje: 'No se pudo cargar los archivos' });
            });
    };

    const sedeUser = () => {
        obtenerEstudiantesPorSede(user.sede)
            .then(estudiantes => {
                cargarArchivoPredeterminado(estudiantes);
            })
            .catch(error => {
                console.error("Error al cargar los archivos:", error);
                setEstadoAlerta(true);
                setMensaje({ tipo: 'error', mensaje: 'No se pudo cargar los archivos' });
            });
    }

    const cargarArchivoPredeterminado = (estudiantes) => {
        const worksheet = XLSX.utils.json_to_sheet(estudiantes);
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        setExcelData(jsonData);
        const newWorkbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(newWorkbook, worksheet, 'Estudiantes');
        setWorkbook(newWorkbook);


        
    }

    const handleOptionClick = (opcion) => {
        setSelectedOption(opcion);
        const estudiantesFiltrados = estudiantes.filter(estudiante => estudiante.sede === opcion);
        cargarArchivoPredeterminado(estudiantesFiltrados);
    };

    const renderizarBotones = () => {
        return opcionesMenu.map((opcion, index) => (
            <button
                key={index}
                className={`menuButton ${opcion === selectedOption ? 'active' : ''}`}
                onClick={() => handleOptionClick(opcion)}
            >
                {opcion}
            </button>
        ));
    };

    const switchTab = (tab) => {
        setActiveTab(tab);
    };

    const downloadAll = () => {
        let combinedWorkbook = XLSX.utils.book_new();
        let estudiantesPorSede = {};
    
        archivosExcel.forEach((estudiante) => {
            const { sede } = estudiante; // Obtener la sede del estudiante
            if (!estudiantesPorSede[sede]) {
                estudiantesPorSede[sede] = [];
            }
            estudiantesPorSede[sede].push(estudiante);
        });
    
        Object.keys(estudiantesPorSede).forEach((sede) => {
            const estudiantes = estudiantesPorSede[sede];
            const worksheet = XLSX.utils.json_to_sheet(estudiantes);
            XLSX.utils.book_append_sheet(combinedWorkbook, worksheet, sede);
        });
    
        XLSX.writeFile(combinedWorkbook, 'estudiantes_por_sede.xlsx');
    };

    const download = () => {
        if (workbook) {
            XLSX.writeFile(workbook, 'EstudiantesSede.xlsx');
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
                <button className={activeTab === 'estudiantes' ? 'active' : ''} onClick={() => { switchTab('estudiantes'); sedeUser() }}>Mi Sede</button>
                <button className={activeTab === 'profesores' ? 'active' : ''} onClick={() => { switchTab('profesores'); todos() }}>Todas las Sedes</button>
            </div>
            <div className="subtituloH">
                <h1>Lista de Estudiantes de la sede del TEC</h1>
            </div>
            <div className="excelDataContainer">
                <div className="tableWrapper">
                    <table className="excelTable">
                        <tbody>
                            <tr>
                                <td className="indexCell"></td>
                                {excelData.length > 0 && excelData[0].map((_, index) => (
                                    <td key={index} className="indexCell">{generateAlphabet()[index]}</td>
                                ))}
                            </tr>
                            {excelData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className="indexCell">{rowIndex + 1}</td>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>{cell}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {activeTab === 'estudiantes' && (
                <div className="excelDataContainer">
                    <div className="tableWrapper">
                    </div>
                </div>
            )}
            {activeTab === 'profesores' && (
                <div className="excelDataContainer">
                    <div className="menuContainer">
                        <div className="menu">
                            {renderizarBotones()}
                        </div>
                    </div>
                    <div className="tableWrapper">
                    </div>
                    <button className="excel-button2" onClick={downloadAll}>Descargar Todo</button>
                </div>
            )}
            <button className="excel-button" onClick={download}>Descargar Sede</button>
        </>
    );
};

export default ListaDeEstudiantesProfesores;
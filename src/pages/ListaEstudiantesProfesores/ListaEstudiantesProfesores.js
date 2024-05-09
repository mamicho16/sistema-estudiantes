import React, { useState, useRef } from "react";
import { Helmet } from 'react-helmet';
import NavBar from "../../components/navBar/navBar";
import './ListaDeEstudiantesProfesores.css';
import * as XLSX from 'xlsx';

const ListaDeEstudiantesProfesores = () => {
    const [excelData, setExcelData] = useState([[]]); // Inicializar con una hoja de Excel vacía
    const [excelFileName, setExcelFileName] = useState(null); // Nombre del archivo Excel cargado
    const [isButton2Active, setIsButton2Active] = useState(false);

    const handleFileSelect = (file) => {
        const reader = new FileReader();
        reader.onload = function(event) {
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

        reader.readAsArrayBuffer(file);
        setExcelFileName(file.name);
    }

    const handleMenuItemClick = (file) => {
        handleFileSelect(file);
        setIsButton2Active(true); // Activar el botón 2 (por ejemplo, para mostrar la tabla Excel)
    }

    // Código para cargar archivos de Excel desde el menú lateral derecho

    return (
        <>
            <NavBar titulo="Lista De Estudiantes"/>
            <Helmet>
                <title>Lista De Estudiantes - Tecnológico de Costa Rica</title>
            </Helmet>
            <div className="subtituloH">
                <h1>Lista de Estudiantes de la sede del TEC</h1>
            </div>

            {/* Menú lateral derecho para cargar archivos */}
            {/* Aquí iría tu código para el menú lateral derecho */}

            <div className="excelDataContainer">
                <div className="tableWrapper">
                    <table className="excelTable">
                        <tbody>
                            {/* Encabezado de columna */}
                            <tr>
                                <td className="indexCell"></td> {/* Celda en blanco para el índice de fila */}
                                {excelData.length > 0 && excelData[0].map((_, index) => (
                                    <td key={index} className="indexCell">{String.fromCharCode(65 + index)}</td>
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
            {excelFileName && (
                <button className="excel-button2" onClick={() => setIsButton2Active(false)}>Cancelar</button>
            )}
            <button className="excel-button2" onClick={() => handleMenuItemClick(file)}>Archivo 1</button> 
            <button className="excel-button2" onClick={() => handleMenuItemClick(file)}>Archivo 2</button> 
            {/* Agregar más botones según sea necesario */}
        </>
    );
};

export default ListaDeEstudiantesProfesores;

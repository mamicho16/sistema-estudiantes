import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import "./EditActivity.css";

function EditActivityModal({ activity, onClose, onSave }) {
    const [formData, setFormData] = useState({
        activityName: activity.activityName,
        activityType: activity.activityType,
        dateTime: activity.dateTime,
        week: activity.week,
        responsibles: activity.responsibles,
        daysBeforeAnnounce: activity.daysBeforeAnnounce,
        reminderDays: activity.reminderDays,
        modality: activity.modality,
        link: activity.link,
        poster: activity.poster,
        state: activity.state,
        justification: activity.justification || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    function formatDate(isoString) {
        const date = new Date(isoString);
        const year = date.getFullYear();
        const month = `${date.getMonth() + 1}`.padStart(2, '0');
        const day = `${date.getDate()}`.padStart(2, '0');
        const hour = `${date.getHours()}`.padStart(2, '0');
        const minute = `${date.getMinutes()}`.padStart(2, '0');
        return `${year}-${month}-${day}T${hour}:${minute}`;
    }

    useEffect(() => {
        setFormData({
            activityName: activity.activityName,
            activityType: activity.activityType,
            dateTime: formatDate(activity.dateTime),
            week: activity.week,
            responsibles: activity.responsibles,
            daysBeforeAnnounce: activity.daysBeforeAnnounce,
            reminderDays: activity.reminderDays,
            modality: activity.modality,
            link: activity.link,
            poster: activity.poster,
            state: activity.state,
            justification: activity.justification || ''
        });
    }, [activity]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // cambiar el id, no existe en la base de datos
            console.log('Saving changes for activity:', activity.id, formData);
            await onSave(activity.id, formData); // Pass the activity ID and new data
            onClose(); // Close modal after saving
        } catch (error) {
            console.error('Failed to update activity:', error);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <Form id="form" onSubmit={handleSubmit}>
                    <Form.Group className="input-control">
                        <Form.Label>Nombre de la actividad</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="text"
                                name="activityName"
                                placeholder="Enter the name of the activity"
                                value={formData.activityName}
                                onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="input-control">
                        <Form.Label>Tipo de actividad</Form.Label>
                        <InputGroup>
                            <FormControl
                                as="select"
                                name="activityType"
                                value={formData.activityType}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona un tipo de actividad</option>
                                <option value="Orientadora">Orientadora</option>
                                <option value="Motivacional">Motivacional</option>
                                <option value="Apoyo a la vida estudiantil">Apoyo a la vida estudiantil</option>
                                <option value="Orden tecnico">Orden tecnico</option>
                                <option value="Recreacion">Recreacion</option>
                            </FormControl>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Fecha y hora</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="datetime-local"
                                name="dateTime"
                                value={formData.dateTime}
                                onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Semana</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="number"
                                name="week"
                                min="1"
                                max="16"
                                placeholder="Semana del semestre"
                                value={formData.week}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Semana del semestre en la que se realizará la actividad.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Responsables</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="text"
                                name="responsibles"
                                placeholder="Responsables"
                                value={formData.responsibles}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Ingrese los nombres de los responsables separados por comas.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Días antes de anunciar</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="number"
                                name="daysBeforeAnnounce"
                                placeholder="Días antes de anunciar"
                                value={formData.daysBeforeAnnounce}
                                onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Días de recordatorio</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="number"
                                name="reminderDays"
                                placeholder="Días de recordatorio"
                                value={formData.reminderDays}
                                onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Modalidad</Form.Label>
                        <InputGroup>
                            <FormControl
                                as="select"
                                name="modality"
                                value={formData.modality}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione una modalidad</option>
                                <option value="Presencial">Presencial</option>
                                <option value="Remota">Remoto</option>
                            </FormControl>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Link</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="text"
                                name="link"
                                placeholder="Enter link if remote"
                                value={formData.link}
                                disabled={formData.modality !== 'Remota'}
                                readOnly={formData.modality !== 'Remota'}
                                onChange={handleChange}
                            />
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Estado</Form.Label>
                        <InputGroup>
                            <FormControl
                                as="select"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione un estado</option>
                                <option value="Planeada">Planeada</option>
                                <option value="Cancelada">Cancelada</option>
                            </FormControl>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group className="input-control">
                        <Form.Label>Justificación por cambio</Form.Label>
                        <InputGroup>
                            <FormControl
                                as="textarea"
                                name="justification"
                                placeholder="Justifcacion"
                                value={formData.justification}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <Form.Text className="text-muted">
                            Por favor brinde una justificación si el estado de la actividad cambia.
                        </Form.Text>
                    </Form.Group>

                    <Button className="Button" variant="primary" type="submit">
                        Guardar cambios
                    </Button>
                    <Button className="Button" variant="secondary" type="button" onClick={onClose}>
                        Cancelar
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default EditActivityModal;
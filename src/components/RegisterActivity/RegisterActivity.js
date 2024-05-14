import React, { useState } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { storage , db } from '../../firebase/firebase';
import "./RegisterActivity.css";
import { ref } from 'firebase/storage';
import { uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc,  } from 'firebase/firestore';

function UploadActivityImagesModal({ activity, onClose }) {
    const [images, setImages] = useState([]);
    const [link, setLink] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploading, setUploading] = useState(false);

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files.length > 5) {
            alert("You can only upload up to 5 images.");
            return;
        }
        if (event.target.files && event.target.files.length > 0) {
            setImages(event.target.files);
        }
    };

    const handleLinkChange = (event) => {
        setLink(event.target.value);
    };

    const handleUpload = async () => {
        setUploading(true);
        const promises = [];
        const urls = [];
    
        Array.from(images).forEach((image, index) => {
            const imageRef = ref(storage, `evidences/${activity.id}/${image.name}`);
            const uploadTask = uploadBytesResumable(imageRef, image);
    
            promises.push(
                new Promise((resolve, reject) => {
                    uploadTask.on(
                        'state_changed',
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log('Upload is ' + progress + '% done');
                            setUploadProgress(progress); // Actualizar el progreso de carga
                        },
                        (error) => {
                            console.error("Error uploading file:", error);
                            reject(error); // Rechazar la promesa en caso de error
                            setUploading(false);
                        },
                        async () => {
                            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log(`File available at ${downloadURL}`);
                            urls.push(downloadURL); // Agregar URL al arreglo de URLs
                            resolve(downloadURL); // Resolver la promesa con la URL
                        }
                    );
                })
            );
        });
    
        try {
            await Promise.all(promises);
            console.log('All files uploaded');
            console.log(activity);
            // Actualizar el documento de la actividad en Firestore con las URLs de las imágenes
            const activityRef = doc(db, 'activities', activity.id);
            await updateDoc(activityRef, {
                imageUrls: urls, // Guardar las URLs de las imágenes subidas
                link: link, // Guardar el enlace de la grabación
                state: "REALIZADA"
            });
            console.log('Activity updated with image URLs');
            onClose(); // Cerrar modal después de la carga
        } catch (error) {
            console.error('Error while uploading:', error);
            alert("Error al subir imágenes. Por favor, intenta de nuevo.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="modal">
            <Form>
                <Form.Group className="input-control">
                    <Form.Label>Upload Images</Form.Label>
                    <InputGroup>
                        <FormControl
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </InputGroup>
                </Form.Group>

                {activity.modality === "Remota" && (
                    <Form.Group className="input-control">
                        <Form.Label>Recording Link</Form.Label>
                        <InputGroup>
                            <FormControl
                                type="text"
                                placeholder="Enter recording link"
                                value={link}
                                onChange={handleLinkChange}
                            />
                        </InputGroup>
                    </Form.Group>
                )}

                <Button className="Button" variant="primary" onClick={handleUpload} disabled={uploading}>
                    {uploading ? `Uploading (${uploadProgress.toFixed(2)}%)` : "Upload"}
                </Button>
                <Button className="Button" variant="secondary" onClick={onClose}>
                    Cancel
                </Button>
            </Form>
        </div>
    );
}

export default UploadActivityImagesModal;

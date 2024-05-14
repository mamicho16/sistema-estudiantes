import React, { useState } from 'react';
import { Form, Button, InputGroup, FormControl } from 'react-bootstrap';
import { storage } from '../../firebase/firebase';
import "./UploadActivityImages.css";

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
        Array.from(images).forEach((image, index) => {
            const uploadTask = storage.ref(`evidences/${activity.id}/${image.name}`).put(image);
            promises.push(uploadTask);
            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                },
                (error) => {
                    console.error("Error uploading file:", error);
                    setUploading(false);
                },
                async () => {
                    const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                    console.log(`File available at ${downloadURL}`);
                }
            );
        });

        try {
            await Promise.all(promises);
            console.log('All files uploaded');
            onClose(); // Close modal after upload
        } catch (error) {
            console.error('Error while uploading:', error);
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

import React from 'react';
import { useParams } from 'react-router-dom';
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
import "./VerEvidencia.css";

const VerEvidencia = () => {
    const { activityId } = useParams();
    const [activity, setActivity] = React.useState(null);

    React.useEffect(() => {
        const fetchActivity = async () => {
            const docRef = doc(db, "activities", activityId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setActivity(docSnap.data());
            } else {
                console.log("No such document!");
            }
        };

        fetchActivity();
    }, [activityId]);

    if (!activity) return <div>Loading...</div>;

    return (
        <div>
            <h1>Evidencias de la Actividad</h1>
            <div className="container-evidencias">
                {activity.imageUrls && activity.imageUrls.length > 0 ? (
                    activity.imageUrls.map((url, index) => (
                        <div key={index} className="evidencia">
                            <img src={url} alt={`Evidencia ${index + 1}`} />
                        </div>
                    ))
                ) : (
                    <p>Actividad no finalizada</p> // Mensaje alternativo si no hay imágenes
                )}
            </div>
        </div>
    );
}

export default VerEvidencia;
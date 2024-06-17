import { collection, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const actividadesCanceladas = collection(db, 'canceledActivities');

export const addCanceledActivity = async (activityId) => {

    try {
        await setDoc(doc(actividadesCanceladas, activityId), {id: activityId});
        console.log(`Actividad ${activityId} cancelada`);
    } catch (error) {
        console.error("Error adding canceled activity: ", error);
    }
};


export const isActivityCanceled = async (activityId) => {
    try {
        const docRef = doc(actividadesCanceladas, activityId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    } catch (error) {
        console.error("Error getting canceled activity: ", error);
        return false;
    }
};
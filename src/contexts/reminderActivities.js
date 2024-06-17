// firebase/sentReminders.js
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';

const sentRemindersCollection = collection(db, 'sentReminders');

export const addSentReminder = async (activityId, date) => {
    try {
        const reminderId = `${activityId}_${date}`;
        await setDoc(doc(sentRemindersCollection, reminderId), { activityId, date });
        console.log(`Recordatorio para la actividad ${activityId} añadido para el día ${date}`);
    } catch (error) {
        console.error('Error añadiendo recordatorio enviado:', error);
    }
};

export const isReminderSent = async (activityId, date) => {
    try {
        const reminderId = `${activityId}_${date}`;
        const docRef = doc(sentRemindersCollection, reminderId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists();
    } catch (error) {
        console.error('Error comprobando recordatorio enviado:', error);
        return false;
    }
};
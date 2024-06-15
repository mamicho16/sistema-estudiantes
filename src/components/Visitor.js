import { doc, updateDoc,  } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export class Visitor {
    async visit(activity, currentDate) {
        throw new Error('Este metodo debe implementarse');
    }
}

export class PublicationVisitor extends Visitor {
    async visit(activity, currentDate) {
        // Obtiene la fecha de la publicación
        const activityDate = new Date(activity.dateTime);
        // Resta los días de la actividad con los días antes de anunciar
        activityDate.setDate(activityDate.getDate() - activity.daysBeforeAnnounce);

        // Si la fecha actual es mayor o igual a la 
        if (currentDate >= activityDate && activity.state === 'PLANEADA') {
            const activityRef = doc(db, 'activities', activity.id);
            await updateDoc(activityRef, {
                state: 'NOTIFICADA'
            });
        }
    }
}

export class ReminderVisitor extends Visitor {
    async visit(activity, currentDate) {
        const activityDate = new Date(activity.dateTime);
        activityDate.setDate(activityDate.getDate() - activity.daysBeforeAnnounce);

        if (currentDate >= activityDate && activity.state === 'NOTIFICADA') {
            const reminderDates = [];
            for (let i = 1; i <= activity.daysBeforeAnnounce; i += activity.reminderDays) {
                const reminderDate = new Date(activityDate);
                reminderDate.setDate(reminderDate.getDate() + i);
                reminderDates.push(reminderDate);
            }

            for (const reminderDate of reminderDates) {
                if (currentDate.toDateString() === reminderDate.toDateString()) {
                    // Recordatorio generado aquí, pero no se muestra
                }
            }
        }
    }
}

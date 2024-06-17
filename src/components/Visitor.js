import { doc, updateDoc,  } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { addCanceledActivity, isActivityCanceled } from '../contexts/canceledActivities';
import notificationCenter from './notificationCenter';

export class Visitor {
    visit(activity, currentDate) {
        throw new Error('Este metodo debe implementarse');
    }
}

export class PublicationVisitor extends Visitor {
    async visit(activity, currentDate) {
        const activityDate = new Date(activity.dateTime);
        activityDate.setDate(activityDate.getDate() - activity.daysBeforeAnnounce);

        if (currentDate >= activityDate && activity.state === 'PLANEADA') {
            const activityRef = doc(db, 'activities', activity.id);
            await updateDoc(activityRef, { state: 'NOTIFICADA' });

            activity.state = 'NOTIFICADA';
            notificationCenter.notify(activity);
        }
    }
}

export class CancelationVisitor extends Visitor {
    async visit(activity, currentDate) {
        if (activity.state === 'CANCELADA') {
            const isNotified= await isActivityCanceled(activity.id);
            if (!isNotified) {
                // Aqui genera el mensaje de cancelacion y se lo pasa al obsever
                // notifyObserver(mensaje generado)
                await addCanceledActivity(activity.id);
                console.log(`Actividad ${activity.id} cancelada`);
            }
        }
    }
}

export class ReminderVisitor extends Visitor {
    async visit(activity, currentDate) {
        const activityDate = new Date(activity.dateTime);
        const reminderDates = [];

        if (currentDate < activityDate && activity.state === 'NOTIFICADA') {
            const amountOfReminders = Math.floor(activity.daysBeforeAnnounce / activity.reminderDays);
            const startDate = new Date(activityDate.getTime() - (activity.daysBeforeAnnounce * 24 * 60 * 60 * 1000));

            for (let i = 0; i < amountOfReminders; i++) {
                const reminderDate = new Date(startDate.getTime() + (i * activity.reminderDays * 24 * 60 * 60 * 1000));
                if (reminderDate <= activityDate) {
                    reminderDates.push(reminderDate);
                }
            }

            for (const reminderDate of reminderDates) {
                if (currentDate.toDateString() === reminderDate.toDateString()) {
                    // Recordatorio generado aquí, pero no se muestra
                }
            }
        }
    }
}


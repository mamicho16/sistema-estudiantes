import { doc, updateDoc,  } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { addCanceledActivity, isActivityCanceled } from '../contexts/canceledActivities';
import { addSentReminder, isReminderSent } from '../contexts/reminderActivities';
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
        // console.log(`Entra al visitor de publicacion para la actividad ${activity.activityName}`);
        // console.log(activity);

        if (currentDate >= activityDate && activity.state === 'PLANEADA') {
            const activityRef = doc(db, 'activities', activity.id);
            await updateDoc(activityRef, { state: 'NOTIFICADA' });

            activity.state = 'NOTIFICADA';

            const message = 
            {
                emisor: activity.responsibles[0],
                fecha: currentDate.toDateString(),
                hora: currentDate.toTimeString(),
                contenido: `Se ha publicado la actividad ${activity.activityName}`,
            }

            notificationCenter.notify(message);
        }
    }
}

export class CancelationVisitor extends Visitor {
    async visit(activity, currentDate) {
        if (activity.state === 'CANCELADA') {
            const isNotified= await isActivityCanceled(activity.id);
            if (!isNotified) {
                await addCanceledActivity(activity.id);
                const message = 
                {
                    emisor: activity.responsibles[0],
                    fecha: currentDate.toDateString(),
                    hora: currentDate.toTimeString(),
                    contenido: `Se ha cancelado la actividad ${activity.activityName}`,
                }
                notificationCenter.notify(message);
                console.log(`Actividad ${activity.id} cancelada`);
            } else {
                console.log(`Actividad ${activity.id} ya ha sido avisada de su cancelacion`);
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
                    const isSent = await isReminderSent(activity.id, reminderDate);
                    if (!isSent) {
                        await addSentReminder(activity.id, reminderDate);
                        console.log(`Recordatorio generado para la actividad ${activity.id}`);

                        const diffDays = Math.abs(activityDate - currentDate);
                        const diffTime = Math.ceil(diffDays / (1000 * 60 * 60 * 24));


                        const message =
                        {
                            emisor: activity.responsibles[0],
                            fecha: currentDate.toDateString(),
                            hora: currentDate.toTimeString(),
                            contenido: `Recordatorio para la actividad ${activity.activityName}. Faltan ${diffTime-1} dias`
                        }
                        notificationCenter.notify(message); 
                        
                    } else {
                        console.log(`Recordatorio ya enviado para la actividad ${activity.id}`);
                    }
                }
            }
        }
    }
}


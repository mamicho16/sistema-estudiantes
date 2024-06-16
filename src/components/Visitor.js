import { doc, updateDoc,  } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { addCanceledActivity, isActivityCanceled } from '../contexts/canceledActivities';

export class Visitor {
    visit(activity, currentDate) {
        throw new Error('Este metodo debe implementarse');
    }
}

export class PublicationVisitor extends Visitor {
    visit(activity, currentDate) {
        // Obtiene la fecha de la publicación
        const activityDate = new Date(activity.dateTime);
        // Resta los días de la actividad con los días antes de anunciar
        activityDate.setDate(activityDate.getDate() - activity.daysBeforeAnnounce);

        // Si la fecha actual es mayor o igual a la 
        if (currentDate >= activityDate && activity.state === 'PLANEADA') {
            const activityRef = doc(db, 'activities', activity.id);
            updateDoc(activityRef, {
                state: 'NOTIFICADA'
            });
            // Aqui genera el mensaje de publicacion y se lo pasa al obsever
            // notifyObserver(mensaje generado)
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
    visit(activity, currentDate) {
        const activityDate = new Date(activity.dateTime);
        const reminderDates = [];

        // Fecha para debuggear
        //currentDate = new Date('2024-05-01T00:00:00.000Z');

        // Si la fecha actual es menor a la fecha de la actividad y el estado es NOTIFICADA
        // se generan los recordatorios
        if (currentDate < activityDate && activity.state === 'NOTIFICADA') {

            console.log(`Fecha actual: ${currentDate}`);
            console.log(`Fecha de la actividad: ${activityDate}`);

            const amountOfReminders = activity.daysBeforeAnnounce / activity.reminderDays;
            const startDate = new Date(activityDate.getTime() - (activity.daysBeforeAnnounce * 24 * 60 * 60 * 1000));
            console.log(`Fecha de inicio: ${startDate}`);
            console.log(`Cantidad de recordatorios generados: ${amountOfReminders}`);
          
            // Genera las fechas de recordatorio
            for (let i = 0; i < amountOfReminders; i++) {
              const reminderDate = new Date(startDate.getTime() + (i * activity.reminderDays * 24 * 60 * 60 * 1000));
          
              if (reminderDate <= activityDate) {
                reminderDates.push(reminderDate);
              }
            }
          
            console.log('Fechas de recordatorio:');
            reminderDates.forEach((date) => console.log(date));
          }

            for (const reminderDate of reminderDates) {
                // Si la fecha actual es igual a la fecha del recordatorio, se genera el recordatorio
                if (currentDate.toDateString() === reminderDate.toDateString()) {
                    console.log(`Recordatorio generado para la actividad ${activity.id}`);
                    console.log(`Fecha del recordatorio: ${reminderDate}`);
                    // Aqui genera el mensaje de recordatorio y se lo pasa al obsever
                    // notifyObserver(mensaje generado)
                }
            }
        }
    }


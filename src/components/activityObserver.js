import { addMessageToFirestore } from '../contexts/buzon';

class ActivityObserver {
    update(activity) {
        const date = new Date();
        const formattedDate = date.toISOString().split('T')[0];
        const formattedHour = date.toLocaleTimeString();
        
        const messageContent = `La actividad '${activity.activityName}' ha cambiado de estado a '${activity.state}'`;

        console.log(messageContent);
        
        addMessageToFirestore('Sistema', '', 'Notificaciones', '', formattedDate, formattedHour, messageContent, 'sent');
    }
}

const activityObserver = new ActivityObserver();
export default activityObserver;
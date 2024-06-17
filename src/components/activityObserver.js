import { addMessageToFirestore} from '../contexts/buzon';

class ActivityObserver {
    async update(message) {


        console.log(`Se ha realizado la siguiente notificacion ${message}`);
        const { emisor, fecha, hora, contenido } = message;
        await addMessageToFirestore(emisor, fecha, hora, contenido);


    }
}

const activityObserver = new ActivityObserver();
export default activityObserver;



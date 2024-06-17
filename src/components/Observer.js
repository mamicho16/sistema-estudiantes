import { addMessageToFirestore} from '../contexts/buzon';

class Observer {
    update(message) {
        throw new Error('Este metodo debe implementarse');
    }
}


class ActivityObserver extends Observer {
    async update(message) {


        console.log(`Se ha realizado la siguiente notificacion ${message}`);
        const { emisor, fecha, hora, contenido } = message;
        await addMessageToFirestore(emisor, fecha, hora, contenido);


    }
}

const activityObserver = new ActivityObserver();
export default activityObserver;



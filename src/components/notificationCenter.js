class NotificationCenter {
    constructor() {
        this.observers = [];
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    removeObserver(observer) {
        this.observers = this.observers.filter(obs => obs !== observer);
    }

    notify(message) {
        this.observers.forEach(observer => observer.update(message));
    }
}

const notificationCenter = new NotificationCenter();
export default notificationCenter;





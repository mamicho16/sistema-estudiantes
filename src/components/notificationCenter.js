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

    notify(activity) {
        this.observers.forEach(observer => observer.update(activity));
    }
}

const notificationCenter = new NotificationCenter();
export default notificationCenter;
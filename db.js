import {EventEmitter} from 'node:events';

class Db extends EventEmitter {
    connected = false

    connect() {
        setTimeout(() => {
            this.connected = true;
            this.emit('connected');
        }, 500)
    }

    async query(queryString) {
        console.log(`Query executed: ${queryString}`);
    }

    async get(dbName) {
        console.log('Getting db %s', dbName);
        return dbName;
    }

}


export default new Db();
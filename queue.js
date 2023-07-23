import { once, EventEmitter } from "node:events";

export const initQueueWrapper = (obj, properties, state) => {
    let queues = [];
    let emitted = null;

    if(typeof properties === 'string') {
        properties = [properties];
    }

    if(!Array.isArray(properties)) {
        throw new Error('Invalid argument');
    }

    // If obj is an instance of EventEmitter and the property doesn't exist,, assume it is an event
    if(!obj[state] && obj instanceof EventEmitter) {
        emitted = false;
        once(obj, state).then(() => {
            emitted = true;
            queues.forEach(cmd => cmd());
            queues = [];
        })
    }

    return new Proxy(obj, {
        get(target, prop) {
            if(properties.includes(prop)) {
                // Get the original function
                const originalFunc = target[prop];
                // Return a function that queues the command if the state is falsy
                return function(...args) {
                    if(!target[state] || emitted === false) {
                        
                        return new Promise((res, rej) => {
                            const command = () => {
                                Promise.resolve(originalFunc(...args)).then(res, rej);
                            }

                            queues.push(command);
                        })
                    }

                    return originalFunc(...args);
                }
            }

            return target[prop];
        },

        set(target, prop, value) {
            if(prop === state) {
                if(value && target[prop] !== value) {
                    queues.forEach(func => func());
                    queues = [];
                }
            }

            target[prop] = value;
            return true;
        }
    })
}



import {writable} from 'svelte/store';

export function valueStore(init, action) {
    const {subscribe, set} = writable(init);
    let val = init;

    return {
        subscribe,
        set: (value) => {
            if (val != value) {
                set(value);
                val = value;
                action(value);
            }
        }
    }
}

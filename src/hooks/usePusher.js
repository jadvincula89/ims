import { useEffect, useState } from "react";
import Pusher from 'pusher-js';

const usePusher = ({ channel_name, event, ...props }) => {
    const [pusher, setPusher] = useState(undefined);
    const [channel, setChannel] = useState(undefined);
    console.log('sdasd ', process.env.REACT_APP_PUSHER_APP_KEY);
    useEffect(() => {
        console.log("process.env.REACT_APP_PUSHER_APP_KEY ", process.env.REACT_APP_PUSHER_APP_KEY);
        const p = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
            cluster: 'ap1',
            encrypted: true,
        });
        setPusher(p);

        const ch = p.subscribe(channel_name);
        setChannel(ch);

        return () => {
            pusher?.unsubscribe(channel_name);
            pusher?.disconnect();
        }
        /* eslint-disable */
    }, [channel_name, event]);

    return { pusher, channel };
}

export default usePusher;
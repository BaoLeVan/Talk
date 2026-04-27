import { useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws-talk';

export const useStomp = (onMessageReceived) => {
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);

    useEffect(() => {
        const socket = new SockJS(SOCKET_URL);
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setConnected(true);
                console.log('Connected to STOMP');
                
                // Example subscription
                client.subscribe('/topic/public', (message) => {
                    if (onMessageReceived) {
                        onMessageReceived(JSON.parse(message.body));
                    }
                });
            },
            onDisconnect: () => {
                setConnected(false);
                console.log('Disconnected from STOMP');
            },
            onStompError: (frame) => {
                console.error('Broker reported error: ' + frame.headers['message']);
                console.error('Additional details: ' + frame.body);
            },
        });

        client.activate();
        stompClient.current = client;

        return () => {
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };
    }, [onMessageReceived]);

    const sendMessage = (destination, payload) => {
        if (stompClient.current && connected) {
            stompClient.current.publish({
                destination: destination,
                body: JSON.stringify(payload),
            });
        } else {
            console.warn('STOMP client is not connected');
        }
    };

    return { connected, sendMessage };
};

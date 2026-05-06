import { useCallback, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import { getAccessToken } from '~/apis';

const SOCKET_URL = 'http://localhost:8080/ws-talk';

export const useStomp = () => {
    const [connected, setConnected] = useState(false);
    const stompClient = useRef(null);
    const messageQueue = useRef([]);
    const subscriptions = useRef({});

    useEffect(() => {
        const token = getAccessToken();

        const client = new Client({
            webSocketFactory: () => new SockJS(SOCKET_URL),
            connectHeaders: token ? {
                Authorization: `Bearer ${token}`,
            } : {},
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                setConnected(true);
                messageQueue.current.forEach(msg => client.publish(msg));
                messageQueue.current = [];
            },
            onDisconnect: () => {
                setConnected(false);
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
    }, []);

    // 📡 SUBSCRIBE ROOM
    const subscribeRoom = useCallback((conversationId, callback) => {
        if (!stompClient.current || !connected) return;

        const topic = `/topic/room.${conversationId}`;

        // tránh subscribe trùng
        if (subscriptions.current[topic]) return;

        const sub = stompClient.current.subscribe(topic, (message) => {
            try {
                const parsed = JSON.parse(message.body);
                callback(parsed);
            } catch (e) {
                console.error('Parse error:', e);
            }
        });

        subscriptions.current[topic] = sub;
    }, [connected]);

    // ❌ UNSUBSCRIBE
    const unsubscribeRoom = useCallback((conversationId) => {
        const topic = `/topic/room.${conversationId}`;

        if (subscriptions.current[topic]) {
            subscriptions.current[topic].unsubscribe();
            delete subscriptions.current[topic];
        }
    }, []);

    const sendMessage = useCallback((destination, payload) => {
        const msg = {
            destination,
            body: JSON.stringify(payload),
        };
        if (stompClient.current && connected) {
            stompClient.current.publish(msg);
        } else {
            messageQueue.current.push(msg);
        }
    }, [connected]);

    return { connected, sendMessage, subscribeRoom, unsubscribeRoom };
};

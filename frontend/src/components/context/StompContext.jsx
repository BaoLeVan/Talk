import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Client } from '@stomp/stompjs';
import { getAccessToken, refreshToken, setAccessToken } from '~/apis';
import SockJS from 'sockjs-client';

const SOCKET_URL = 'http://localhost:8080/ws-talk';

const StompContext = createContext(null);

export default function StompProvider({ children }) {
    const [connected, setConnected] = useState(false);
    const [connectTrigger, setConnectTrigger] = useState(0);
    const stompClient = useRef(null);
    const messageQueue = useRef([]);
    const subscriptions = useRef({});

    useEffect(() => {
        let active = true;

        const ensureTokenAndConnect = async () => {
            let token = getAccessToken();

            if (!token) {
                try {
                    const response = await refreshToken();
                    if (response?.data?.accessToken) {
                        setAccessToken(response.data.accessToken);
                        token = response.data.accessToken;
                    }
                } catch {
                    // Not logged in
                }
            }

            if (!active || !token) return;

            const client = new Client({
                webSocketFactory: () => new SockJS(SOCKET_URL),
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                },
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
        };

        ensureTokenAndConnect();

        return () => {
            active = false;
            subscriptions.current = {};
            if (stompClient.current) {
                stompClient.current.deactivate();
                stompClient.current = null;
            }
            setConnected(false);
        };
    }, [connectTrigger]);

    const reconnect = useCallback(() => {
        setConnectTrigger(prev => prev + 1);
    }, []);

    const subscribeRoom = useCallback((conversationId, callback) => {
        if (!stompClient.current || !connected) return;

        const topic = `/topic/room.${conversationId}`;
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

    const unsubscribeRoom = useCallback((conversationId) => {
        const topic = `/topic/room.${conversationId}`;
        if (subscriptions.current[topic]) {
            subscriptions.current[topic].unsubscribe();
            delete subscriptions.current[topic];
        }
    }, []);

    const subscribe = useCallback((destination, callback) => {
        if (!stompClient.current || !connected) return;
        if (subscriptions.current[destination]) return;

        const sub = stompClient.current.subscribe(destination, callback);
        subscriptions.current[destination] = sub;
    }, [connected]);

    const unsubscribe = useCallback((destination) => {
        if (subscriptions.current[destination]) {
            subscriptions.current[destination].unsubscribe();
            delete subscriptions.current[destination];
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

    return (
        <StompContext.Provider value={{ connected, sendMessage, subscribeRoom, unsubscribeRoom, subscribe, unsubscribe, reconnect }}>
            {children}
        </StompContext.Provider>
    );
}

export const useStomp = () => useContext(StompContext);

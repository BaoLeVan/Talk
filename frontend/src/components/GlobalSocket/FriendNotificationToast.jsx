import { useEffect } from "react";
import { useFriendStore } from "~/store/useFriendStore";
import { useStomp } from "~/components/context/StompContext";
import { useUser } from "~/components/context/UserContext";

export default function FriendNotificationToast() {
  const { user } = useUser();
  const { handleRealtimeNotification } = useFriendStore();
  const { connected, subscribe, unsubscribe } = useStomp();

  useEffect(() => {
    if (!connected || !user?.email) return;

    const destination = `/user/queue/friends`;

    const handleMessage = (message) => {
      try {
        const notification = JSON.parse(message.body);
        handleRealtimeNotification(notification);
      } catch (error) {
        console.error("Failed to parse friend notification:", error);
      }
    };

    subscribe(destination, handleMessage);

    return () => {
      unsubscribe(destination);
    };
  }, [connected, user?.email, subscribe, unsubscribe, handleRealtimeNotification]);

  return null;
}

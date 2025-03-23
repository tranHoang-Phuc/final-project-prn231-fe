import { useEffect, useState } from "react";
import { getUser } from "../services/localStorageService";
import { BaseUrl } from "../configurations/config";

const user = getUser();
const userId = user ? user.id : null;
export default function SSEClient({setNotification, setNotiStatus}) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const eventSource = new EventSource(`${BaseUrl.uri}/sse/events/${userId}`);

    eventSource.onmessage = (event) => {
      console.log(event.data);
      setNotiStatus(true);
      setMessages((prev) => [...prev, event.data]);
    };
    
    return () => eventSource.close();
  }, []);

  return (
    <></>
  );
}

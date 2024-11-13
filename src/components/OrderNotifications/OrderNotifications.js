import { useEffect, useState } from 'react';
















function OrderNotifications() {
  console.log('tea');
  const [notifications, setNotifications] = useState([]);
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8000/ws/notification/');
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established for notifications');
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setNotifications(data);
    };

    socket.onclose = (event) => {
      if (event.wasClean) {
        console.log(`WebSocket connection closed cleanly, code=${event.code}, reason=${event.reason}`);
      } else {
        console.log('WebSocket connection closed unexpectedly');
      }
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
   
    return () => {
      socket.close();
    };
  }, []);
  const jsonData = notifications.payload ? JSON.parse(notifications.payload) : 'No Order'
  console.log(ws);


  function createNotification() {
    const notificationTitle = 'New Order';
    const notificationBody = `${jsonData.data} Put a new order`;

    // Sanitize the content from jsonData for security (if necessary)
    // You might want to use a library like DOMPurify or a custom sanitization function
    // const sanitizedBody = DOMPurify.sanitize(notificationBody);  // Example using DOMPurify

    const notification = new Notification(notificationTitle, {
      body: notificationBody,
      // Optionally add an icon for the notification
      // icon: 'path/to/your/icon.png'
    });

    // Handle notification events (optional)
    notification.onclick = () => {
      window.open('http://localhost:3000/orders/', '_blank');
    };

    notification.onclose = () => {
      console.log('Notification closed.');
    };
  }


  if (!('Notification' in window)) {
    console.error('This browser does not support notifications.');
    return;
  }

  // Request permission from the user to show notifications (if not already granted)
  if (notifications.payload) {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission()
        .then(permission => {
          if (permission === 'granted') {
            createNotification();
          } else {
            console.log('User denied notification permission.');
          }
        });
    } else {
      createNotification()
      
    }

  }

}


export default OrderNotifications;
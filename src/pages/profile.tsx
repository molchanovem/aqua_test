import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/stylep.css';

interface Message {
  id: number;
  created_at: string;
  type: string;
  message: string;
  is_not_client_message: boolean;
}

const Profile: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Токен не найден. Пожалуйста, войдите в систему.');
          return;
        }

        const userStr = localStorage.getItem('user');
        let userId = 1230;
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            if (user && user.id) {
              userId = user.id;
            }
          } catch {

          }
        }

        const res = await axios.get(`/v1/chat/get-messages?id=${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Ответ с сервера:', res.data);

        setMessages(res.data.data || []);
      } catch (err) {
        console.error('Ошибка при загрузке сообщений:', err);
        setError('Ошибка при загрузке сообщений');
      }
    };

    fetchMessages();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  };

  return (
    <div className='container'>
      <div className='head'>
        <h3>Messages</h3>
        <div className='hi'>
          <img src="photo-1568602471122-7832951cc4c5.png" alt="" />
          <h3>Hi, Username</h3>
        </div>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div>
        <table className='tableone'>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {messages.length > 0 ? (
              messages.map(msg => (
                <tr
                  key={msg.id}
                  style={{ color: msg.is_not_client_message ? 'green' : 'inherit' }}
                >
                  <td>{formatDate(msg.created_at)}</td>
                  <td>{msg.type}</td>
                  <td>{msg.message}</td>
                </tr>
              ))
            ) : (
              !error && (
                <tr>
                  <td colSpan={3}>Сообщений нет</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;

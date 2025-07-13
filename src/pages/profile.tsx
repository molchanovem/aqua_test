import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/stylep.css';

interface Message {
  id: number;
  create_at: string;
  type: string;
  message: string;
  from_user: boolean;
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
        
        const res = await axios.get(`https://api.test.aqua-delivery.ru/v1/chat/get-messages?id=1230`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data.messages || []); 
      } catch (err) {
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
            {messages.map(msg => (
              <tr
                key={msg.id}
                style={{ color: msg.from_user ? 'green' : 'inherit' }}
              >
                <td>{formatDate(msg.create_at)}</td>
                <td>{msg.type}</td>
                <td>{msg.message}</td>
              </tr>
            ))}
            {messages.length === 0 && !error && (
              <tr>
                <td colSpan={3}>Сообщений нет</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Field } from 'react-final-form';
import axios from 'axios';
import '../style/stylea.css';
import { FieldRenderProps } from 'react-final-form';

const Avtorization: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const validate = (values: { login?: string; password?: string }) => {
    const errors: { login?: string; password?: string } = {};
    if (!values.login) errors.login = 'Обязательное поле';
    if (!values.password) errors.password = 'Обязательное поле';
    return errors;
  };

  const onSubmit = async (values: { login: string; password: string }) => {
    try {
      console.log('Отправка запроса с данными:', values);

      const res = await axios.post(
        '/v1/auth/login/',
        {
          login: values.login,
          password: values.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('Ответ от сервера:', res); 

      const token = res.data.data.auth_key;

      if (!token) {
        console.warn('Токен не получен из ответа сервера'); 
        setError('Не удалось получить токен авторизации');
        return;
      }

      localStorage.setItem('token', token);

      setError(null);
      navigate('/profile');
    } catch (err: any) {
      console.error('Ошибка при запросе авторизации:', err.response?.data || err.message); // 👈 лог ошибки
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className='avtorization'>
      <div className='form'>
        <div className='formTwo'>
          <h4>Pockets</h4>
          <div className='txt'>
            <h3 className='one'>Welcome to Pockets! 👋🏻</h3>
            <p className='two'>Please sign-in to your account and start the adventure</p>
          </div>

          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit }) => (
              <form
                className='formOne'
                onSubmit={(e) => {
                  console.log('Сабмит формы'); // 👈 лог при отправке формы
                  handleSubmit(e);
                }}
                noValidate
              >
                <label className='email' htmlFor='login'>Email</label>
                <Field<string> name='login'>
                  {({ input, meta }: FieldRenderProps<string, any>) => (
                    <>
                      <input
                        {...input}
                        id='login'
                        placeholder='johndoe@gmail.com'
                        autoComplete='username'
                      />
                      {meta.touched && meta.error && (
                        <span style={{ color: 'red' }}>{meta.error}</span>
                      )}
                    </>
                  )}
                </Field>

                <div className='link'>
                  <label htmlFor='password'>Password</label>{' '}
                  <a href='#' onClick={(e) => e.preventDefault()}>
                    Forgot Password?
                  </a>
                </div>

                <Field<string> name='password'>
                  {({ input, meta }: FieldRenderProps<string, any>) => (
                    <>
                      <input
                        {...input}
                        type='password'
                        id='password'
                        placeholder='⚉ ⚉ ⚉ ⚉ ⚉ ⚉ ⚉ ⚉'
                        autoComplete='current-password'
                      />
                      {meta.touched && meta.error && (
                        <span style={{ color: 'red' }}>{meta.error}</span>
                      )}
                    </>
                  )}
                </Field>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button type='submit'>Login</button>
              </form>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default Avtorization;

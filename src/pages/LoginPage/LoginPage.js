import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classNames from 'classnames';
import './LoginPage.scss';

export const LoginPage = ({ setToken, token }) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams()
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullname, setFullname] = useState('');
  const [idCard, setIdCard] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(''), 2000);
    }
  }, [errorMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (username.trim() && password.trim()) {
      let url;
      let body = {
        username,
        password,
        fullname,
        idCard,
        birthDate,
        city,
        email,
      };
      let method = 'POST';

      switch (searchParams.get('mode')) {
        case 'signup': {
          url = 'http://localhost:5000/users/signup';
          break;
        }

        case 'update': {
          url = `http://localhost:5000/users/${searchParams.get('userId')}`;
          method = 'PUT'
          break;
        }

        case 'login':
        default: {
          url = 'http://localhost:5000/users/login';
          body = {
            username,
            password,
          };
          break;
        }
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body),
      })
        .then(result => result.json());

      if (response.message) {
        setErrorMessage(response.message);
      } else {
        if (response.token) {
          setToken(response.token);
        }
        navigate('/info');
      }
    } else {
      setErrorMessage('Please, enter name and password');
    }
  }

  const handleModeButton = (e) => {
    if (searchParams.get('mode') === 'signup') {
      setSearchParams({ mode: 'login' });
    } else {
      setSearchParams({ mode: 'signup' });
    }
  }

  return (
    <div className="LoginPage">
      <h2 className="LoginPage__header">
        {!searchParams.get('mode')
          ? 'Login'
          : searchParams.get('mode')[0].toUpperCase() + searchParams.get('mode').slice(1)}
      </h2>
      <form className="LoginPage__form form-login" onSubmit={handleSubmit}>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
        />
        {(searchParams.get('mode') === 'signup' || searchParams.get('mode') === 'update') && (
          <>
            <input
              className="input"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Novikova A. R."
            />

            <input
              className="input"
              value={idCard}
              onChange={(e) => setIdCard(e.target.value)}
              placeholder="XX №000000"
            />

            <input
              className="input"
              currentvalue={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              placeholder="01.01.2023"
            />

            <input
              className="input"
              currentvalue={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Shostka"
            />

            <input
              className="input"
              currentvalue={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email'
              placeholder="example@email.com"
            />
          </>
        )}
        <button className="form-login__button form-login__button--accept">
          Accept
        </button>

        {searchParams.get('mode') !== 'update' && (
          <button
            type='button'
            className="form-login__button form-login__button--signup"
            onClick={handleModeButton}
          >
            {searchParams.get('mode') !== 'signup'
              ? 'Sign up'
              : 'Back to login'
            }
          </button>
        )}
      </form>

      <div className={classNames(
        "LoginPage__error",
        { "hidden": !errorMessage }
      )}>
        {errorMessage}
      </div>
    </div>
  );
}
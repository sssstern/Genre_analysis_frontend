import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { registerUser } from '../store/authSlice';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

const Register: React.FC = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const loading = useAppSelector(state => state.auth?.loading ?? false);
  const error = useAppSelector(state => state.auth?.error ?? null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(registerUser({ login, password }));
    if (result.type.endsWith('/fulfilled')) {
      navigate('/login');
    }
  };

  return (
  <div className="container" >
      <header>
            <Link to="/"><img src="/src/img/Home.png" alt="home" /></Link>
      </header>
      <div className="main-content" >
        <h2 className="page-title">Регистрация</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Логин</Form.Label>
            <Form.Control
              type="text"
              placeholder="Придумайте логин"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              required
              minLength={3}
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={4}
            />
          </Form.Group>

          <div className="d-grid">
            <Button variant="success" type="submit" size="lg" disabled={loading}  className="submit-button">
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" /> Регистрация...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </Button>
          </div>
        </Form>

        <div className="text-center mt-3">
          <p>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

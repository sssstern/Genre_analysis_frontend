import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchProfile, updateProfile, logoutUser } from '../store/authSlice';
import { type RootState } from '../store/index';

const UserProfile: React.FC = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const user = useAppSelector((state: RootState) => state.auth.user);
    const isAuthenticated = useAppSelector((state: RootState) => state.auth.isAuthenticated);
    const loading = useAppSelector((state: RootState) => state.auth.loading);
    const error = useAppSelector((state: RootState) => state.auth.error);

    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (!user) {
            dispatch(fetchProfile() as any);
        }
    }, [isAuthenticated, navigate, dispatch, user]);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedPassword = newPassword.trim();
        if (!trimmedPassword) {
            alert('Поле нового пароля обязательно.');
            return;
        }
        const result = await dispatch(updateProfile({ newPassword: trimmedPassword }) as any);
        if (updateProfile.fulfilled.match(result)) {
            setNewPassword('');
            dispatch(logoutUser() as any);
            navigate('/login');
        }
    };
    
    if (loading && !user) return <div className="container"><Header /><main style={{padding: '20px'}}>Загрузка профиля...</main></div>;
    if (!user) return null;
    const isButtonDisabled = loading || !newPassword.trim();
    return (
        <div className="container">
            <Header />
            <main className="main-content user-profile-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
                <h1 className="page-title">Личный кабинет</h1>
                {error && <p style={{ color: 'red', marginTop: '10px', fontWeight: 'bold' }}>**Ошибка:** {error}</p>}
                <div className="profile-section" style={{ border: '1px solid #ddd', padding: '20px', marginBottom: '30px', backgroundColor: '#fff' }}>
                    <h2 className="page-title">Ваши данные</h2>
                    <div className="form-group" style={{ marginBottom: '15px' }}>
                        <label htmlFor="login" className="card-title">Логин:</label>
                        <input 
                            type="text"
                            id="login"
                            value={user.Login}
                            readOnly
                            disabled={loading}
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', backgroundColor: '#fff' }}
                        />
                    </div>
                    <h2 className="page-title">Изменить пароль</h2>
                    <form onSubmit={handleUpdatePassword}>
                        
                        <div className="form-group" style={{ marginBottom: '15px' }}>
                            <label htmlFor="newPassword" className="card-title">Новый пароль:</label>
                            <input 
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                disabled={loading}
                                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc'}}
                            />
                        </div>
                        
                        <button 
                            type="submit" 
                            disabled={isButtonDisabled} 
                            className="delete-button"
                        >
                            {loading ? 'Обновление...' : 'Изменить пароль'}
                        </button>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
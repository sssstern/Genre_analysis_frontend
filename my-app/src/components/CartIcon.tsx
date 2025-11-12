import React from 'react';
import { Link } from 'react-router-dom';
import useAnalysisRequest from '../hooks/useAnalysisRequest';

const CartIcon: React.FC = () => {
    const { analysisID, count, loading } = useAnalysisRequest();

    const isCartActive = analysisID !== 0;
    const isCartEmpty = count === 0;
    
    const countStyle: React.CSSProperties = {
        position: 'absolute', 
        top: '0px', 
        right: '0px',
        backgroundColor: '#990000', 
        color: 'white', 
        borderRadius: '50%', 
        padding: '2px 6px',
        fontSize: '10px', 
        lineHeight: '1', 
        minWidth: '18px',
        textAlign: 'center',
    };

    if (loading) {
        const loadingStyle: React.CSSProperties = {
            opacity: 0.5, 
            cursor: 'wait', 
            position: 'relative'
        };

        return (
            <div className="cart" style={loadingStyle}>
                <img src="/Genre_analysis_frontend/img/RequestIcon.png" alt="Корзина (загрузка)" className="cart-image" />
            </div>
        );
    }

    if (!isCartActive) {
        const inactiveStyle: React.CSSProperties = {
            opacity: 0.4, 
            cursor: 'default', 
            position: 'relative'
        };

        return (
            <footer>
            <div 
                className="cart" 
                title="Для просмотра заявки необходимо сначала добавить услугу"
                style={inactiveStyle} 
            >
                <img src="/src/img/RequestIcon.png" alt="Корзина (неактивна)" className="cart-image" />
                
                
                {isCartEmpty ? null : (
                    <div className="cart-count" style={countStyle}>
                        {count}
                    </div>
                )}
            </div>
            </footer>
        );
    }
    
    const cartLink = `/genreanalysisrequest/${analysisID}`; 
    
    const activeLinkStyle: React.CSSProperties = {
        position: 'relative' 
    };

    return (
        <footer>
        <Link 
            to={cartLink} 
            className="cart"
            title={`Просмотреть заявку #${analysisID}`}
            style={activeLinkStyle}
        >
            <img src="/src/img/RequestIcon.png" alt="Корзина" className="cart-image" />
            {isCartEmpty ? null : (
                <div 
                    className="cart-count" 
                    style={countStyle}
                >
                    {count}
                </div>
            )}
        </Link>
        </footer>
    );
};

export default CartIcon;
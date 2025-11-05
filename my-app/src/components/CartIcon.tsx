import React from 'react';
import { Link } from 'react-router-dom';
import useAnalysisRequest from '../hooks/useAnalysisRequest';

const CartIcon: React.FC = () => {
    const { analysisID, count, loading } = useAnalysisRequest();

    // analysisID === 0 означает, что нет активной заявки.
    const isCartActive = analysisID !== 0;
    const isCartEmpty = count === 0;
    
    // Стиль для счетчика с явным указанием типа React.CSSProperties для устранения ошибки TypeScript
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
        // Заглушка, пока данные загружаются (неактивный вид)
        const loadingStyle: React.CSSProperties = {
            opacity: 0.5, 
            cursor: 'wait', 
            position: 'relative'
        };

        return (
            <div className="cart" style={loadingStyle}>
                <img src="/src/img/RequestIcon.png" alt="Корзина (загрузка)" className="cart-image" />
            </div>
        );
    }
    
    // 🛑 Логика деактивации: Если isCartActive = false, рендерим неактивный DIV без возможности перехода
    if (!isCartActive) {
        const inactiveStyle: React.CSSProperties = {
            opacity: 0.4, 
            cursor: 'default', 
            position: 'relative'
        };

        return (
            <div 
                className="cart" 
                title="Для просмотра заявки необходимо сначала добавить услугу"
                style={inactiveStyle} 
            >
                <img src="/src/img/RequestIcon.png" alt="Корзина (неактивна)" className="cart-image" />
                
                {/* Счетчик не должен отображаться, если корзина неактивна, но мы оставляем проверку на count > 0 */}
                {isCartEmpty ? null : (
                    <div className="cart-count" style={countStyle}>
                        {count}
                    </div>
                )}
            </div>
        );
    }
    
    // Если analysisID > 0, корзина активна и ведет по правильному маршруту
    const cartLink = `/genreanalysisrequest/${analysisID}`; 
    
    const activeLinkStyle: React.CSSProperties = {
        position: 'relative' // Добавлен для корректного позиционирования счетчика
    };

    return (
        <Link 
            to={cartLink} 
            className="cart"
            title={`Просмотреть заявку #${analysisID}`}
            style={activeLinkStyle}
        >
            <img src="/src/img/RequestIcon.png" alt="Корзина" className="cart-image" />
            
            {/* Отображение счетчика (только если не пустая) */}
            {isCartEmpty ? null : (
                <div 
                    className="cart-count" 
                    style={countStyle}
                >
                    {count}
                </div>
            )}
        </Link>
    );
};

export default CartIcon;
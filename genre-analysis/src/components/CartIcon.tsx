import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartStatus } from '../store/cartSlice'; 
import { RootState } from '../store/index'; 

const CartIcon: React.FC = () => {
  const dispatch = useDispatch(); 
  
  const { analysisRequestID, itemCount, loading } = useSelector((state: RootState) => state.cart);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); 
  const isCartActive = isAuthenticated && analysisRequestID && analysisRequestID > 0;
  
  useEffect(() => {
    dispatch(fetchCartStatus() as any); 
  }, [dispatch, isAuthenticated]); 

  const countStyle: React.CSSProperties = {
    position: 'absolute', 
    top: '0px', 
    right: '0px',
    backgroundColor: '#990000', 
    color: 'white', 
    borderRadius: '50%', 
    padding: '2px 6px', 
    lineHeight: '1', 
    minWidth: '18px',
    textAlign: 'center',
  };

  if (loading) {
    return (
      <footer>
        <div className="cart" style={{ opacity: 0.5, cursor: 'wait', position: 'relative' }}>
          <img src="/src/img/RequestIcon.png" alt="Загрузка..." className="cart-image" />
        </div>
      </footer>
    );
  }

  if (!isCartActive) {
    const title = isAuthenticated 
        ? "Для просмотра заявки необходимо сначала добавить услугу"
        : "Для просмотра заявок необходимо авторизоваться";
        
    return (
      <footer>
        <div
          className="cart"
          title={title}
          style={{ opacity: 0.4, cursor: 'default', position: 'relative' }} 
        >
          <img src="/src/img/RequestIcon.png" alt="Корзина неактивна" className="cart-image" />
        </div>
      </footer>
    );
  }
  const cartLink = `/genreanalysisrequest/${analysisRequestID}`; 
  return (
    <footer>
      <Link
        to={cartLink}
        className="cart"
        title={`Просмотреть заявку #${analysisRequestID}`}
        style={{ position: 'relative' }}
      >
        <img src="/src/img/RequestIcon.png" alt="Корзина заявок" className="cart-image" />
        {itemCount > 0 && ( 
          <div className="cart-count" style={countStyle}>
            {itemCount} 
          </div>
        )}
      </Link>
    </footer>
  );
};

export default CartIcon;
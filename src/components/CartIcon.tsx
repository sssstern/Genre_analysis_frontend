// src/components/CartIcon.tsx
import React from 'react';

const CartIcon: React.FC = () => {
  return (
    <footer>
      <div 
        className="cart" 
        style={{ 
          opacity: 0.4, 
          cursor: 'default',
          position: 'relative'
        }}
        title="Корзина заявок недоступна"
      >
        <img src="/src/img/RequestIcon.png" alt="Корзина (неактивна)" className="cart-image" />
      </div>
    </footer>
  );
};

export default CartIcon;
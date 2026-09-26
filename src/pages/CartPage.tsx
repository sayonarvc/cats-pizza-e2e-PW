import { useState } from 'react';
import { useCart } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';
import { useAuthModal } from '../components/auth/AuthModalProvider';
import { CheckoutModal } from '../components/auth/CheckoutModal';
import './CartPage.css';

export function CartPage() {
  const { state, changeQuantity, removeItem, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrderClick = () => {
    if (state.items.length === 0) return;
    if (isAuthenticated) {
      setIsCheckoutModalOpen(true);
    } else {
      openAuthModal(() => {
        setIsCheckoutModalOpen(true);
      });
    }
  };

  return (
    <section>
      <h1>Корзина</h1>

      {state.items.length === 0 ? (
        <p>Корзина пуста. Добавьте котика с главной страницы.</p>
      ) : (
        <>
          <ul className="cart-list">
            {state.items.map((item, index) => (
              <li key={`${item.id}-${index}`} className="cart-item">
                <div className="cart-item__header">
                  <div className="cart-item__main">
                    <span>
                      <strong>{item.name}</strong> — {item.price.toFixed(2)} ₽
                    </span>
                    <div className="cart-item__qty">
                      <button
                        type="button"
                        onClick={() =>
                          changeQuantity(item.id, item.quantity > 1 ? item.quantity - 1 : 1)
                        }>
                        −
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          changeQuantity(item.id, Math.max(1, Number(e.target.value) || 1))
                        }
                      />
                      <button
                        type="button"
                        onClick={() => changeQuantity(item.id, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="cart-item__remove"
                    onClick={() => removeItem(item.id)}>
                    Удалить
                  </button>
                </div>
                {item.options && (
                  <div className="cart-item__meta">
                    <div>Шерсть: {item.options.furType}</div>
                    <div>Активность: {item.options.activityLevel}</div>
                    {item.options.extras.length > 0 && (
                      <div>Дополнительно: {item.options.extras.join(', ')}</div>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="cart-summary">
            <div className="cart-summary__total">
              Итого: <strong>{total.toFixed(2)} ₽</strong>
            </div>

            <div className="cart-summary__actions">
              <button type="button" className="cart-summary__clear" onClick={clearCart}>
                Очистить корзину
              </button>
              <button
                type="button"
                data-testId="makeOrderButton"
                className="cart-summary__order"
                onClick={handleOrderClick}
                disabled={state.items.length === 0}>
                Оформить заказ
              </button>
            </div>
          </div>
        </>
      )}

      <CheckoutModal isOpen={isCheckoutModalOpen} onClose={() => setIsCheckoutModalOpen(false)} />
    </section>
  );
}

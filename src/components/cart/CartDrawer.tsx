import { useNavigate } from 'react-router-dom';
import { useCart } from '../../cart/CartContext';
import './CartDrawer.css';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, changeQuantity, removeItem } = useCart();
  const navigate = useNavigate();

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  const handleGoToCart = () => {
    navigate('/cart');
    onClose();
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <aside
        className="cart-drawer"
        onClick={(event) => {
          event.stopPropagation();
        }}>
        <header className="cart-drawer__header">
          <h2>Корзина</h2>
          <button type="button" className="cart-drawer__close" onClick={onClose}>
            ×
          </button>
        </header>

        {state.items.length === 0 ? (
          <p className="cart-drawer__empty">Корзина пуста</p>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {state.items.map((item, index) => (
                <li key={`${item.id}-${index}`} className="cart-drawer__item">
                  <div className="cart-drawer__item-main">
                    <div className="cart-drawer__item-title">{item.name}</div>
                    <div className="cart-drawer__item-meta">
                      <div className="cart-drawer__item-qty">
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
                      <button
                        type="button"
                        className="cart-drawer__item-remove"
                        onClick={() => removeItem(item.id)}>
                        Удалить
                      </button>
                    </div>
                  </div>
                  <div className="cart-drawer__item-sum">
                    {(item.price * item.quantity).toFixed(2)} ₽
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__total">
                Итого: <strong>{total.toFixed(2)} ₽</strong>
              </div>
              <button type="button" data-testId="goToCartPageButton" className="cart-drawer__cta" onClick={handleGoToCart}>
                Перейти к оформлению
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

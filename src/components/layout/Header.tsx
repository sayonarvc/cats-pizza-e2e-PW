import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../../cart/CartContext';
import { useAuth } from '../../auth/AuthContext';
import { useAuthModal } from '../auth/AuthModalProvider';
import './Header.css';

interface HeaderProps {
  onCartClick: () => void;
}

export function Header({ onCartClick }: HeaderProps) {
  const { state } = useCart();
  const { isAuthenticated, logout } = useAuth();
  const { openAuthModal } = useAuthModal();
  const itemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <Link to="/" className="logo">
          <span className="logo__title">Cat Pizza</span>
          <span className="logo__subtitle">Доставка котиков на дом</span>
        </Link>

        <nav className="nav">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}>
            Главная
          </NavLink>
          <NavLink
            to="/orders"
            data-testId="openOrdersButton"
            className={({ isActive }) => (isActive ? 'nav__link nav__link--active' : 'nav__link')}>
            Мои заказы
          </NavLink>
          <button
            type="button"
            data-testId="openCartButton"
            className={
              itemsCount > 0 ? 'nav__cart-button nav__cart-button--active' : 'nav__cart-button'
            }
            onClick={onCartClick}>
            Корзина{itemsCount > 0 ? ` (${itemsCount})` : ''}
          </button>
        </nav>

        <div className="auth">
          {isAuthenticated ? (
            <button
              type="button"
              className="auth__link"
              data-testId="signOutButton"
              onClick={logout}
              style={{ background: 'none', border: 'none', padding: 0 }}>
              Выйти
            </button>
          ) : (
            <button
              type="button"
              className="auth__link"
              data-testId="signInButton"
              onClick={() => openAuthModal()}
              style={{ background: 'none', border: 'none', padding: 0 }}>
              Войти
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

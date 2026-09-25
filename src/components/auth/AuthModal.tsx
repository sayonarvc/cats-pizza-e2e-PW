import type { FormEvent } from 'react';
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../auth/AuthContext';
import '../../pages/Forms.css';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const { login } = useAuth();
  const [mode, setMode] = useState<AuthMode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetMessages = () => {
    setMessage('');
    setError('');
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    resetMessages();

    if (!email.trim() || !password.trim()) {
      setError('Введите email и пароль.');
      return;
    }

    if (mode === 'register') {
      if (!name.trim()) {
        setError('Введите имя.');
        return;
      }
      if (password !== confirm) {
        setError('Пароли не совпадают.');
        return;
      }

      setIsSubmitting(true);

      try {
        // Сначала регистрируем пользователя
        const registerResponse = await fetch('/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!registerResponse.ok) {
          const data = (await registerResponse.json().catch(() => null)) as {
            message?: string;
          } | null;
          throw new Error(data?.message ?? 'Не удалось зарегистрироваться.');
        }

        // Затем автоматически логинимся теми же email/паролем
        const loginResponse = await fetch('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!loginResponse.ok) {
          const data = (await loginResponse.json().catch(() => null)) as {
            message?: string;
          } | null;
          throw new Error(data?.message ?? 'Регистрация прошла, но не удалось войти.');
        }

        const loginData: { token: string; user: { id: string; name: string; email: string } } =
          await loginResponse.json();

        login(loginData.user, loginData.token);
        onAuthSuccess();
        onClose();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Ошибка при регистрации. Попробуйте ещё раз.',
        );
      } finally {
        setIsSubmitting(false);
      }

      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(data?.message ?? 'Не удалось войти. Проверьте email и пароль.');
      }

      const data: { token: string; user: { id: string; name: string; email: string } } =
        await response.json();

      login(data.user, data.token);
      onAuthSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка при входе. Попробуйте ещё раз.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchMode = (nextMode: AuthMode) => {
    setMode(nextMode);
    resetMessages();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Авторизация">
      <div className="page-tabs" style={{ marginBottom: 16 }}>
        <button
          type="button"
          onClick={() => switchMode('login')}
          disabled={mode === 'login'}
          className={`page-tabs__button ${mode === 'login' ? 'page-tabs__button--active' : ''}`}>
          Вход
        </button>
        <button
          type="button"
          data-testId="registerButton"
          onClick={() => switchMode('register')}
          disabled={mode === 'register'}
          className={`page-tabs__button ${mode === 'register' ? 'page-tabs__button--active' : ''}`}>
          Регистрация
        </button>
      </div>

      <form onSubmit={handleSubmit} className="page-card__form">
        {mode === 'register' && (
          <div className="page-card__field">
            <label>
              <span>Имя:</span>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </label>
          </div>
        )}

        <div className="page-card__field">
          <label>
            <span>Email:</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
        </div>

        <div className="page-card__field">
          <label>
            <span>Пароль:</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
        </div>

        {mode === 'register' && (
          <div className="page-card__field">
            <label>
              <span>Повторите пароль:</span>
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </label>
          </div>
        )}

        {error && <p className="page-card__error">{error}</p>}
        {message && <p className="page-card__success">{message}</p>}

        <button type="submit" data-testId="signInOrSignUpButton" className="page-card__submit" disabled={isSubmitting}>
          {mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>
    </Modal>
  );
}

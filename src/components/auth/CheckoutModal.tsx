import type { FormEvent } from 'react';
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useCart } from '../../cart/CartContext';
import { useAuth } from '../../auth/AuthContext';
import '../../pages/Forms.css';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { state, clearCart } = useCart();
  const { token } = useAuth();
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [house, setHouse] = useState('');
  const [apartment, setApartment] = useState('');
  const [comment, setComment] = useState('');
  const [payment, setPayment] = useState<'card' | 'cash'>('card');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!city.trim() || !street.trim() || !house.trim()) {
      setError('Пожалуйста, заполните обязательные поля адреса.');
      return;
    }

    if (state.items.length === 0) {
      setError('Корзина пуста. Добавьте хотя бы одного котика.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          customer: {
            city,
            street,
            house,
            apartment,
            comment,
            payment,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Не удалось оформить заказ. Попробуйте ещё раз.');
      }

      // Ответ с данными заказа сейчас нигде не используется, но можно вывести позже при желании
      void (await response.json());

      setSubmitted(true);
      clearCart();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Произошла ошибка при оформлении заказа. Попробуйте ещё раз.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={submitted ? 'Заказ оформлен' : 'Оформление доставки'}>
      {submitted ? (
        <div>
          <p>
            Мы доставим ваших котиков по адресу: {city}, {street}, дом {house}
            {apartment ? `, кв. ${apartment}` : ''}.
          </p>
          <p>Способ оплаты: {payment === 'card' ? 'Онлайн-картой' : 'Наличными курьеру'}.</p>
          <p>Спасибо за заказ!</p>
          <button type="button" data-testId="closeSubmittedModalButton" className="page-card__submit" onClick={onClose}>
            Закрыть
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="page-card__form" noValidate>
          <p className="page-intro">
            Котиков в заказе: <strong>{state.items.length}</strong>, сумма:{' '}
            <strong>{total.toFixed(2)} ₽</strong>
          </p>

          <div className="page-card__field">
            <label>
              <span>Город*:</span>
              <input value={city} onChange={(e) => setCity(e.target.value)} required />
            </label>
          </div>
          <div className="page-card__field">
            <label>
              <span>Улица*:</span>
              <input value={street} onChange={(e) => setStreet(e.target.value)} required />
            </label>
          </div>
          <div className="page-card__form-row">
            <div className="page-card__field">
              <label>
                <span>Дом*:</span>
                <input value={house} onChange={(e) => setHouse(e.target.value)} required />
              </label>
            </div>
            <div className="page-card__field">
              <label>
                <span>Квартира:</span>
                <input value={apartment} onChange={(e) => setApartment(e.target.value)} />
              </label>
            </div>
          </div>
          <div className="page-card__field">
            <label>
              <span>Комментарий курьеру:</span>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
            </label>
          </div>
          <div className="page-card__radio-group">
            <span>Способ оплаты:</span>
            <label>
              <input
                type="radio"
                name="payment"
                value="card"
                checked={payment === 'card'}
                onChange={() => setPayment('card')}
              />
              Онлайн-картой
            </label>
            <label>
              <input
                type="radio"
                name="payment"
                value="cash"
                checked={payment === 'cash'}
                onChange={() => setPayment('cash')}
              />
              Наличными курьеру
            </label>
          </div>

          {error && <p className="page-card__error">{error}</p>}

          <button
            type="submit"
            data-testId="confirmOrderButton"
            className="page-card__submit"
            disabled={state.items.length === 0 || isSubmitting}>
            Подтвердить заказ
          </button>
        </form>
      )}
    </Modal>
  );
}

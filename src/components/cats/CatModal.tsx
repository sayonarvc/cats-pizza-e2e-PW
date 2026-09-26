import type { Cat } from '../../data/cats';
import { useState } from 'react';
import { Modal } from '../ui/Modal';
import './CatModal.css';

interface CatModalProps {
  cat: Cat | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    furType: string;
    activityLevel: string;
    extras: string[];
    totalPrice: number;
  }) => void;
}

const FUR_TYPES = ['Короткая', 'Средняя', 'Длинная'];
const ACTIVITY_LEVELS = ['Спокойный', 'Игровой', 'Супер-активный'];
const EXTRAS = ['Игрушка', 'Когтеточка', 'Лежанка', 'Страховка на год'];

export function CatModal({ cat, isOpen, onClose, onConfirm }: CatModalProps) {
  const [furType, setFurType] = useState<string>('Средняя');
  const [activityLevel, setActivityLevel] = useState<string>('Игровой');
  const [extras, setExtras] = useState<string[]>([]);

  if (!cat) return null;

  const handleToggleExtra = (extra: string) => {
    setExtras((current) =>
      current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra],
    );
  };

  const handleConfirm = () => {
    onConfirm({ furType, activityLevel, extras, totalPrice });
    onClose();
  };

  const extrasPrice = extras.length * 500;
  const basePrice = cat.price;
  const totalPrice = basePrice + extrasPrice;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={cat.name}>
      <p>{cat.description}</p>

      <div className="cat-modal__options-group">
        <strong>Тип шерсти:</strong>
        <div className="cat-modal__options-row">
          {FUR_TYPES.map((type) => (
            <label key={type} style={{ marginRight: 8 }}>
              <input
                type="radio"
                name="furType"
                value={type}
                checked={furType === type}
                onChange={() => setFurType(type)}
              />{' '}
              {type}
            </label>
          ))}
        </div>
      </div>

      <div className="cat-modal__options-group">
        <strong>Активность:</strong>
        <div className="cat-modal__options-row">
          {ACTIVITY_LEVELS.map((level) => (
            <label key={level} style={{ marginRight: 8 }}>
              <input
                type="radio"
                name="activityLevel"
                value={level}
                checked={activityLevel === level}
                onChange={() => setActivityLevel(level)}
              />{' '}
              {level}
            </label>
          ))}
        </div>
      </div>

      <div className="cat-modal__options-group">
        <strong>Дополнительные опции (+500 ₽ каждая):</strong>
        <div className="cat-modal__extras">
          {EXTRAS.map((extra) => (
            <label key={extra} style={{ display: 'block' }}>
              <input
                type="checkbox"
                checked={extras.includes(extra)}
                onChange={() => handleToggleExtra(extra)}
              />{' '}
              {extra}
            </label>
          ))}
        </div>
      </div>

      <p className="cat-modal__price">
        Базовая цена: {basePrice.toFixed(2)} ₽, доп. опции: {extrasPrice.toFixed(2)} ₽
        <br />
        Итого: <strong>{totalPrice.toFixed(2)} ₽</strong>
      </p>

      <div className="cat-modal__footer">
        <button type="button" onClick={onClose}>
          Отмена
        </button>
        <button type="button" data-testId="catModalAddButton" onClick={handleConfirm}>
          Добавить в корзину
        </button>
      </div>
    </Modal>
  );
}

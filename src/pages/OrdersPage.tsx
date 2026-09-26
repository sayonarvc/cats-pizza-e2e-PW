import { useEffect, useState } from 'react';
import type { CartItem } from '../cart/CartContext';
import { useAuth } from '../auth/AuthContext';

interface Order {
  id: string;
  items: CartItem[];
  totalPrice: number;
  customer: unknown;
  createdAt: string;
}

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch('/api/orders', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить список заказов');
        }

        const data: { orders: Order[] } = await response.json();
        setOrders(data.orders);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Произошла ошибка при загрузке заказов');
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, [token]);

  return (
    <section>
      <h1>Мои заказы</h1>

      {isLoading && <p>Загрузка заказов...</p>}
      {error && !isLoading && <p style={{ color: 'red' }}>{error}</p>}

      {!isLoading && !error && orders.length === 0 && <p>Заказов пока нет.</p>}

      {!isLoading && !error && orders.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} data-testId="ordersList">
          {orders.map((order) => (
            <li
              key={order.id}
              style={{
                marginBottom: 16,
                padding: '12px 14px',
                borderRadius: 10,
                backgroundColor: '#ffffff',
                boxShadow: '0 6px 16px rgba(15, 23, 42, 0.08)',
              }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div>
                  <strong>Заказ {order.id}</strong>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>
                    Оформлен: {new Date(order.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <strong>{order.totalPrice.toFixed(2)} ₽</strong>
                </div>
              </div>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {order.items.map((item, index) => (
                  <li key={`${item.id}-${index}`} style={{ fontSize: 14 }}>
                    {item.name} × {item.quantity} — {item.price.toFixed(2)} ₽
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

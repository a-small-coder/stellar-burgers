import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/slices/feed';
import {
  selectIngredients,
  fetchIngredients
} from '../../services/slices/ingredients';
import { useWebSocket } from '../../hooks/useWebSocket';

const WS_URL =
  process.env.BURGER_WEBSOCKET_URL || 'wss://norma.education-services.ru';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);
  const ingredients = useSelector(selectIngredients);

  // Загружаем ингредиенты, если их нет
  useEffect(() => {
    if (!ingredients || !ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients]);

  const reconnectRef = useRef<(() => void) | null>(null);

  const handleReconnect = useCallback(() => {
    if (reconnectRef.current) {
      reconnectRef.current();
    }
  }, []);

  useWebSocket({
    url: `${WS_URL}/orders/all`,
    type: 'feed',
    onReconnect: (reconnectFn) => {
      reconnectRef.current = reconnectFn;
    }
  });

  if (!orders.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      total={total}
      totalToday={totalToday}
      handleGetFeeds={handleReconnect}
    />
  );
};

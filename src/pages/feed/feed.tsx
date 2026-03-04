import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useCallback, useRef } from 'react';
import { useSelector } from '../../services/store';
import { selectFeedOrders } from '../../services/slices/feed';
import { useWebSocket } from '../../hooks/useWebSocket';

const WS_URL =
  process.env.BURGER_WEBSOCKET_URL || 'wss://norma.education-services.ru';

export const Feed: FC = () => {
  const orders = useSelector(selectFeedOrders);

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

  return <FeedUI orders={orders} handleGetFeeds={handleReconnect} />;
};

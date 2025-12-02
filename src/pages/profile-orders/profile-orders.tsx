import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectOrders } from '../../services/slices/orders';
import { useWebSocket } from '../../hooks/useWebSocket';
import { getCookie } from '../../utils/cookie';

const WS_URL =
  process.env.BURGER_WEBSOCKET_URL || 'wss://norma.education-services.ru';

export const ProfileOrders: FC = () => {
  const orders = useSelector(selectOrders);
  const token = getCookie('accessToken');

  useWebSocket({
    url: `${WS_URL}/orders`,
    type: 'orders',
    token: token?.replace('Bearer ', '')
  });

  return <ProfileOrdersUI orders={orders} />;
};

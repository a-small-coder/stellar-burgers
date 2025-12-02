import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from '../services/store';
import {
  wsConnect,
  wsDisconnect,
  wsError,
  wsMessage
} from '../services/slices/feed';
import {
  wsConnect as ordersWsConnect,
  wsDisconnect as ordersWsDisconnect,
  wsError as ordersWsError,
  wsMessage as ordersWsMessage
} from '../services/slices/orders';
import { TOrdersData } from '@utils-types';

type TUseWebSocketOptions = {
  url: string;
  type: 'feed' | 'orders';
  token?: string;
  onReconnect?: (reconnectFn: () => void) => void;
};

export const useWebSocket = ({
  url,
  type,
  token,
  onReconnect
}: TUseWebSocketOptions) => {
  const dispatch = useDispatch();
  const wsRef = useRef<WebSocket | null>(null);
  const urlRef = useRef<string>('');

  const reconnect = useCallback(() => {
    const wsUrl = token ? `${url}?token=${token}` : url;

    // Закрываем текущее соединение
    if (wsRef.current) {
      const readyState = wsRef.current.readyState;
      if (
        readyState === WebSocket.OPEN ||
        readyState === WebSocket.CONNECTING
      ) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }

    // Создаем новое соединение
    const ws = new WebSocket(wsUrl);
    urlRef.current = wsUrl;

    ws.onopen = () => {
      if (type === 'feed') {
        dispatch(wsConnect());
      } else {
        dispatch(ordersWsConnect());
      }
    };

    ws.onmessage = (event) => {
      const data: TOrdersData = JSON.parse(event.data);
      if (type === 'feed') {
        dispatch(wsMessage(data));
      } else {
        dispatch(ordersWsMessage(data));
      }
    };

    ws.onerror = (error) => {
      const errorMessage =
        error instanceof Error ? error.message : 'WebSocket error';
      if (type === 'feed') {
        dispatch(wsError(errorMessage));
      } else {
        dispatch(ordersWsError(errorMessage));
      }
    };

    ws.onclose = (event) => {
      if (type === 'feed') {
        dispatch(wsDisconnect());
      } else {
        dispatch(ordersWsDisconnect());
      }
      if (wsRef.current === ws) {
        wsRef.current = null;
        urlRef.current = '';
      }
    };

    wsRef.current = ws;
  }, [url, type, token, dispatch]);

  useEffect(() => {
    const wsUrl = token ? `${url}?token=${token}` : url;

    // Если URL не изменился и соединение активно, не переподключаемся
    if (urlRef.current === wsUrl && wsRef.current) {
      const readyState = wsRef.current.readyState;
      if (
        readyState === WebSocket.OPEN ||
        readyState === WebSocket.CONNECTING
      ) {
        if (onReconnect) {
          onReconnect(reconnect);
        }
        return;
      }
    }

    reconnect();

    if (onReconnect) {
      onReconnect(reconnect);
    }

    return () => {
      if (wsRef.current && urlRef.current !== wsUrl) {
        const readyState = wsRef.current.readyState;
        if (
          readyState === WebSocket.OPEN ||
          readyState === WebSocket.CONNECTING
        ) {
          wsRef.current.close();
        }
        wsRef.current = null;
        urlRef.current = '';
      }
    };
  }, [url, type, token, reconnect, onReconnect]);
};

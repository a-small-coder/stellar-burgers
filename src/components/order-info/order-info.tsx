import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredients';
import { selectFeedOrders } from '../../services/slices/feed';
import { selectOrders } from '../../services/slices/orders';
import { getOrderByNumberApi } from '@api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const orders = useSelector(selectOrders);
  const [orderData, setOrderData] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!number) return;

    const orderNumber = parseInt(number, 10);

    // Сначала ищем в ленте заказов
    const feedOrder = feedOrders.find((order) => order.number === orderNumber);
    if (feedOrder) {
      setOrderData(feedOrder);
      setLoading(false);
      return;
    }

    // Затем ищем в истории заказов
    const userOrder = orders.find((order) => order.number === orderNumber);
    if (userOrder) {
      setOrderData(userOrder);
      setLoading(false);
      return;
    }

    // Если не найдено, запрашиваем с сервера
    getOrderByNumberApi(orderNumber)
      .then((response) => {
        if (
          response.success &&
          Array.isArray(response.orders) &&
          response.orders.length > 0
        ) {
          setOrderData(response.orders[0]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [number, feedOrders, orders]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = (orderData.ingredients ?? []).reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo ?? {}).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (loading || !orderData || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

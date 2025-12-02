import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredients';
import { constructorReducer } from './slices/constructor';
import { orderReducer } from './slices/order';
import { userReducer } from './slices/user';
import { feedReducer } from './slices/feed';
import { ordersReducer } from './slices/orders';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  constructorBurger: constructorReducer,
  order: orderReducer,
  user: userReducer,
  feed: feedReducer,
  orders: ordersReducer
});

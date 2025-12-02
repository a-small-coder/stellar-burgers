import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

type TOrdersState = {
  orders: TOrder[];
  wsConnected: boolean;
  error: string | null;
};

const initialState: TOrdersState = {
  orders: [],
  wsConnected: false,
  error: null
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    wsConnect: (state) => {
      state.wsConnected = true;
      state.error = null;
    },
    wsDisconnect: (state) => {
      state.wsConnected = false;
    },
    wsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.wsConnected = false;
    },
    wsMessage: (state, action: PayloadAction<TOrdersData>) => {
      state.orders = action.payload.orders;
    }
  },
  selectors: {
    selectOrders: (state) => state.orders,
    selectOrdersWsConnected: (state) => state.wsConnected,
    selectOrdersError: (state) => state.error
  }
});

export const { wsConnect, wsDisconnect, wsError, wsMessage } =
  ordersSlice.actions;
export const { selectOrders, selectOrdersWsConnected, selectOrdersError } =
  ordersSlice.selectors;

export const ordersReducer = ordersSlice.reducer;

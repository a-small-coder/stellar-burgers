import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  wsConnected: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  wsConnected: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
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
      state.total = action.payload.total;
      state.totalToday = action.payload.totalToday;
    }
  },
  selectors: {
    selectFeedOrders: (state) => state.orders,
    selectFeedTotal: (state) => state.total,
    selectFeedTotalToday: (state) => state.totalToday,
    selectFeedWsConnected: (state) => state.wsConnected,
    selectFeedError: (state) => state.error
  }
});

export const { wsConnect, wsDisconnect, wsError, wsMessage } =
  feedSlice.actions;
export const {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedWsConnected,
  selectFeedError
} = feedSlice.selectors;

export const feedReducer = feedSlice.reducer;

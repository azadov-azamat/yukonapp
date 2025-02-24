import {reducer} from "./reducer"
import {configureStore} from '@reduxjs/toolkit'

export const store = configureStore({
    reducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false, // Bu yerda tekshirishni o'chiramiz
    }),
    devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

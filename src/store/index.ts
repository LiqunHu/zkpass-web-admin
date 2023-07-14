import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from './dashboardSlice'

const store = configureStore({
  reducer: {
    dashboard: counterReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, AppState, unknown, Action<string>>
export default store

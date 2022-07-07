import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface IRequests {
  value: any[];
  numberNotifications: number;
}

// Define the initial state using that type
const initialState: IRequests = {
  value: [],
  numberNotifications: 0
};

export const arrayWordSlice = createSlice({
  name: "collabRequessts",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRequestList: (state, action: PayloadAction<IRequests[]>) => {
      state.value = action.payload;
    },
    setNumberNotifications: (state, action: PayloadAction<number>) => {
      state.numberNotifications = action.payload;
    },
    removeNotification: (state) => {
      state.numberNotifications -= 1;
    }
  },
});

export const { setRequestList, setNumberNotifications, removeNotification } = arrayWordSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectRequests = (state: RootState) => state.collabRequests.value;

export default arrayWordSlice.reducer;

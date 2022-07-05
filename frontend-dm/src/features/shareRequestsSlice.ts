import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../app/store";

// Define a type for the slice state
interface IRequests {
  value: [];
}

// Define the initial state using that type
const initialState: IRequests = {
  value: [],
};

export const arrayWordSlice = createSlice({
  name: "collabRequessts",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setRequestList: (state, action: PayloadAction<[]>) => {
      state.value = action.payload;
    },
  },
});

export const { setRequestList } = arrayWordSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectRequests = (state: RootState) => state.collabRequests.value;

export default arrayWordSlice.reducer;

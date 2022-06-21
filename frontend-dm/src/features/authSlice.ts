import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface IAuth {
  firstConnection: boolean;

  username: string;
}

// Define the initial state using that type
const initialState: IAuth = {
  firstConnection: true,

  username: "",
};

export const authSlice = createSlice({
  name: "authSlice",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setFirstConnection: (state, action: PayloadAction<boolean>) => {
      state.firstConnection = action.payload;
    },
  },
});

export const { setUsername, setFirstConnection } = authSlice.actions;

export default authSlice.reducer;

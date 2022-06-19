import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ISettings {
  inLineDisplay: boolean;

}

const initialState: ISettings = {
  inLineDisplay: JSON.parse(localStorage.getItem("inline-display")!),

};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setInLineDisplay: (state, action: PayloadAction<boolean>) => {
      state.inLineDisplay = (action.payload);
    },

  },
});

export const { setInLineDisplay } = settingsSlice.actions;

export default settingsSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface ISettings {
  isDarkModeToggled: boolean;
}

const initialState: ISettings = {
  isDarkModeToggled: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setIsDarkModeToggled: (state, action: PayloadAction<boolean>) => {
      state.isDarkModeToggled = action.payload;
    },
  },
});

export const { setIsDarkModeToggled } = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSettings = (state: RootState) => state.search.searchInput;

export default settingsSlice.reducer;

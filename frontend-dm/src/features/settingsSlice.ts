import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../app/store";

interface ISettings {

}

const initialState: ISettings = {
 
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {

  },
});

//export const { setIsDarkModeToggled } = settingsSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectSettings = (state: RootState) => state.search.searchInput;

export default settingsSlice.reducer;

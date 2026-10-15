import { UserInterface } from "@/src/utils/interface/userInterface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: UserInterface = {
  email: "",
  image: "",
  name: "",
  userType: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<UserInterface>) => {
      return action.payload;
    },
  },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;

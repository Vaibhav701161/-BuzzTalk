import axios from "axios";
import {create} from "zustand";
import { axiosInstance } from "../lib/axios.js";

export const useAuthStore = create((set) =>({
  authUser: null,
  isSigningUp:false,
  isLoggingIn:false,
  isUpdatingProfile:false,

  isCheckingAuth: true,

  checkAuth: async() => {
    try {
        const response = await axiosInstance.get("/auth/check");
        set({AuthUser:response.data})
    } catch (error) {
        set({AuthUser:null});
        console.log("error in checkAuth:", error);
        
    } finally{
        set({ isCheckingAuth: false});
    }
  },

  signup: async (Data) => {
    set({ isSigningUp: true });
    try {
      const response = await axios.post("/auth/signup", Data);
      set({ authUser: response.data });
    } catch (error) {
      console.log("error in signup:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },
}));

 
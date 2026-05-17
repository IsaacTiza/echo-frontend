import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../lib/api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      fetchUser: async () => {
        set({ isLoading: true });
        try {
          const res = await api.get("/auth/me");
          set({ user: res.data.user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ user: null, isAuthenticated: false, isLoading: false });
        }
      },

      setToken: (token) => {
        localStorage.setItem("echo-token", token);
      },

      logout: async () => {
        try {
          await api.post("/auth/logout");
        } catch (error) {
          console.error(error);
        } finally {
          localStorage.removeItem("echo-token");
          set({ user: null, isAuthenticated: false });
          window.location.href = "/";
        }
      },

      setUser: (user) => set({ user, isAuthenticated: true }),
      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "echo-auth",
    },
  ),
);

export default useAuthStore;

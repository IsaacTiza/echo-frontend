import { create } from "zustand";
import api from "../lib/api";

const useNoteStore = create((set, get) => ({
  notes: [],
  currentNote: null,
  isLoading: false,
  error: null,

  fetchNotes: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get("/notes");
      set({ notes: res.data.notes, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch notes",
        isLoading: false,
      });
    }
  },

  fetchNote: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.get(`/notes/${id}`);
      set({ currentNote: res.data.note, isLoading: false });
      return res.data.note;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to fetch note",
        isLoading: false,
      });
    }
  },

  createNote: async (formData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await api.post("/notes", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      set((state) => ({
        notes: [res.data.note, ...state.notes],
        isLoading: false,
      }));
      return res.data.note;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Failed to create note",
        isLoading: false,
      });
      throw error;
    }
  },

  deleteNote: async (id) => {
    try {
      await api.delete(`/notes/${id}`);
      set((state) => ({
        notes: state.notes.filter((note) => note._id !== id),
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || "Failed to delete note" });
      throw error;
    }
  },

  setCurrentNote: (note) => set({ currentNote: note }),
  clearCurrentNote: () => set({ currentNote: null }),
  clearError: () => set({ error: null }),
}));

export default useNoteStore;

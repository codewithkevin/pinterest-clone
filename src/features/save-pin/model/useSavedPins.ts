import { create } from 'zustand';

type SavedPinsState = {
  savedIds: Set<string>;
  toggleSave: (pinId: string) => void;
  isSaved: (pinId: string) => boolean;
};

export const useSavedPinsStore = create<SavedPinsState>((set, get) => ({
  savedIds: new Set(),
  toggleSave: (pinId) =>
    set((state) => {
      const next = new Set(state.savedIds);
      if (next.has(pinId)) {
        next.delete(pinId);
      } else {
        next.add(pinId);
      }
      return { savedIds: next };
    }),
  isSaved: (pinId) => get().savedIds.has(pinId),
}));

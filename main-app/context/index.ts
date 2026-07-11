import { create } from "zustand";

interface UserState {
  id: string | null;
  clerkId: string | null;
  fullname: string | null;
  email: string | null;
  imageUrl: string | null;

  setUser: (user: {
    id: string;
    clerkId: string;
    fullname: string | null;
    email: string;
    image: string | null;
  }) => void;

  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  id: null,
  clerkId: null,
  fullname: null,
  email: null,
  imageUrl: null,

  setUser: (user) =>
    set({
      id: user.id,
      clerkId: user.clerkId,
      fullname: user.fullname,
      email: user.email,
      imageUrl: user.image,
    }),

  clearUser: () =>
    set({
      id: null,
      clerkId: null,
      fullname: null,
      email: null,
      imageUrl: null,
    }),
}));
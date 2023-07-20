import { defineStore } from "pinia";

export interface IState {
  storeLoaded: boolean;
  accessToken: string | null;
  locale: string;
  imgUrl: string | null;
}

const initState: IState = {
  storeLoaded: false,
  accessToken: null,
  locale: "fr",
  imgUrl: null,
};

export const useStore = defineStore("storage", {
  state: (): IState => initState,
  getters: {
    loggedIn: (state) => !!state.accessToken,
  },
  actions: {
    login() {
      this.mutate("accessToken", "123");
    },
    logout() {
      this.mutate("accessToken", null);
    },
    mutate(key: keyof IState, value: any) {
      this.$patch({ [key]: value });
      chrome.storage.local.set({ [key]: value });
    },
    async init() {
      const result = await chrome.storage.local.get(null);

      this.$patch(result);
      this.storeLoaded = true;
    },
  },
});

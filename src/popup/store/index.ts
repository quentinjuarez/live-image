import { defineStore } from "pinia";

export interface IState {
  accessToken: string | null;
  locale: string;
}

const initState: IState = {
  accessToken: null,
  locale: "fr",
};

export const useStore = defineStore("storage", {
  state: (): IState => initState,
  getters: {
    loggedIn: (state) => !!state.accessToken,
  },
  actions: {
    setAccessToken(accessToken: string) {
      this.accessToken = accessToken;
    },
  },
});

import { defineStore } from 'pinia';
import { WebStorageKeys } from '~/lib/values/general.values';
import { AuthResponseProfile } from '~/lib/types/general.types';

let abortController = null as AbortController | null;

export const useUserStore = defineStore('user', {
  state: () => ({
    jwt: '',
    userId: 0,
    username: '',
    email: '',
  }),

  getters: {
    loggedIn(state) {
      return !!state.jwt;
    },
  },

  actions: {
    async refresh() {
      try {
        if (abortController) {
          abortController.abort();
        }

        abortController = new AbortController();

        const res = await $api.get<AuthResponseProfile>(`/users/me`, undefined, undefined, {
          signal: abortController.signal,
        });

        this.userId = res?.authUser?.id || 0;
        this.username = res?.authUser?.username || '';
        this.email = res?.authUser?.email || '';
      } catch (e: any) {
        if (e?.name !== 'AbortError') {
          console.error(e);
          this.logout();
        }
      }
    },

    logout() {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(WebStorageKeys.USER);
      }

      $api.clearToken();
      this.$reset();
    },
  },

  persist: {
    key: WebStorageKeys.USER,
    storage: persistedState.localStorage,
    paths: ['jwt', 'userId', 'username', 'email'],
  },
});

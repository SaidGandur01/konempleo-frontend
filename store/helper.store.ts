import { defineStore } from "pinia";

interface IHelperStore {}

const defaultState: IHelperStore = {};

export const useHelperStore = defineStore("helper-store", {
  state: () => Object.assign({}, defaultState),
  actions: {
    renderToastMessage(
      toastInstance: any,
      isError = false,
      customMessages?: { pending?: string; success?: string; error?: string }
    ): void {
      const message = customMessages?.success || 'Default success message';
      toastInstance(message, {
        type: isError ? 'error' : 'success', 
      });
    },
  },
});

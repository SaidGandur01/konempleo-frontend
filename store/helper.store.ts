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
      if (isError){
        const message = customMessages?.error|| 'Something went wrong';
        toastInstance(message, {
          type: 'error', 
        });
      }else {
        const message = customMessages?.success || customMessages?.pending || 'Success';
        toastInstance(message, {
          type: 'success', 
        });
      }
      
    },
  },
});

import { useQuasar } from 'quasar';

export function useErrorNotification() {
  const $q = useQuasar();

  const notifyError = (message) => {
    $q.notify({
      type: 'negative',
      message: message,
    });
  };

  return { notifyError };
}

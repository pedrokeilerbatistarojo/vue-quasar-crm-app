import { useQuasar } from 'quasar';

export function useSuccessNotification() {
  const $q = useQuasar();

  const notifySuccess = (message = 'Cambios guardados correctamente') => {
    $q.notify({
      color: 'green-4',
      textColor: 'white',
      icon: 'cloud_done',
      message: message,
    });
  };

  return { notifySuccess };
}

import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 5000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const ToastSuccess = (message) => Toast.fire({ icon: 'success', title: message });

const ToastError = (err) => {
  Toast.fire({
    icon: 'error',
    title: err?.message || err,
  });
};

const toast = { show: Toast, success: ToastSuccess, error: ToastError };

export default toast;

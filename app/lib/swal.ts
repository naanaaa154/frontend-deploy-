import Swal from "sweetalert2";

export const swal = Swal.mixin({
  customClass: {
    popup: "swal2-modern-popup",
    title: "swal2-modern-title",
    htmlContainer: "swal2-modern-text",
    actions: "swal2-modern-actions",
    confirmButton: "swal2-modern-confirm",
    cancelButton: "swal2-modern-cancel",
    icon: "swal2-modern-icon",
  },
  buttonsStyling: false,
  showClass: {
    popup: "swal2-show",
  },
  hideClass: {
    popup: "swal2-hide",
  },
});

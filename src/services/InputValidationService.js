export default {
  isHumanReadableFormat(date) {
    return (
      /^\d{2}\/\d{2}\/\d{4}$/.test(date) ||
      "La fecha no es correcta (dd/mm/yyyy)"
    );
  },
  required: (content) => !!content || "El campo es requerido",
  isPostalCode: (pc) =>
    /^\d{5}$/.test(pc) || "El código postal debe tener 5 dígitos",
  isNumberNotNull: (number) => number !== null && number >= 0 || "El valor tiene que ser mayor o igual que cero",
  isDateSet: (date) => date !== undefined && date !== null && date !== ''
};

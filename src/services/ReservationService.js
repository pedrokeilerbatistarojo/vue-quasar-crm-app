export default {
  getTypesByProduct(product) {
    if (product.circuit_sessions === 0) {
      return [
        {
          label: 'Tratamiento',
          value: 'Treatment',
        },
      ];
    }

    if (product.treatment_sessions === 0) {
      return [
        {
          label: 'Agua',
          value: 'Circuit',
        },
      ];
    }

    return [
      {
        label: 'Agua',
        value: 'Circuit',
      },
      {
        label: 'Tratamiento',
        value: 'Treatment',
      },
    ];
  },
  getDurationByReservationType(type, product){
    if (type === 'Circuit'){
      return product.duration_circuit_schedule ?? 0
    }else if (type === 'Treatment'){
      return product.duration_treatment_schedule ?? 0
    }
  },
  getMaximumNumberOfReservations: (product, quantity) =>
    (product.treatment_sessions + product.circuit_sessions) * quantity,
};

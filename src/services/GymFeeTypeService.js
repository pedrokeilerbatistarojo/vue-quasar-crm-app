export default {
  getColumnsTable: () => [
    { name: 'actions' },
    { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
    {
      name: 'name',
      required: true,
      label: 'Nombre',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'price',
      align: 'left',
      label: 'Precio',
      field: 'price',
      sortable: false,
      format: (v) => `${v} €`,
    },
    {
      name: 'period_type',
      align: 'left',
      label: 'Período',
      field: 'period_type',
      sortable: false,
    },
    {
      name: 'duration_number_of_days',
      align: 'left',
      label: 'Días de duración',
      field: 'duration_number_of_days',
      sortable: false,
    },
  ],
};

export default {
  getColumnsTable: () => [
    { name: 'actions' },
    { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
    {
      name: 'priority',
      required: true,
      label: 'Prioridad',
      align: 'left',
      field: 'priority',
      sortable: false,
    },
    {
      name: 'name',
      required: true,
      label: 'Nombre',
      align: 'left',
      field: 'name',
      sortable: false,
    },
    {
      name: 'type',
      align: 'left',
      label: 'Tipo',
      field: (row) => row.productType?.name,
      sortable: false,
    },
    {
      name: 'short_description',
      align: 'left',
      label: 'Descripción corta',
      field: 'short_description',
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
      name: 'available',
      required: true,
      label: 'Disponible',
      align: 'center',
      field: 'available',
      format: (v) => v ? 'Si' : 'No',
      sortable: false,
    },
    {
      name: 'active',
      required: true,
      label: 'Activo',
      align: 'center',
      field: 'active',
      sortable: false,
    },
  ],
};

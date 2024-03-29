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
      name: 'category',
      align: 'left',
      label: 'Categoría',
      field: (row) => row.category?.name,
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

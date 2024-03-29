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
      name: 'active',
      required: true,
      label: 'Activo',
      align: 'center',
      field: 'active',
      sortable: false,
    },
  ],
};

export default {
  getColumnsTable: () => [
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
      name: 'order',
      align: 'left',
      label: 'Orden',
      field: 'order',
      sortable: true,
    },
  ],
};

import FormatService from "src/services/FormatService";

export default {
  getColumns: () => [
    { name: 'actions' },
    { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
    {
      name: 'client_id',
      align: 'left',
      label: 'Cliente',
      field: (row) => row.client.name,
      sortable: false,
    },
    {
      name: 'gym_fee_type_name',
      required: true,
      label: 'Tipo de cuota',
      align: 'left',
      field: 'gym_fee_type_name',
      sortable: false,
    },
    {
      name: 'price',
      align: 'left',
      label: 'Precio',
      field: 'price',
      format: (v) => `${v} €`,
      sortable: false,
    },
    {
      name: 'activation_date',
      align: 'left',
      label: 'Fecha de alta',
      field: (row) => FormatService.setFullDateFormat(row.activation_date),
      sortable: false,
    },
    {
      name: 'end_date',
      align: 'left',
      label: 'Fecha fin',
      field: (row) => row.end_date === null ? '-' : FormatService.setFullDateFormat(row.end_date),
      sortable: false,
    },
    {
      name: 'state',
      align: 'left',
      label: 'Estado',
      field: (row) => row.end_date === null ? 'Activa' : 'Vencida',
      sortable: false,
    },
  ],
};

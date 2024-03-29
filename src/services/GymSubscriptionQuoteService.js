import FormatService from "src/services/FormatService";

export default {
  getColumns: () => [
    { name: 'actions' },
    { name: 'id', required: true, align: 'left', label: 'Código', field: 'id' },
    {
      name: 'amount',
      align: 'left',
      label: 'Monto',
      field: 'amount',
      sortable: false,
      format: (v) => `${v} €`,
    },
    {
      name: 'date',
      align: 'left',
      label: 'Fecha',
      field: (row) => FormatService.setFullDateFormat(row.date),
      sortable: false,
    },
    {
      name: 'state',
      align: 'left',
      label: 'Estado',
      field: (row) => row.state,
      sortable: false,
    },
  ],
};

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
      name: 'date_from',
      align: 'left',
      label: 'Desde',
      field: (row) => FormatService.setFullDateFormat(row.date_from),
      sortable: false,
    },
    {
      name: 'date_to',
      align: 'left',
      label: 'Hasta',
      field: (row) => FormatService.setFullDateFormat(row.date_to),
      sortable: false,
    },
  ],
};

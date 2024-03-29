import FormatService from "src/services/FormatService";

export default {
  getFullName: (client) =>
    [client.name].join(' '),
  getLOPDStatus: (client) => {
    if (client.lopd_agree === null) {
      return 'Pendiente';
    }
    if (client.lopd_agree === true) {
      return 'Firmada';
    }

    return 'No firma';
  },
  getColumnsTable: () => [
    { name: 'actions' },
    {
      name: 'id',
      required: true,
      align: 'left',
      label: 'Código',
      field: 'id',
    },
    {
      name: 'name',
      required: true,
      label: 'Nombre',
      align: 'left',
      field: (row) =>
        [row.name].join(' '),
      format: (val) => `${val}`,
      sortable: false,
    },
    {
      name: 'email',
      align: 'left',
      label: 'Correo Electrónico',
      field: 'email',
      sortable: false,
    },
    {
      name: 'phone',
      align: 'left',
      label: 'Teléfono',
      field: 'phone',
      sortable: false,
    },
    {
      name: 'document',
      align: 'center',
      label: 'Documento',
      field: 'document',
      sortable: false,
    },
  ],
};

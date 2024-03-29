export default {
  getVisibleColumns(columns) {
    return columns.filter(column => !column.required).map(column => column.name);
  },
};

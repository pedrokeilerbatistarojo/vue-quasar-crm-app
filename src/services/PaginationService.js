export default {
  getPaginationData(pagination) {
    let next = null;
    let prev = null;

    if (
      pagination.total_pages > 1 &&
      pagination.current_page < pagination.total_pages
    ) {
      next = pagination.current_page + 1;
    }

    if (pagination.total_pages > 1 && pagination.current_page > 1) {
      prev = pagination.current_page - 1;
    }

    return {
      sortBy: null,
      descending: false,
      page: pagination.current_page,
      rowsPerPage: pagination.per_page,
      rowsNumber: pagination.total,
      totalPages: pagination.total_pages,
      next: next,
      prev: prev,
    };
  },
};

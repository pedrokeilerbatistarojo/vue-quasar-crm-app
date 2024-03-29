export default {
  getSourceColor(source) {
    if (source === 'Web') {
      return 'blue-2';
    }

    return 'orange-3';
  },
  getStatusIconName(status) {
    if (status === 'Annulled') {
      return 'highlight_off';
    }

    if (status === 'Paid') {
      return 'check_circle_outline';
    }

    return 'schedule';
  },
};

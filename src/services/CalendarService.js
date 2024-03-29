export default {
  getBasicStyles: (event, calendarType, calendarScope) => {
    const styles = {
      position: 'absolute',
      background: '#0b417d',
      color: 'white',
      'font-size': '12px',
      left: 0,
    };

    if (calendarType === 'resource') {
      const left = calendarScope.timeStartPosX(event.time);
      const width = calendarScope.timeDurationWidth(event.duration);
      styles.left = left + 'px';
      styles.width = width + 'px';
      styles.height = '120px';
    } else {
      if (
        calendarScope.timeStartPos &&
        calendarScope.timeDurationHeight
      ) {
        styles.top = calendarScope.timeStartPos(event.time) + 'px';
        styles.height =
          calendarScope.timeDurationHeight(event.duration) + 'px';
      }

      styles.width = 'calc(100% - 2px)';
    }

    return styles;
  }
}

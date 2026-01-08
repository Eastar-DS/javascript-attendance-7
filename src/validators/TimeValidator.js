class TimeValidator {
  static validate(time) {
    const timePattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timePattern.test(time)) {
      throw new Error('[ERROR] 잘못된 형식을 입력하였습니다.');
    }

    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    const campusOpen = 8 * 60;
    const campusClose = 23 * 60;

    if (totalMinutes < campusOpen || totalMinutes > campusClose) {
      throw new Error('[ERROR] 캠퍼스 운영 시간에만 출석이 가능합니다.');
    }
  }
}

export default TimeValidator;

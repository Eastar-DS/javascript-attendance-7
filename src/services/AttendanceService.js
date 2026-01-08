class AttendanceService {
  static WEEKDAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  static determineStatus(date, time) {
    const dayOfWeek = date.getDay();
    const [hours, minutes] = time.split(':').map(Number);
    const arrivalMinutes = hours * 60 + minutes;

    // 월요일: 13:00, 화~금: 10:00
    const startTime = dayOfWeek === 1 ? 13 * 60 : 10 * 60;

    const diff = arrivalMinutes - startTime;

    if (diff <= 5) {
      return '출석';
    }
    if (diff <= 30) {
      return '지각';
    }
    return '결석';
  }

  static formatAttendanceRecord(date, time) {
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = date.getDay();
    const dayName = this.WEEKDAY_NAMES[dayOfWeek];
    const status = this.determineStatus(date, time);

    return `${month}월 ${day}일 ${dayName} ${time} (${status})`;
  }
}

export default AttendanceService;

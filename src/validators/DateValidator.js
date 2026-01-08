import { DateTimes } from '@woowacourse/mission-utils';

class DateValidator {
  static WEEKDAY_NAMES = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];

  static validateIsWorkingDay() {
    const today = DateTimes.now();
    const dayOfWeek = today.getDay();

    // 0: 일요일, 6: 토요일
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const month = today.getMonth() + 1;
      const date = today.getDate();
      const dayName = this.WEEKDAY_NAMES[dayOfWeek];

      throw new Error(`[ERROR] ${month}월 ${date}일 ${dayName}은 등교하는 날이 아닙니다.`);
    }
  }
}

export default DateValidator;

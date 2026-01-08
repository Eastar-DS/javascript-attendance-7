import { DateTimes } from '@woowacourse/mission-utils';

class Attendance {
  #nickname;

  #date;

  #time;

  constructor(nickname, date, time) {
    this.#nickname = nickname;
    this.#date = date;
    this.#time = time;
  }

  getNickname() {
    return this.#nickname;
  }

  getDate() {
    return this.#date;
  }

  getTime() {
    return this.#time;
  }

  static getToday() {
    const today = DateTimes.now();
    const koreaTime = new Date(today.getTime() + 9 * 60 * 60 * 1000);
    const date = koreaTime.split('T')[0];
    const time = koreaTime.split('T')[1].substring(0, 5);
    return [date, time];
  }
}

export default Attendance;

import { Console, DateTimes } from '@woowacourse/mission-utils';
import TimeValidator from './validators/TimeValidator.js';
import NicknameValidator from './validators/NicknameValidator.js';
import DateValidator from './validators/DateValidator.js';
import AttendanceService from './services/AttendanceService.js';
import AttendanceRepository from './models/AttendanceRepository.js';

class App {
  constructor() {
    this.repository = new AttendanceRepository();
  }

  async run() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const menu = await Console.readLineAsync('기능을 선택하세요: ');

      if (menu === 'Q' || menu === 'q') {
        break;
      }

      if (menu === '1') {
        // eslint-disable-next-line no-await-in-loop
        await this.handleAttendanceCheck();
      } else if (menu === '2') {
        // eslint-disable-next-line no-await-in-loop
        await this.handleAttendanceModify();
      } else if (menu === '3') {
        // eslint-disable-next-line no-await-in-loop
        await this.handleCrewRecords();
      }
    }
  }

  async handleAttendanceCheck() {
    DateValidator.validateIsWorkingDay();

    const nickname = await Console.readLineAsync('닉네임을 입력하세요: ');
    NicknameValidator.validate(nickname);

    const time = await Console.readLineAsync('등교 시간을 입력하세요: ');
    TimeValidator.validate(time);

    const today = DateTimes.now();
    const record = AttendanceService.formatAttendanceRecord(today, time);
    Console.print(record);
  }

  async handleAttendanceModify() {
    const nickname = await Console.readLineAsync('닉네임을 입력하세요: ');
    NicknameValidator.validate(nickname);

    const dayInput = await Console.readLineAsync('수정하려는 날짜를 입력하세요: ');
    const day = parseInt(dayInput, 10);

    const time = await Console.readLineAsync('등교 시간을 입력하세요: ');
    TimeValidator.validate(time);

    const result = this.repository.modifyAttendance(nickname, 12, day, time);
    Console.print(result);
  }

  async handleCrewRecords() {
    const nickname = await Console.readLineAsync('닉네임을 입력하세요: ');
    NicknameValidator.validate(nickname);

    const records = this.repository.getCrewRecords(nickname, '2024-12-02', '2024-12-12');
    records.forEach((record) => Console.print(record));

    Console.print('');

    const { attendCount, lateCount, absentCount } = this.repository.getCrewSummary(
      nickname,
      '2024-12-02',
      '2024-12-12'
    );
    Console.print(`출석: ${attendCount}회`);
    Console.print(`지각: ${lateCount}회`);
    Console.print(`결석: ${absentCount}회`);

    Console.print('');

    const category = this.repository.getCrewCategory(absentCount, lateCount);
    if (category) {
      Console.print(category);
    }
  }
}

export default App;

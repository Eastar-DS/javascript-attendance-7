import { Console, DateTimes } from '@woowacourse/mission-utils';
import Attendance from '../models/Attendance';

class AttendanceController {
  async start() {
    Console.print('1. **출석 확인**');
    Console.print('2. **출석 수정**');
    Console.print('3. **크루별 출석 기록 확인**');
    Console.print('4. **제적 위험자 확인**');
    Console.print('Q. **종료**');
    const menu = await Console.readLineAsync('[1,2,3,4,Q]중 원하는 메뉴를 선택해주세요.');

    if (menu === 'Q') {
      throw Error();
    }

    if (menu === '1') {
      const nickname = await Console.readLineAsync('닉네임을 입력해주세요.');
      const timeString = await Console.readLineAsync('등교 시간을 입력해주세요.');
      const [date, time] = Attendance.getToday();
      // csv에 추가하는 코드

      //
    }
  }
}

export default AttendanceController;

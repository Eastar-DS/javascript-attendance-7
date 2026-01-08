import { Console } from '@woowacourse/mission-utils';
import TimeValidator from './validators/TimeValidator.js';

class App {
  async run() {
    const menu = await Console.readLineAsync('기능을 선택하세요: ');

    if (menu === '1') {
      const nickname = await Console.readLineAsync('닉네임을 입력하세요: ');
      const time = await Console.readLineAsync('등교 시간을 입력하세요: ');

      TimeValidator.validate(time);
      Console.print(nickname); // TODO: 임시로 사용
    }
  }
}

export default App;

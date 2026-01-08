import { Console, DateTimes } from '@woowacourse/mission-utils';
import App from '../src/App.js';

const mockQuestions = (inputs) => {
  const messages = [];

  Console.readLineAsync = jest.fn((prompt) => {
    messages.push(prompt);
    const input = inputs.shift();

    if (input === undefined) {
      throw new Error('NO INPUT');
    }

    return Promise.resolve(input);
  });

  Console.readLineAsync.messages = messages;
};

const mockNowDate = (date = null) => {
  const mockDateTimes = jest.spyOn(DateTimes, 'now');
  mockDateTimes.mockReturnValue(new Date(date));

  return mockDateTimes;
};

const getLogSpy = () => {
  const logSpy = jest.spyOn(Console, 'print');
  logSpy.mockClear();
  return logSpy;
};

const LINE_SEPARATOR = '\n';

const getOutput = (logSpy) => [...logSpy.mock.calls].join(LINE_SEPARATOR);

const expectLogContains = (received, expects) => {
  expects.forEach((exp) => {
    expect(received).toContain(exp);
  });
};

const runExceptions = async ({ inputs = [], expectedErrorMessage = '' }) => {
  mockQuestions([...inputs]);

  const app = new App();

  await expect(app.run()).rejects.toThrow(expectedErrorMessage);
};

const run = async ({ inputs = [], inputsToTerminate = [], expected = [] }) => {
  const logSpy = getLogSpy();
  mockQuestions([...inputs, ...inputsToTerminate]);

  const app = new App();
  await app.run();

  const output = getOutput(logSpy);

  if (expected.length > 0) {
    expectLogContains(output, expected);
  }
};

const INPUTS_TO_TERMINATE = ['q'];

describe('추가 테스트', () => {
  test('제적 위험자 확인 기능 테스트', async () => {
    mockNowDate('2024-12-13');

    await run({
      inputs: ['4'],
      inputsToTerminate: INPUTS_TO_TERMINATE,
      expected: ['면담 대상자', '빙티', '이든', '경고 대상자', '빙봉', '쿠키'],
    });
  });

  test('중복 출석 방지 테스트', async () => {
    mockNowDate('2024-12-13');

    await runExceptions({
      inputs: ['1', '짱수', '08:00', '1', '짱수', '09:00'],
      expectedErrorMessage:
        '[ERROR] 이미 출석을 확인하였습니다. 필요한 경우 수정 기능을 이용해 주세요.',
    });
  });

  test('운영 시간 외 입력 예외 테스트', async () => {
    mockNowDate('2024-12-13');

    await runExceptions({
      inputs: ['1', '짱수', '07:59'],
      expectedErrorMessage: '[ERROR] 캠퍼스 운영 시간에만 출석이 가능합니다.',
    });
  });

  test('미래 날짜 수정 방지 테스트', async () => {
    mockNowDate('2024-12-13');

    await runExceptions({
      inputs: ['2', '짱수', '14', '10:00'],
      expectedErrorMessage: '[ERROR] 아직 수정할 수 없습니다.',
    });
  });

  test('지각 판정 테스트 - 월요일', async () => {
    mockNowDate('2024-12-16');

    await run({
      inputs: ['1', '짱수', '13:06'],
      inputsToTerminate: INPUTS_TO_TERMINATE,
      expected: ['12월 16일 월요일 13:06 (지각)'],
    });
  });

  test('지각 판정 테스트 - 화요일', async () => {
    mockNowDate('2024-12-17');

    await run({
      inputs: ['1', '짱수', '10:06'],
      inputsToTerminate: INPUTS_TO_TERMINATE,
      expected: ['12월 17일 화요일 10:06 (지각)'],
    });
  });
});

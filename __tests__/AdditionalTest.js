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
});

class TimeValidator {
  static validate(time) {
    const timePattern = /^([0-1][0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timePattern.test(time)) {
      throw new Error('[ERROR] 잘못된 형식을 입력하였습니다.');
    }
  }
}

export default TimeValidator;

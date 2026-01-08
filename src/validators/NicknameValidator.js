class NicknameValidator {
  static VALID_NICKNAMES = ['쿠키', '빙봉', '빙티', '이든', '짱수'];

  static validate(nickname) {
    if (!this.VALID_NICKNAMES.includes(nickname)) {
      throw new Error('[ERROR] 등록되지 않은 닉네임입니다.');
    }
  }
}

export default NicknameValidator;

import CsvReader from '../services/CsvReader.js';
import AttendanceService from '../services/AttendanceService.js';

class AttendanceRepository {
  constructor() {
    this.records = new Map(); // key: "nickname-date", value: time
    this.loadFromCsv();
  }

  loadFromCsv() {
    const csvRecords = CsvReader.readAttendances('public/attendances.csv');
    csvRecords.forEach(({ nickname, datetime }) => {
      const [date, time] = datetime.split(' ');
      const key = `${nickname}-${date}`;
      this.records.set(key, time);
    });
  }

  hasAttendance(nickname, date) {
    const dateStr =
      typeof date === 'string'
        ? date
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const key = `${nickname}-${dateStr}`;
    return this.records.has(key);
  }

  addAttendance(nickname, date, time) {
    const dateStr =
      typeof date === 'string'
        ? date
        : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    const key = `${nickname}-${dateStr}`;
    this.records.set(key, time);
  }

  modifyAttendance(nickname, month, day, newTime) {
    const date = `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const key = `${nickname}-${date}`;
    const oldTime = this.records.get(key) || '--:--';

    const dateObj = new Date(date);
    const oldStatus =
      oldTime === '--:--' ? '결석' : AttendanceService.determineStatus(dateObj, oldTime);
    const newStatus = AttendanceService.determineStatus(dateObj, newTime);

    this.records.set(key, newTime);

    const dayOfWeek = dateObj.getDay();
    const dayName = AttendanceService.WEEKDAY_NAMES[dayOfWeek];

    return `${month}월 ${day}일 ${dayName} ${oldTime} (${oldStatus}) -> ${newTime} (${newStatus}) 수정 완료!`;
  }

  getCrewRecords(nickname, startDate, endDate) {
    const records = [];
    const current = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        const day = current.getDate();
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const key = `${nickname}-${dateStr}`;
        const time = this.records.get(key) || '--:--';
        const dayName = AttendanceService.WEEKDAY_NAMES[dayOfWeek];
        const status = time === '--:--' ? '결석' : AttendanceService.determineStatus(current, time);

        records.push(`${month}월 ${String(day).padStart(2, '0')}일 ${dayName} ${time} (${status})`);
      }
      current.setDate(current.getDate() + 1);
    }

    return records;
  }

  getCrewSummary(nickname, startDate, endDate) {
    const current = new Date(`${startDate}T00:00:00`);
    const end = new Date(`${endDate}T00:00:00`);
    let attendCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const year = current.getFullYear();
        const month = current.getMonth() + 1;
        const day = current.getDate();
        const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const key = `${nickname}-${dateStr}`;
        const time = this.records.get(key);

        if (!time || time === '--:--') {
          absentCount += 1;
        } else {
          const status = AttendanceService.determineStatus(current, time);
          if (status === '출석') attendCount += 1;
          else if (status === '지각') lateCount += 1;
          else absentCount += 1;
        }
      }
      current.setDate(current.getDate() + 1);
    }

    return { attendCount, lateCount, absentCount };
  }

  // eslint-disable-next-line class-methods-use-this
  getCrewCategory(absentCount, lateCount) {
    const totalAbsent = absentCount + Math.floor(lateCount / 3);
    if (totalAbsent > 5) return '제적 대상자';
    if (totalAbsent >= 3) return '면담 대상자';
    if (totalAbsent >= 2) return '경고 대상자';
    return null;
  }

  getAllCrewsAtRisk(startDate, endDate) {
    const nicknames = ['쿠키', '빙봉', '빙티', '이든', '짱수'];
    const crewsData = [];

    nicknames.forEach((nickname) => {
      const { attendCount, lateCount, absentCount } = this.getCrewSummary(
        nickname,
        startDate,
        endDate
      );
      const totalAbsent = absentCount + Math.floor(lateCount / 3);
      const category = this.getCrewCategory(absentCount, lateCount);

      if (category) {
        crewsData.push({
          nickname,
          attendCount,
          lateCount,
          absentCount,
          totalAbsent,
          category,
        });
      }
    });

    // 정렬: 결석 많은 순, 닉네임 오름차순
    crewsData.sort((a, b) => {
      if (b.totalAbsent !== a.totalAbsent) {
        return b.totalAbsent - a.totalAbsent;
      }
      return a.nickname.localeCompare(b.nickname);
    });

    // 카테고리별로 분류
    const result = {
      제적_대상자: [],
      면담_대상자: [],
      경고_대상자: [],
    };

    crewsData.forEach((crew) => {
      if (crew.category === '제적 대상자') {
        result.제적_대상자.push(crew);
      } else if (crew.category === '면담 대상자') {
        result.면담_대상자.push(crew);
      } else if (crew.category === '경고 대상자') {
        result.경고_대상자.push(crew);
      }
    });

    return {
      제적_대상자: result.제적_대상자,
      면담_대상자: result.면담_대상자,
      경고_대상자: result.경고_대상자,
    };
  }
}

export default AttendanceRepository;

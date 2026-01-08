import fs from 'fs';

class CsvReader {
  static readAttendances(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.trim().split('\n');
    const records = [];

    for (let i = 1; i < lines.length; i += 1) {
      const line = lines[i].trim();
      if (line) {
        const [nickname, datetime] = line.split(',');
        records.push({ nickname, datetime });
      }
    }

    return records;
  }
}

export default CsvReader;

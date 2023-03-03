import { randomInt } from '../randomUtils';

describe('Random utility', () => {
  
  test('generates random integer correctly', () => {
    for (let i = 0; i < 100; i += 1) {
      const r1 = randomInt(0, 1);
      expect(r1 <= 1).toBe(true);
      expect(r1 >= 0).toBe(true);

      const r2 = randomInt(0, i);
      expect(r2 <= i).toBe(true);
      expect(r2 >= 0).toBe(true);
    }
  })
})
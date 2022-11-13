import { effect } from '../effect';
import { ref } from '../ref';

describe('reactive', () => {

  test('ref func', () => {
    const a = ref(1);
    expect(a.value).toBe(1);
  });

  test('should be reactive', () => {
    const a = ref(1);
    let dummy;
    let calls = 0;
    effect(() => { // 需要ref收集依赖以及触发依赖
      calls ++;
      dummy = a.value;
    })
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
    // 相同的value 不应该被触发
    a.value = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });
})

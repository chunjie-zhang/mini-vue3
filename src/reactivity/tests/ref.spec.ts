import { effect } from '../effect';
import { reactive } from '../reactive';
import { isRef, proxyRefs, ref, unRef } from '../ref';

describe('reactive', () => {

  test('ref func', () => {
    const a = ref(1);
    expect(a.value).toBe(1);
    a.value = 2;
    expect(a.value).toBe(2);
  });

  test('should be ref', () => {
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

  test('should make nested properties reactive', () => {
    const a = ref({
      count: 1
    });
    let dummy;
    let calls = 0;
    effect(() => { // 需要ref收集依赖以及触发依赖
      calls ++;
      dummy = a.value.count;
    })
    expect(calls).toBe(1);
    expect(dummy).toBe(1);
    a.value.count = 2;
    expect(calls).toBe(2);
    expect(dummy).toBe(2);
  });

  test('isRef', () => {
    const a = ref({
      count: 1
    });
    
    const b = reactive({
      count: 1
    });

    expect(isRef(a)).toBe(true);
    expect(isRef(1)).toBe(false);
    expect(isRef(b)).toBe(false);
  });
  
  test('unRef', () => {
    const a = ref(1);
    
    expect(unRef(a)).toBe(1);
    expect(unRef(1)).toBe(1);
  });

  test('proxyRefs', () => {
    const user = {
      age: ref(18),
      name: 'zhangchunjie'
    };
    
    const proxyUser = proxyRefs(user);
    expect(user.age.value).toBe(18);
    expect(proxyUser.age).toBe(18);
    expect(proxyUser.name).toBe('zhangchunjie');

    proxyUser.age = 20;
    expect(proxyUser.age).toBe(20);
    expect(user.age.value).toBe(20);

  });

})

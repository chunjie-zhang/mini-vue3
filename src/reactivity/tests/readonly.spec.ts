import { readonly, isReadonly } from "../reactive";

describe('readonly', () => {
  it('readonly test', () => {

    // 不能set,不收集依赖
    const original = { name: 'zcj', age: 1,};
    const wrapped = readonly(original);
    expect(wrapped).not.toBe(original);
    expect(wrapped.name).toBe('zcj');
    expect(isReadonly(wrapped)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  });

  it('warn set', () => {
    // 不能set,set有错误提示
    console.warn = jest.fn();

    const original = { name: 'zcj', age: 1,};
    const wrapped = readonly(original);

    wrapped.age = 10

    expect(console.warn).toBeCalled();

  });
});
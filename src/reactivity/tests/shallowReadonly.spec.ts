import { isReadonly, shallowReadonly } from '../reactive';

describe('shallowReadonly', () => {
  /**、
   * shallow是表层的意思，指表层是readonly，里面嵌套的引用是普通对象
   */
  it('表层是readonly', () => {
    const props = shallowReadonly({ n: {foo: 1}});
    expect(isReadonly(props)).toBe(true);
    expect(isReadonly(props.n)).toBe(false);
  });

  it('warn set', () => {
    // 不能set,set有错误提示
    console.warn = jest.fn();

    const original = { name: 'zcj', age: 1,};
    const wrapped = shallowReadonly(original);

    wrapped.age = 10;

    expect(console.warn).toBeCalled();

  });
});
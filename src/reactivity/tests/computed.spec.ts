import { computed } from "../computed";
import { reactive } from "../reactive";

describe('computed', () => {
  // 和ref一样需要.value
  // 有缓存
  it('test computed', () => {
    const user = reactive({
      age: 18,
      name: 'zhangchunjie'
    });

    const age = computed(() => {
      return user.age;
    });

    expect(age.value).toBe(18);
  });

  it('computed 懒加载', () => {
    const value = reactive({
      foo: 1,
    });
    const getter = jest.fn(() => {
      return value.foo;
    });
    const cValue = computed(getter);
    // lazy
    expect(getter).not.toHaveBeenCalled();
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute agein
    cValue.value;  // 触发get操作
    expect(getter).toHaveBeenCalledTimes(1);

    // should not compute until needed
    value.foo = 2; // trigger -> effect
    expect(getter).toHaveBeenCalledTimes(1);

    expect(cValue.value).toBe(2);
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
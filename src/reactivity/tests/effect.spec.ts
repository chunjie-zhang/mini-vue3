import { reactive } from "../reactive";
import { effect, stop } from "../effect";

describe('effect 测试', () => {
  test('effect', () => {
    const user = reactive({
      name: 'zhang',
    });

    let nextName = '';

    effect(() => {
      nextName = user.name + 'chunjie';
    });

    expect(nextName).toBe('zhangchunjie');

    // update
    user.name = 'zcj';

    expect(nextName).toBe('zcjchunjie');
  });

  it('effect的runner', () => {
    // effect(fn) -> function runner -> fn() -> return
    let num = 10;

    const runner = effect(() => {
      num ++;
      return num;
    });

    expect(num).toBe(11);

    const add = runner();

    expect(add).toBe(12);
    expect(num).toBe(12);
  });

  it('scheduler', () => {
    // 1. 通过 effect 的第二个参数给定的 scheduler 的 fn
    // 2. effect 第一次执行的时候 还会执行fn
    // 3. 当响应式对象 set 更新时，不会执行fn， 而是执行 scheduler
    // 4. 当执行runner的时候，会再次执行fn

    let dummy;
    let run;
    const scheduler = jest.fn(() => {
      run = runner;
    });
    const obj = reactive({
      age: 1,
    });

    const runner = effect(() => {
      dummy = obj.age;
    }, { scheduler });
    
    expect(scheduler).not.toHaveBeenCalled(); // 没有被调用
    expect(dummy).toBe(1);
    obj.age++; // 数据更新后会调用scheduler,而不是第一个回调
    expect(scheduler).toHaveBeenCalledTimes(1); // 被调用的次数
    expect(dummy).toBe(1);

    run();

    expect(dummy).toBe(2);
  });

  it('stop', () => {
    let dummy;
    const obj = reactive({ age: 1 });
    const runner = effect(() => {
      dummy = obj.age;
    });

    obj.age = 2;
    expect(dummy).toBe(2);

    stop(runner); // 更新数据，不会执行回调
    
    obj.age = 3;
    expect(dummy).toBe(2);

    runner(); // 执行runner会执行回调
    expect(dummy).toBe(3);
  });

  it('onStop', () => {
    const obj = reactive({
      age: 10,
    });
    const onStop = jest.fn();
    let dummy;
    const runner = effect(() => {
      dummy = obj.age;
    }, {
      onStop,
    })
    stop(runner);
    expect(onStop).toBeCalledTimes(1);
  });


});
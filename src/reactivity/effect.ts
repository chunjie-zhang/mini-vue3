import { extend } from "../shared";

let activeEffect: this; // 存储ReactiveEffect的实例对象
const targetMap = new Map(); // 存储代理对象

class ReactiveEffect {
  private _fn: any; // 收集回调
  public scheduler: any // 收集scheduler
  public deps = []; // 收集依赖
  public activeStop = true; // 是否可以删除
  public onStop?: () => void;

  constructor(fn, scheduler?) {
    this._fn = fn;
    this.scheduler = scheduler
  };

  // 执行回调
  run () {
    activeEffect = this // 获取实例对象
    return this._fn();
  };

  // 删除依赖
  stop() {
    if(this.activeStop) { // 防止多次触发同一个stop
      clearEffect(this);
      if(this.onStop) { // 执行onStop
        this.onStop();
      }
      this.activeStop = false;
    }
  };
}

// 删除实例对象
function clearEffect (effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}
// 进行依赖收集
export function track(target, key) {
  // target -> key -> dep
  let depsMap = targetMap.get(target); // 获取map中的代理对象的键值

  if (!depsMap) { // 如果一开始没有depsMap就创建新的，初始化
    depsMap = new Map(); 
    targetMap.set(target, depsMap);
  }

  let dep = depsMap.get(key);
  if (!dep) { // 如果没有fn集合,就创建一个空集合，初始化
    dep = new Set();
    depsMap.set(key, dep);
  }

  /**
   * 因为actvieEffect是在 ReactiveEffect的实例对象run执行时才赋值，
   * 所以在不执行effect，直接是读取代理对象的值收集依赖时是没有activeEffect的
  */
  if(!activeEffect) return;

  // todo 增加多个一样的reactiveEffect的实例对象
  // 用set解决
  dep.add(activeEffect); // 存储ReactiveEffect的实例对象
  
  activeEffect.deps.push(dep); // 收集dep
};

// 触发依赖
export function trigger(target, key, value) {
  let depsMap = targetMap.get(target);
  let deps = depsMap.get(key);
  for ( const effect of deps) {
    if (effect.scheduler) {
      effect.scheduler(); // 触发scheduler，更新数据
    } else {
      effect.run(); // 触发回调，更新数据
    }
  }
};

// 停止更新fn
export function stop(runner) {
  runner.effect.stop(); // 执行ReactiveEffect的实例对象的stop方法
};

// effect函数
export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);

  // _effect.onStop = options.onStop;
  extend(_effect, options);

  _effect.run(); // 一开始执行回调

  const runner = _effect.run.bind(_effect); // effect的返回值，是他的第一个参数fn

  runner.effect = _effect; // runner函数上添加属性effect是ReactiveEffect的实例对象

  return runner;
};

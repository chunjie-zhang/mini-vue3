import { track, trigger } from './effect';
import { ReactiveFlags } from './reactive';

// 一开始加载的时候获取，不再重复的执行函数，减少开销
const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

// get函数代码复用
function createGetter(isReadonly = false) {
  return function get(target, key) {
      // 判断是否是reactive对象
      if(key === ReactiveFlags.IS_REACTIVE) {
        return !isReadonly;
      } else if(key === ReactiveFlags.IS_READONLY) { // 是否是readonly对象
        return isReadonly;
      };

      // 如果是readonly不收集依赖
      if(!isReadonly) {
        // todo: 依赖收集
        track(target, key);
      }
      const res = Reflect.get(target, key)
      return res;
  };
};

// set 代码复用

function createSetter() {
  return function set(target, key, value) {
    const res = Reflect.set(target, key, value);
    // todo 触发依赖
    trigger(target, key, value);
    return res;
  };
};

export const mutableHandlers = { // 返回代理对象
  get,
  set,
};

export const readonlyHandlers = { // 返回代理对象
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key: ${key} set 失败 因为 target 是 readonly`, target);
    return true;
  },
};
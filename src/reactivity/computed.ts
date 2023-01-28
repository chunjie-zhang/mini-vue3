import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _getter;
  private _dirty: boolean = true; // 是否可以执行get，用于缓存判断get是否重新调用
  private _value; // 记录getter的结果，用于缓存，直接返回结果，不在调用getter
  private _effect; // 收集computed响应式依赖
  constructor(getter) {
    this._getter = getter;

    // 收集computed响应式依赖
    // 因为收集依赖的track需要由shouldTrack判断需不需要收集依赖，如果直接执行响应式的getter触发track是不收集依赖的，得在ReactiveEffect的run执行时才会收集
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) { // 防止响应式依赖trigger后还会执行getter&响应式更新后需要重置_dirty，不在从缓存拿数据
        this._dirty = true;
      }
    })
  }

  get value() {

    // 如果get的value的依赖的响应式对象的值发生变化_dirty需要重置为true

    // 如果没有缓存，直接执行getter
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
      return this._value;
    }
    // 直接拿缓存的值
    return this._value;
  }
}

export function computed (getter) {
  return new ComputedRefImpl(getter)
}
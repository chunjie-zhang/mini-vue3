import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffect, triggerEffects } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value;
  private _rawValue; // 真实value
  public dep; // 依赖

  constructor(value: any) {
    // 如果value是对象，那么在set的时候我们判断的_value是代理对象不是真的真实对象，所以要先记录
    this._rawValue = value;
    // 判断value是否是一个对象，如果是对象用reactive包裹一层
    this._value = convort(value);
    this.dep = new Set();
  };

  get value() {
    this.trackRefValue(this)
    return this._value;
  };
  
  set value(newVal) {
    // 相同的value 不应该被触发
    if (hasChanged(newVal, this._rawValue)) return;

    // 如果value是对象，那么在set的时候我们判断的_value是代理对象不是真的真实对象，所以要先记录
    this._rawValue = newVal;
    // 判断value是否是一个对象，如果是对象用reactive包裹一层
    this._value = convort(newVal);
    triggerEffects(this.dep);
  };

  // 判断是否需要收集依赖（是否在effect执行过）
  trackRefValue (ref) {
    if(isTracking()) {
      trackEffect(ref.dep);
    }
  }
};

// 转换value
function convort (value) {
  return isObject(value) ? reactive(value) : value;
}

export function ref(value: any) {
  return new RefImpl(value);
};
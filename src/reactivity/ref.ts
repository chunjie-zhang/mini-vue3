import { trackEffect, triggerEffects } from "./effect";

class RefImpl {
  private _value;
  public dep; // 依赖

  constructor(value: any) {
    this._value = value;
    this.dep = new Set();
  };

  get value() {
    trackEffect(this.dep);
    return this._value;
  };
  set value(newVal) {
    this._value = newVal;
    triggerEffects(this.dep);
  };
};

export function ref(value: any) {
  return new RefImpl(value);
};
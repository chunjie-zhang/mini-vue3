import { mutableHandlers, readonlyHandlers, shallowReadonlyHandler } from "./baseHandlers";

function createActiveObject (obj, baseHandlers) {
  return new Proxy(obj, baseHandlers);
};

export const enum ReactiveFlags {
  IS_REACTIVE = '__V_isReactive', // 验证是否是reactive对象
  IS_READONLY = '__V_isReadonly', // 验证是否是readonly对象
};

// reactive
export function reactive(obj:object) {
  return createActiveObject(obj, mutableHandlers);
};

// readonly
export function readonly(obj:object) {
  return createActiveObject(obj, readonlyHandlers);
};

// shallowReadonly
export function shallowReadonly(obj: object) {
  return createActiveObject(obj, shallowReadonlyHandler);
};

// 是否是reactive对象
export function isReactive(value) {
  return !!value[ReactiveFlags.IS_REACTIVE] // 有可能是真实的对象，会返回undefined，所以转了一下
};

// 是否是readonly对象
export function isReadonly(value) {
  return !!value[ReactiveFlags.IS_READONLY] // 有可能是真实的对象，会返回undefined，所以转了一下
};
export const extend = Object.assign;

// 判断是否为对象
export const isObject =  (obj) => {
  return obj !== null && typeof obj === "object";
}

// 是否相同
export const hasChanged = (newVal: any, oldValue: any) => {
  return Object.is(newVal, oldValue);
}
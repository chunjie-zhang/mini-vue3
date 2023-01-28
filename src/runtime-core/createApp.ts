import { render } from "./renderer";
import { createVNode } from "./vnode";

export const createApp = (rootComponent) => {
  return {
    mount(rootContainer) {
      // 先转为虚拟节点，所有的逻辑操作都会基于 vnode 做处理
      const vnode = createVNode(rootComponent);

      render(vnode, rootComponent);
    }
  };
}
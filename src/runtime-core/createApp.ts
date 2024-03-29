import { render } from "./render";
import { createVNode } from "./vnode";
export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      // vnode
      // coponent =》 vnode
      // 所有操作基于vnode处理
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
    }
  }
}


---
title: 理解Vue 2.5的Diff算法
---

::: tip
2017-11-28 16:50，发布于博客园

<https://www.cnblogs.com/isLiu/p/7909889.html>
:::

DOM“天生就慢”，所以前端各大框架都提供了对DOM操作进行优化的办法，Angular中的是<font color=red>脏值检查</font>，React首先提出了<font color=red>Virtual Dom</font>，Vue2.0也加入了<font color=red>Virtual Dom</font>，与React类似。

本文将对于Vue 2.5.3版本中使用的<font color=red>Virtual Dom</font>进行分析。

<font color=red>updataChildren</font>是Diff算法的核心，所以本文对<font color=red>updataChildren</font>进行了图文的分析。

## 1.VNode对象

--------
一个VNode的实例包含了以下属性，这部分代码在<font color=red>src/core/vdom/vnode.js</font>里

```
export default class VNode {
  tag: string | void;
  data: VNodeData | void;
  children: ?Array<VNode>;
  text: string | void;
  elm: Node | void;
  ns: string | void;
  context: Component | void; // rendered in this component's scope
  key: string | number | void;
  componentOptions: VNodeComponentOptions | void;
  componentInstance: Component | void; // component instance
  parent: VNode | void; // component placeholder node

  // strictly internal
  raw: boolean; // contains raw HTML? (server only)
  isStatic: boolean; // hoisted static node
  isRootInsert: boolean; // necessary for enter transition check
  isComment: boolean; // empty comment placeholder?
  isCloned: boolean; // is a cloned node?
  isOnce: boolean; // is a v-once node?
  asyncFactory: Function | void; // async component factory function
  asyncMeta: Object | void;
  isAsyncPlaceholder: boolean;
  ssrContext: Object | void;
  functionalContext: Component | void; // real context vm for functional nodes
  functionalOptions: ?ComponentOptions; // for SSR caching
  functionalScopeId: ?string; // functioanl scope id support

```

* tag: 当前节点的标签名
* data: 当前节点的数据对象，具体包含哪些字段可以参考vue源码types/vnode.d.ts中对VNodeData的定义
* children: 数组类型，包含了当前节点的子节点
* text: 当前节点的文本，一般文本节点或注释节点会有该属性
* elm: 当前虚拟节点对应的真实的dom节点
* ns: 节点的namespace
* context: 编译作用域
* functionalContext: 函数化组件的作用域
* key: 节点的key属性，用于作为节点的标识，有利于patch的优化
* componentOptions: 创建组件实例时会用到的选项信息
* child: 当前节点对应的组件实例
* parent: 组件的占位节点
* raw: raw html
* isStatic: 静态节点的标识
* isRootInsert: 是否作为根节点插入，被`<transition>`包裹的节点，该属性的值为false
* isComment: 当前节点是否是注释节点
* isCloned: 当前节点是否为克隆节点
* isOnce: 当前节点是否有v-once指令

## 2.VNode的分类

-------
VNode可以理解为Vue<font color=red>Virtual Dom</font>的一个基类，通过VNode构造函数生成的VNnode实例可为如下几类：

* EmptyVNode: 没有内容的注释节点
* TextVNode: 文本节点
* ElementVNode: 普通元素节点
* ComponentVNode: 组件节点
* CloneVNode: 克隆节点，可以是以上任意类型的节点，唯一的区别在于isCloned属性为true

## 3.Create-Element源码解析

--------
这部分代码在<font color=red>src/core/vdom/create-element.js</font>里，我就直接粘代码加上我的注释了

```
export function createElement (
  context: Component,
  tag: any,
  data: any,
  children: any,
  normalizationType: any,
  alwaysNormalize: boolean
): VNode {
  // 兼容不传data的情况
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children
    children = data
    data = undefined
  }
  // 如果alwaysNormalize是true
  // 那么normalizationType应该设置为常量ALWAYS_NORMALIZE的值
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE
  }
  // 调用_createElement创建虚拟节点
  return _createElement(context, tag, data, children, normalizationType)
}

export function _createElement (
  context: Component,
  tag?: string | Class<Component> | Function | Object,
  data?: VNodeData,
  children?: any,
  normalizationType?: number
): VNode {

  /**
   * 如果存在data.__ob__，说明data是被Observer观察的数据
   * 不能用作虚拟节点的data
   * 需要抛出警告，并返回一个空节点
   *
   * 被监控的data不能被用作vnode渲染的数据的原因是：
   * data在vnode渲染过程中可能会被改变，这样会触发监控，导致不符合预期的操作
   */
  if (isDef(data) && isDef((data: any).__ob__)) {
    process.env.NODE_ENV !== 'production' && warn(
      `Avoid using observed data object as vnode data: ${JSON.stringify(data)}\n` +
      'Always create fresh vnode data objects in each render!',
      context
    )
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is
  }
  if (!tag) {
    // 当组件的is属性被设置为一个falsy的值
    // Vue将不会知道要把这个组件渲染成什么
    // 所以渲染一个空节点
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // key为非原始值警告
  // warn against non-primitive key
  if (process.env.NODE_ENV !== 'production' &&
    isDef(data) && isDef(data.key) && !isPrimitive(data.key)
  ) {
    warn(
      'Avoid using non-primitive value as key, ' +
      'use string/number value instead.',
      context
    )
  }
  // 作用域插槽
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {}
    data.scopedSlots = { default: children[0] }
    children.length = 0
  }
  // 根据normalizationType的值，选择不同的处理方法
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children)
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children)
  }
  let vnode, ns
  // 如果标签名是字符串类型
  if (typeof tag === 'string') {
    let Ctor
    // 获取标签的命名空间
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag)
    // 如果是保留标签
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      // 就创建这样一个vnode
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      )
      // 如果不是保留字标签，尝试从vm的components上查找是否有这个标签的定义
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      // 如果找到，就创建虚拟组件节点
      vnode = createComponent(Ctor, data, context, children, tag)
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      // 兜底方案，创建一个正常的vnode
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      )
    }
  } else {
    // 当tag不是字符串的时候，我们认为tag是组件的构造类
    // 所以直接创建
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children)
  }
  if (isDef(vnode)) {
    // 应用命名空间
    if (ns) applyNS(vnode, ns)
    return vnode
  } else {
    // 返回一个空节点
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined
    force = true
  }
  if (isDef(vnode.children)) {
    for (let i = 0, l = vnode.children.length; i < l; i++) {
      const child = vnode.children[i]
      if (isDef(child.tag) && (isUndef(child.ns) || isTrue(force))) {
        applyNS(child, ns, force)
      }
    }
  }
}
```

## 4.Patch原理

--------
patch函数的定义在<font color=red>src/core/vdom/patch.js</font>中，patch逻辑比较简单，就不粘代码了

patch函数接收6个参数：

* oldVnode: 旧的虚拟节点或旧的真实dom节点
* vnode: 新的虚拟节点
* hydrating: 是否要跟真是dom混合
* removeOnly: 特殊flag，用于`<transition-group>`组件
* parentElm: 父节点
* refElm: 新节点将插入到refElm之前

### patch的逻辑是：

1. if vnode不存在但是oldVnode存在，说明意图是要销毁老节点，那么就调用invokeDestroyHook(oldVnode)来进行销
2. if oldVnode不存在但是vnode存在，说明意图是要创建新节点，那么就调用createElm来创建新节点
3. else 当vnode和oldVnode都存在时

    * if oldVnode和vnode是同一个节点，就调用patchVnode来进行patch
    * 当vnode和oldVnode不是同一个节点时，如果oldVnode是真实dom节点或hydrating设置为true，需要用hydrate函数将虚拟dom和真是dom进行映射，然后将oldVnode设置为对应的虚拟dom，找到oldVnode.elm的父节点，根据vnode创建一个真实dom节点并插入到该父节点中oldVnode.elm的位置

### patchVnode的逻辑是：

1. 如果oldVnode跟vnode完全一致，那么不需要做任何事情
2. 如果oldVnode跟vnode都是静态节点，且具有相同的key，当vnode是克隆节点或是v-once指令控制的节点时，只需要把oldVnode.elm和oldVnode.child都复制到vnode上，也不用再有其他操作
3. 否则，如果vnode不是文本节点或注释节点
    
    * 如果oldVnode和vnode都有子节点，且2方的子节点不完全一致，就执行updateChildren
    * 如果只有oldVnode有子节点，那就把这些节点都删除
    * 如果只有vnode有子节点，那就创建这些子节点
    * 如果oldVnode和vnode都没有子节点，但是oldVnode是文本节点或注释节点，就把vnode.elm的文本设置为空字符串
4. 如果vnode是文本节点或注释节点，但是vnode.text != oldVnode.text时，只需要更新vnode.elm的文本内容就可以

代码如下：
```
  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    // 如果新旧节点一致，什么都不做
    if (oldVnode === vnode) {
      return
    }

    // 让vnode.el引用到现在的真实dom，当el修改时，vnode.el会同步变化
    const elm = vnode.elm = oldVnode.elm

    // 异步占位符
    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue)
      } else {
        vnode.isAsyncPlaceholder = true
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    // 如果新旧都是静态节点，并且具有相同的key
    // 当vnode是克隆节点或是v-once指令控制的节点时，只需要把oldVnode.elm和oldVnode.child都复制到vnode上
    // 也不用再有其他操作
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance
      return
    }

    let i
    const data = vnode.data
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode)
    }

    const oldCh = oldVnode.children
    const ch = vnode.children
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
    }
    // 如果vnode不是文本节点或者注释节点
    if (isUndef(vnode.text)) {
      // 并且都有子节点
      if (isDef(oldCh) && isDef(ch)) {
        // 并且子节点不完全一致，则调用updateChildren
        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)

        // 如果只有新的vnode有子节点
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
        // elm已经引用了老的dom节点，在老的dom节点上添加子节点
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)

        // 如果新vnode没有子节点，而vnode有子节点，直接删除老的oldCh
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1)

        // 如果老节点是文本节点
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '')
      }

      // 如果新vnode和老vnode是文本节点或注释节点
      // 但是vnode.text != oldVnode.text时，只需要更新vnode.elm的文本内容就可以
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text)
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
    }
  }
```

## 5.updataChildren原理

--------

### updateChildren的逻辑是：

1. 分别获取oldVnode和vnode的firstChild、lastChild，赋值给oldStartVnode、oldEndVnode、newStartVnode、newEndVnode
2. 如果oldStartVnode和newStartVnode是同一节点，调用patchVnode进行patch，然后将oldStartVnode和newStartVnode都设置为下一个子节点，重复上述流程
![](https://images2018.cnblogs.com/blog/1272362/201711/1272362-20171128161117472-1355681854.png)
3. 如果oldEndVnode和newEndVnode是同一节点，调用patchVnode进行patch，然后将oldEndVnode和newEndVnode都设置为上一个子节点，重复上述流程
![](https://images2018.cnblogs.com/blog/1272362/201711/1272362-20171128161513456-35774165.png)
4. 如果oldStartVnode和newEndVnode是同一节点，调用patchVnode进行patch，如果removeOnly是false，那么可以把oldStartVnode.elm移动到oldEndVnode.elm之后，然后把oldStartVnode设置为下一个节点，newEndVnode设置为上一个节点，重复上述流程
![](https://images2018.cnblogs.com/blog/1272362/201711/1272362-20171128161959690-1680308559.png)
5. 如果newStartVnode和oldEndVnode是同一节点，调用patchVnode进行patch，如果removeOnly是false，那么可以把oldEndVnode.elm移动到oldStartVnode.elm之前，然后把newStartVnode设置为下一个节点，oldEndVnode设置为上一个节点，重复上述流程
![](https://images2018.cnblogs.com/blog/1272362/201711/1272362-20171128162402050-1780204197.png)
6. 如果以上都不匹配，就尝试在oldChildren中寻找跟newStartVnode具有相同key的节点，如果找不到相同key的节点，说明newStartVnode是一个新节点，就创建一个，然后把newStartVnode设置为下一个节点
7. 如果上一步找到了跟newStartVnode相同key的节点，那么通过其他属性的比较来判断这2个节点是否是同一个节点，如果是，就调用patchVnode进行patch，如果removeOnly是false，就把newStartVnode.elm插入到oldStartVnode.elm之前，把newStartVnode设置为下一个节点，重复上述流程
![](https://images2018.cnblogs.com/blog/1272362/201711/1272362-20171128162610253-1637696428.png)
8. 如果在oldChildren中没有寻找到newStartVnode的同一节点，那就创建一个新节点，把newStartVnode设置为下一个节点，重复上述流程
9. 如果oldStartVnode跟oldEndVnode重合了，并且newStartVnode跟newEndVnode也重合了，这个循环就结束了

具体代码如下：

```
  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    let oldStartIdx = 0 // 旧头索引
    let newStartIdx = 0 // 新头索引
    let oldEndIdx = oldCh.length - 1 // 旧尾索引
    let newEndIdx = newCh.length - 1 // 新尾索引
    let oldStartVnode = oldCh[0] // oldVnode的第一个child
    let oldEndVnode = oldCh[oldEndIdx] // oldVnode的最后一个child
    let newStartVnode = newCh[0] // newVnode的第一个child
    let newEndVnode = newCh[newEndIdx] // newVnode的最后一个child
    let oldKeyToIdx, idxInOld, vnodeToMove, refElm

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    const canMove = !removeOnly

    // 如果oldStartVnode和oldEndVnode重合，并且新的也都重合了，证明diff完了，循环结束
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      // 如果oldVnode的第一个child不存在
      if (isUndef(oldStartVnode)) {
        // oldStart索引右移
        oldStartVnode = oldCh[++oldStartIdx] // Vnode has been moved left

      // 如果oldVnode的最后一个child不存在
      } else if (isUndef(oldEndVnode)) {
        // oldEnd索引左移
        oldEndVnode = oldCh[--oldEndIdx]

      // oldStartVnode和newStartVnode是同一个节点
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        // patch oldStartVnode和newStartVnode， 索引左移，继续循环
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue)
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]

      // oldEndVnode和newEndVnode是同一个节点
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        // patch oldEndVnode和newEndVnode，索引右移，继续循环
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue)
        oldEndVnode = oldCh[--oldEndIdx]
        newEndVnode = newCh[--newEndIdx]

      // oldStartVnode和newEndVnode是同一个节点
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        // patch oldStartVnode和newEndVnode
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue)
        // 如果removeOnly是false，则将oldStartVnode.eml移动到oldEndVnode.elm之后
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm))
        // oldStart索引右移，newEnd索引左移
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]

      // 如果oldEndVnode和newStartVnode是同一个节点
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        // patch oldEndVnode和newStartVnode
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue)
        // 如果removeOnly是false，则将oldEndVnode.elm移动到oldStartVnode.elm之前
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm)
        // oldEnd索引左移，newStart索引右移
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]

      // 如果都不匹配
      } else {
        if (isUndef(oldKeyToIdx)) oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx)

        // 尝试在oldChildren中寻找和newStartVnode的具有相同的key的Vnode
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx)

        // 如果未找到，说明newStartVnode是一个新的节点
        if (isUndef(idxInOld)) { // New element
          // 创建一个新Vnode
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)

        // 如果找到了和newStartVnodej具有相同的key的Vnode，叫vnodeToMove
        } else {
          vnodeToMove = oldCh[idxInOld]
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !vnodeToMove) {
            warn(
              'It seems there are duplicate keys that is causing an update error. ' +
              'Make sure each v-for item has a unique key.'
            )
          }

          // 比较两个具有相同的key的新节点是否是同一个节点
          //不设key，newCh和oldCh只会进行头尾两端的相互比较，设key后，除了头尾两端的比较外，还会从用key生成的对象oldKeyToIdx中查找匹配的节点，所以为节点设置key可以更高效的利用dom。
          if (sameVnode(vnodeToMove, newStartVnode)) {
            // patch vnodeToMove和newStartVnode
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue)
            // 清除
            oldCh[idxInOld] = undefined
            // 如果removeOnly是false，则将找到的和newStartVnodej具有相同的key的Vnode，叫vnodeToMove.elm
            // 移动到oldStartVnode.elm之前
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm)

          // 如果key相同，但是节点不相同，则创建一个新的节点
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm)
          }
        }

        // 右移
        newStartVnode = newCh[++newStartIdx]
      }
    }
```

## 6.具体的Diff分析

--------

不设key，newCh和oldCh只会进行头尾两端的相互比较，设key后，除了头尾两端的比较外，还会从用key生成的对象oldKeyToIdx中查找匹配的节点，所以为节点设置key可以更高效的利用dom。

diff的遍历过程中，只要是对dom进行的操作都调用api.insertBefore，api.insertBefore只是原生insertBefore的简单封装。
比较分为两种，一种是有vnode.key的，一种是没有的。但这两种比较对真实dom的操作是一致的。

对于与sameVnode(oldStartVnode, newStartVnode)和sameVnode(oldEndVnode,newEndVnode)为true的情况，不需要对dom进行移动。

总结遍历过程，有3种dom操作：上述图中都有

1. 当oldStartVnode，newEndVnode值得比较，说明oldStartVnode.el跑到oldEndVnode.el的后边了。
2. 当oldEndVnode，newStartVnode值得比较，oldEndVnode.el跑到了oldStartVnode.el的前边，准确的说应该是oldEndVnode.el需要移动到oldStartVnode.el的前边”。
3. newCh中的节点oldCh里没有， 将新节点插入到oldStartVnode.el的前边

在结束时，分为两种情况：

1. oldStartIdx > oldEndIdx，可以认为oldCh先遍历完。当然也有可能newCh此时也正好完成了遍历，统一都归为此类。此时newStartIdx和newEndIdx之间的vnode是新增的，调用addVnodes，把他们全部插进before的后边，before很多时候是为null的。addVnodes调用的是insertBefore操作dom节点，我们看看insertBefore的文档：parentElement.insertBefore(newElement, referenceElement)
如果referenceElement为null则newElement将被插入到子节点的末尾。如果newElement已经在DOM树中，newElement首先会从DOM树中移除。所以before为null，newElement将被插入到子节点的末尾。
2. newStartIdx > newEndIdx，可以认为newCh先遍历完。此时oldStartIdx和oldEndIdx之间的vnode在新的子节点里已经不存在了，调用removeVnodes将它们从dom里删除
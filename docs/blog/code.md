---
title: code
---

## 实现一个方法将如下JS对象转换为Dom元素

<img :src="$withBase('/createele.png')" alt="foo">

```js
const HTMLTagList = ['html', 'div', 'span'];

function createElm(vnode, parentElm) {
    if (vnode === null || vnode === undefined) {
        return
    }

    const {tag, children, attr} = vnode;

    if (!HTMLTagList.includes(tag)) {
        // warn('不是一个html节点')
    }

    vnode.elm = document.createElement(tag);

    createChild(vnode, children);

    if (Array.isArray(attr)) {
        const finalAttr = attr.reduce(((r, c) => Object.assign(r, c)), {})
        const elm = vnode.elm
        Object.keys(finalAttr).map(key => {
            elm.setAttribute(key, finalAttr[key])
        })
    }

    if (parentElm) {
        parentElm.appendChild(vnode.elm);
    }
    else {
        return vnode.elm;
    }
}

function createChild(vnode, children) {
    if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
            createElm(children[i], vnode.elm);
        }
    }
    // 文本节点
    else if (typeof children === 'string' || typeof children === 'number') {
        vnode.elm.appendChild(document.createTextNode(String(children)));
    }
}
```
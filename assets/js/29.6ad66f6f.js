(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{375:function(e,t,a){"use strict";a.r(t);var n=a(42),r=Object(n.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("div",{staticClass:"custom-block tip"},[a("p",{staticClass:"custom-block-title"},[e._v("TIP")]),e._v(" "),a("p",[e._v("2018-01-21 19:46，发布于博客园")]),e._v(" "),a("p",[a("a",{attrs:{href:"https://www.cnblogs.com/isLiu/p/8325186.html",target:"_blank",rel:"noopener noreferrer"}},[e._v("https://www.cnblogs.com/isLiu/p/8325186.html"),a("OutboundLink")],1)])]),e._v(" "),a("p",[e._v("了解React的同学都知道，React提供了一个高效的视图更新机制：Virtual DOM，因为DOM天生就慢，所以操作DOM的时候要小心翼翼，稍微改动就会触发重绘重排，大量消耗性能。")]),e._v(" "),a("h2",{attrs:{id:"_1-virtual-dom"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_1-virtual-dom"}},[e._v("#")]),e._v(" 1.Virtual DOM")]),e._v(" "),a("hr"),e._v(" "),a("p",[e._v("Virtual DOM是利用JS的原生对象来模拟DOM，既然DOM是对象，我们也可以用原生的对象来表示DOM。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("var element = {\n  tagName: 'ul', // 节点标签名\n  props: {\n    class: 'list' // 节点的属性，ID，class...\n  },\n  children: [ // 该节点的子节点\n    {tagName: 'li', props: {class: 'item'}, children: ['item one']},\n    {tagName: 'li', props: {class: 'item'}, children: ['item two']},\n    {tagName: 'li', props: {class: 'item'}, children: ['item three']}\n  ]\n}\n")])])]),a("p",[e._v("对应成相应的HTML结构为：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v('<ul class="list">\n    <li class="item">item one</li>\n    <li class="item">item two</li>\n    <li class="item">item three</li>\n</ul>\n')])])]),a("p",[e._v("但是这又有什么用呢？不还是要操作DOM吗？")]),e._v(" "),a("p",[e._v("开头我们就说过，Virtual DOM是一个高效的视图更新机制，没错，主要在更新。怎么更新呢，那就要用到了我们之前用JS对象模拟的DOM树了，就叫它对象树把，我们对比前后两棵对象树，比较出需要更新视图的地方，对需要更新视图的地方才进行DOM操作，不需要更新的地方自然什么都不做，这就避免了性能的不必要浪费，变相的提升了性能。")]),e._v(" "),a("p",[e._v("总之Virtual DOM算法主要包括这几步：")]),e._v(" "),a("ul",[a("li",[a("p",[a("strong",[e._v("初始化视图的时候，用原生JS对象表示DOM树，生成一个对象树，然后根据这个对象树来生成一个真正的DOM树，插入到文档中。")])])]),e._v(" "),a("li",[a("p",[a("strong",[e._v("当状态更新的时候，重新生成一个对象树，将新旧两个对象树做对比，记录差异。")])])]),e._v(" "),a("li",[a("p",[a("strong",[e._v("把记录的差异应用到第一步生成的真正的DOM树上，视图跟新完成")])])])]),e._v(" "),a("p",[e._v("其实就是一个双缓冲的原理，既然CPU这么快，读取硬盘又这么慢，我们就在中间加一个Cache。那么，既然DOM操作也慢，我们们就可以在JS和DOM之间也加一个Cache，这个Cache就是我们的Virtual DOM了。")]),e._v(" "),a("p",[e._v("其实说白了Virtual DOM的原理就是只更新需要更新的地方，其他的一概不管。")]),e._v(" "),a("h2",{attrs:{id:"_2-用对象树表示dom树"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_2-用对象树表示dom树"}},[e._v("#")]),e._v(" 2.用对象树表示DOM树")]),e._v(" "),a("hr"),e._v(" "),a("p",[e._v("用JS对象表示DOM节点还是比较容易的，我们这需要记录DOM节点的节点类型、属性、还有子节点就好了。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("class objectTree {\n  constructor (tagName, props, children) {\n    this.tagName = tagName\n    this.props = props\n    this.children = children\n  }\n}\n")])])]),a("p",[e._v("我们可以通过这种方式创建一个对象树：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("var ul = new objectTree('ul', {id: 'list'}, [\n  createObjectTree('li', {class: 'item'}, ['Item 1']),\n  createObjectTree('li', {class: 'item'}, ['Item 2']),\n  createObjectTree('li', {class: 'item'}, ['Item 3'])\n])\n")])])]),a("p",[e._v("对象树存在一个render方法来将对象树转换成真正的DOM树：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("objectTree.prototype.render = function () {\n  var elm = document.createElement(this.tagName)\n\n  var props = this.props\n  // 设置DOM节点的属性\n  for (var key in props) {\n    elm.setAttribute(key, props[key])\n  }\n\n  var children = this.children || []\n  children.forEach((child) => {\n    // 如果子节点也是对象树，则递归渲染，否则就是文本节点\n    var childElm = (child instanceof objectTree) ? child.render() : document.createTextNode(child)\n    elm.appendChild(childElm)\n  })\n\n  return elm\n}\n")])])]),a("p",[e._v("我们就可以将生成好的DOM树插入到文档里了")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("var ul = new objectTree('ul', {id: 'list'}, [\n  new objectTree('li', {class: 'item'}, ['Item 1']),\n  new objectTree('li', {class: 'item'}, ['Item 2']),\n  new objectTree('li', {class: 'item'}, ['Item 3'])\n])\n\nconsole.log(ul)\n\ndocument.body.appendChild(ul.render())\n\n")])])]),a("p",[e._v("我们生成的DOM已经添加到文档里了")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121170559568-676597564.png",alt:""}})]),e._v(" "),a("h2",{attrs:{id:"_3-比较两个对象树的差异"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_3-比较两个对象树的差异"}},[e._v("#")]),e._v(" 3.比较两个对象树的差异")]),e._v(" "),a("hr"),e._v(" "),a("p",[e._v("所谓Virtual DOM的diff算法，就是比较两个对象树的差异，也正是Virtual DOM的核心。")]),e._v(" "),a("p",[e._v("传统的比较两棵树差异的算法，时间复杂度是O(n^3)，大量操作DOM的时候肯定是接受不了的。所以React做了妥协，React结合WEB界面的特点，做了两个简单的假设，使得算法的复杂度降低到了O(n)。")]),e._v(" "),a("ol",[a("li",[a("p",[e._v("相同的组件产生相似的DOM树，不同的组件产生不同的DOM树。")])]),e._v(" "),a("li",[a("p",[e._v("对于同一层次的一组子节点，它们可以通过唯一的id进行区分。")])])]),e._v(" "),a("h3",{attrs:{id:"不同节点类型的比较"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#不同节点类型的比较"}},[e._v("#")]),e._v(" 不同节点类型的比较")]),e._v(" "),a("p",[e._v("不同节点类型分为两种情况：")]),e._v(" "),a("ol",[a("li",[a("p",[e._v("节点类型不同。")])]),e._v(" "),a("li",[a("p",[e._v("节点类型相同，但是属性不同。")])])]),e._v(" "),a("p",[e._v("先看第一种情况，如果是我们会怎么做呢？肯定是直接删除老的节点，然后在老节点的位置上将新节点插入。React也和我们的想法一样，也符合我们对真实DOM操作的理解。")]),e._v(" "),a("p",[e._v("如果将老节点删除，那么老节点的子节点也同时被删除，并且子节点也不会参与后续的比较。这也是算法复杂度能降低到O(n)的原因之一。")]),e._v(" "),a("p",[e._v("既然节点类型不同是这样操作的，那么组件也是一样的逻辑了。应用第一个假设，不同组件之间有不同的DOM树，与其花时间比较它们的DOM结构，还不如创建一个新的组件加到原来的组件上。")]),e._v(" "),a("p",[e._v("从不同节点的操作上我们可以推断，React的diff算法是只对对象树逐层比较。")]),e._v(" "),a("h3",{attrs:{id:"逐层进行节点比较"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#逐层进行节点比较"}},[e._v("#")]),e._v(" 逐层进行节点比较")]),e._v(" "),a("p",[e._v("在React中对树的算法非常简单，那就是对两棵树同一层次的节点进行比较。")]),e._v(" "),a("p",[e._v("有一张非常经典的图：")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121174252459-1080956904.png",alt:""}})]),e._v(" "),a("p",[e._v("React只会对相同颜色方框内的DOM节点进行比较，即同一个父节点下的所有子节点。当发现节点已经不存在，则该节点及其子节点会被完全删除掉，不会用于进一步的比较。这样只需要对树进行一次遍历，便能完成整个DOM树的比较。")]),e._v(" "),a("p",[e._v("考虑下如果有这样的DOM结构的变化：")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121175322537-174288289.png",alt:""}})]),e._v(" "),a("p",[e._v("我们想的操作是："),a("code",[e._v("R.remove(A), D.append(A)")])]),e._v(" "),a("p",[e._v("但是因为React只会对同一层次的节点进行比较，当发现新的对象树中没有A节点时，就会完全删除A，同理，会新创建一个A节点作为D的子节点。实际React的操作是："),a("code",[e._v("A.destroy(), A = new A(), A.append(new B()), A.append(new C()), D.append(A)")])]),e._v(" "),a("p",[e._v("由此我们可以根据React只对同一层次的节点比较可以作出的优化是："),a("strong",[e._v("尽量不要跨层级的修改DOM")]),e._v("。")]),e._v(" "),a("h3",{attrs:{id:"相同节点类型的比较"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#相同节点类型的比较"}},[e._v("#")]),e._v(" 相同节点类型的比较")]),e._v(" "),a("p",[e._v("刚才我们说过，相通节点类型属性可能不同，React会对属性进行重设，但要注意：Virtual DOM中style必须是个对象。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("renderA: <div style={{color: 'red'}} />\nrenderB: <div style={{fontWeight: 'bold'}} />\n=> [removeStyle color], [addStyle font-weight 'bold']\n")])])]),a("h3",{attrs:{id:"key值的使用"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#key值的使用"}},[e._v("#")]),e._v(" key值的使用")]),e._v(" "),a("p",[e._v("我们经常在遍历一个数组或列表需要一个标识一个唯一的key，这个key是干什么的呢？")]),e._v(" "),a("p",[e._v("这是初始视图：")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121183358584-2005799790.png",alt:""}})]),e._v(" "),a("p",[e._v("我们现在想在它们中间加一个F，也就是一个insert操作。")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121183645303-1061386765.png",alt:""}})]),e._v(" "),a("p",[e._v("如果每个节点没有一个唯一的key，React不能识别每个节点，那React就会将C更新成F，将D更新成C，最后在末尾插入一个D。")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121184005099-2029608053.png",alt:""}})]),e._v(" "),a("p",[e._v("如果每个节点有一个唯一的key做标识，React会找到正确的位置去插入新的节点，从而提高了视图更新的效率。")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121184259428-291465778.png",alt:""}})]),e._v(" "),a("p",[e._v("对于key我们可以给出的优化是："),a("strong",[e._v("给每个列表元素加上一个唯一的key")])]),e._v(" "),a("h2",{attrs:{id:"_4-diff算法的简单实现"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_4-diff算法的简单实现"}},[e._v("#")]),e._v(" 4.diff算法的简单实现")]),e._v(" "),a("hr"),e._v(" "),a("p",[e._v("我们先对两棵对象树做一个深度优先的遍历，这样每一个节点都有一个唯一的标记：")]),e._v(" "),a("p",[a("img",{attrs:{src:"http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180121192119943-903614864.png",alt:""}})]),e._v(" "),a("p",[e._v("在深度优先遍历的时候，每遍历到一个节点就把该节点和新的的树进行对比。如果有差异的话就记录到一个对象里面。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("// diff 函数，对比两棵树\nfunction diff (oldTree, newTree) {\n  var index = 0 // 当前节点的标志\n  var patches = {} // 用来记录每个节点差异的对象\n  dfsWalk(oldTree, newTree, index, patches)\n  return patches\n}\n\n// 对两棵树进行深度优先遍历\nfunction dfsWalk (oldNode, newNode, index, patches) {\n  // 对比oldNode和newNode的不同，记录下来\n  patches[index] = [...]\n\n  diffChildren(oldNode.children, newNode.children, index, patches)\n}\n\n// 遍历子节点\nfunction diffChildren (oldChildren, newChildren, index, patches) {\n  var leftNode = null\n  var currentNodeIndex = index\n  oldChildren.forEach(function (child, i) {\n    var newChild = newChildren[i]\n    currentNodeIndex = (leftNode && leftNode.count) // 计算节点的标识\n      ? currentNodeIndex + leftNode.count + 1\n      : currentNodeIndex + 1\n    dfsWalk(child, newChild, currentNodeIndex, patches) // 深度遍历子节点\n    leftNode = child\n  })\n}\n")])])]),a("p",[e._v("例如，上面的div和新的div有差异，当前的标记是0，那么")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("patches[0] = [{difference}, {difference}, ...] // 用数组存储新旧节点的不同\n")])])]),a("p",[e._v("那我们所说的差异是什么呢？")]),e._v(" "),a("ol",[a("li",[a("p",[e._v("节点被替换")])]),e._v(" "),a("li",[a("p",[e._v("增加、删除、移动子节点")])]),e._v(" "),a("li",[a("p",[e._v("修改了节点的属性")])]),e._v(" "),a("li",[a("p",[e._v("若是文本节点，则文本内容可能会被改变")])])]),e._v(" "),a("p",[e._v("所以我们定义了几种类型：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("var REPLACE = 0\nvar REORDER = 1\nvar PROPS = 2\nvar TEXT = 3\n")])])]),a("p",[e._v("举个例子，如果最外层的div被换成了section，则相应的记录如下：")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("patches[0] = [{\n  type: REPALCE,\n  node: newNode // el('section', props, children)\n}]\n")])])]),a("p",[e._v("其他变化同理。")]),e._v(" "),a("h2",{attrs:{id:"_5-patch方法的实现"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#_5-patch方法的实现"}},[e._v("#")]),e._v(" 5.patch方法的实现")]),e._v(" "),a("hr"),e._v(" "),a("p",[e._v("我们比较完了两棵对象树的差异，接下来就是将差异应用到DOM上了。这个过程有点像打补丁，所以我们叫它patch。")]),e._v(" "),a("p",[e._v("我们第一步构建出来的对象树和真正的DOM树的属性、结构是一样的，所以我们可以对DOM树进行一次深度优先遍历，遍历的时候按着diff生成的patch对象进行patch操作，修改需要patch的地方。")]),e._v(" "),a("p",[e._v("我们还要根据不同的差异进行不同的DOM操作。")]),e._v(" "),a("div",{staticClass:"language- extra-class"},[a("pre",{pre:!0,attrs:{class:"language-text"}},[a("code",[e._v("function patch (node, patches) {\n  var walker = {index: 0}\n  dfsWalk(node, walker, patches)\n}\n\nfunction dfsWalk (node, walker, patches) {\n  var currentPatches = patches[walker.index] // 从patches拿出当前节点的差异\n\n  var len = node.childNodes\n    ? node.childNodes.length\n    : 0\n  for (var i = 0; i < len; i++) { // 深度遍历子节点\n    var child = node.childNodes[i]\n    walker.index++\n    dfsWalk(child, walker, patches)\n  }\n\n  if (currentPatches) {\n    applyPatches(node, currentPatches) // 对当前节点进行DOM操作\n  }\n}\n\nfunction applyPatches (node, currentPatches) {\n  currentPatches.forEach(function (currentPatch) {\n    switch (currentPatch.type) {\n      case REPLACE:\n        node.parentNode.replaceChild(currentPatch.node.render(), node)\n        break\n      case REORDER:\n        reorderChildren(node, currentPatch.moves)\n        break\n      case PROPS:\n        setProps(node, currentPatch.props)\n        break\n      case TEXT:\n        node.textContent = currentPatch.content\n        break\n      default:\n        throw new Error('Unknown patch type ' + currentPatch.type)\n    }\n  })\n}\n")])])]),a("p",[e._v("看过了别人的文章，也借鉴了别人的思想，加上自己的总结，代码正在整理中。")])])}),[],!1,null,null,null);t.default=r.exports}}]);
(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{365:function(n,e,t){"use strict";t.r(e);var a=t(42),r=Object(a.a)({},(function(){var n=this,e=n.$createElement,t=n._self._c||e;return t("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"custom-block-title"},[n._v("TIP")]),n._v(" "),t("p",[n._v("2017-12-26 14:21，发布于博客园")]),n._v(" "),t("p",[t("a",{attrs:{href:"https://www.cnblogs.com/isLiu/p/8081393.html",target:"_blank",rel:"noopener noreferrer"}},[n._v("https://www.cnblogs.com/isLiu/p/8081393.html"),t("OutboundLink")],1)])]),n._v(" "),t("p",[n._v("相信不少看过一些框架或者是类库的人都有印象，一个函数叫什么creator或者是什么什么createToFuntion，总是接收一个函数，来返回另一个函数。这是一个高阶函数，它可以接收函数可以当参数，也可以当返回值，这就是函数式编程。像柯里化、装饰器模式、高阶组件，都是相通的，一个道理。")]),n._v(" "),t("p",[n._v("本文重点是React高阶组件，要理解高阶组件，不得不说函数式编程。")]),n._v(" "),t("h2",{attrs:{id:"_1-函数式编程"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_1-函数式编程"}},[n._v("#")]),n._v(" 1. 函数式编程")]),n._v(" "),t("hr"),n._v(" "),t("p",[n._v("函数式编程是一种编程模式，在这种编程模式种最常用函数和表达式，函数式编程把函数作为一等公民，强调从函数的角度考虑问题，函数式编程倾向用一系列嵌套的函数来解决问题。")]),n._v(" "),t("p",[n._v("简单写个例子")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("\tfunction OCaml () {\n\t\tconsole.log('I\\'m FP language OCaml')\n\t}\n\tfunction clojure() {\n\t\tconsole.log('I\\'m FP language clojure')\n\t}\n")])])]),t("p",[n._v("现在想在每条console语句前后各加一条console语句，如果在每个函数都加上console语句，会产生不必要的耦合，所以高阶函数就派上了用场。")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("\tfunction FuncWrapper(func) {\n\t\treturn function () {\n\t\t\tconsole.log('before')\n\t\t\tfunc()\n\t\t\tconsole.log('after')\n\t\t}\n\t}\n\tvar OCaml = FuncWrapper(OCaml)\n\tvar clojure = FuncWrapper(clojure)\n")])])]),t("p",[n._v("我们写了一个函数FuncWrapper，该函数接一个函数作为参数，将参数函数装饰了一层，返回出去，减少了代码耦合。在设计模式中称这种模式为装饰器或装饰者模式。")]),n._v(" "),t("p",[n._v("当然函数式编程的好处不止这一条，有些人吹捧OCaml，clojure, scala等FP语言特性比如：纯函数无副作用、不变的数据、流计算模式、尾递归、柯里化等等。")]),n._v(" "),t("p",[n._v("在React中，高阶组件HOC就相当于这么一个FuncWrapper，传入一个组件，返回被包装或者被处理的另一个组件。")]),n._v(" "),t("h2",{attrs:{id:"_2-高阶组件"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_2-高阶组件"}},[n._v("#")]),n._v(" 2. 高阶组件")]),n._v(" "),t("hr"),n._v(" "),t("p",[n._v("上边已经简单说过了什么是高阶组件，其实本质上是一个类工厂。先举个例在再说")]),n._v(" "),t("p",[n._v("第一个组件")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport default class OCaml extends React.Component {\n  constructor (props) {\n    super(props)\n    this.changeHandle = this.changeHandle.bind(this)\n  }\n  changeHandle (value) {\n    console.log(value)\n  }\n  render () {\n    return (\n        <div>\n          <h2>I'm OCaml</h2>\n          <input type=\"text\" onchange={value => this.changeHandle(value)}/>\n        </div>\n    )\n  }\n}\n")])])]),t("p",[n._v("第二个组件")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport default class Clojure extends React.Component {\n  constructor (props) {\n    super(props)\n    this.changeHandle = this.changeHandle.bind(this)\n  }\n  changeHandle (value) {\n    console.log(value)\n  }\n  render () {\n    return (\n        <div>\n          <h2>I'm Clojure</h2>\n          <input type=\"text\" onchange={value => this.changeHandle(value)}/>\n        </div>\n    )\n  }\n}\n")])])]),t("p",[n._v("有两个不相同的组件，但是有部分功能重合，就是那个changeHandle函数，理解了高阶函数，再解决这类问题就不难了吧？不还是一样吗？")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport default function CompWrapper (Component) {\n  return class WarpComponent extends React.Component {\n    constructor (props) {\n      super(props)\n      this.handleChange = this.handleChange.bind(this)\n    }\n\n    handleChange (value) {\n      console.log(value)\n    }\n\n    render () {\n      return <Component handleChange={this.handleChange} {...this.props}></Component>\n    }\n  }\n}\n\nOCaml = CompWrapper(OCaml)\nClojure = CompWrapper(Clojure)\n")])])]),t("p",[n._v("这是一个最简单的高阶组件。注意，再高阶组件的返回包装好的组件的时候，我们将高阶组件的props展开并传入包装好的组件中，这是确保给高阶组件的props也能给到被包装的组件上。")]),n._v(" "),t("p",[n._v("高阶组件的通途很多，可以用来，代码复用，逻辑抽象，抽离底层代码，渲染劫持，更改state、更改props等等。")]),n._v(" "),t("p",[n._v("我们主要说一下两种功能的React高阶组件：属性代理、反向继承。")]),n._v(" "),t("h2",{attrs:{id:"_3-属性代理-props-proxy"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_3-属性代理-props-proxy"}},[n._v("#")]),n._v(" 3. 属性代理(props proxy)")]),n._v(" "),t("hr"),n._v(" "),t("p",[n._v("很好说了，上面已经提到过了，再来一遍，高阶组件将它收到的props传递给被包装的组件，所叫属性代理")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("export default function CompWrapper (Component) {\n  return class WarpComponent extends React.Component {\n    render () {\n      return <Component {...this.props}></Component>\n    }\n  }\n}\n")])])]),t("h3",{attrs:{id:"属性代理主要用来处理以下问题"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#属性代理主要用来处理以下问题"}},[n._v("#")]),n._v(" 属性代理主要用来处理以下问题")]),n._v(" "),t("ul",[t("li",[n._v("更改props")]),n._v(" "),t("li",[n._v("抽取state")]),n._v(" "),t("li",[n._v("通过refs获取组件实例")]),n._v(" "),t("li",[n._v("将组件与其他原生DOM包装到一起")])]),n._v(" "),t("h3",{attrs:{id:"更改props"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#更改props"}},[n._v("#")]),n._v(" 更改props")]),n._v(" "),t("p",[n._v("例子是增加props的，其他的类似，都是在在高阶组件内部加以处理。")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport default function CompWrapper (Component) {\n  return class WarpComponent extends React.Component {\n    say () {\n      console.log('我是被高阶组件包装过的组件！')\n    }\n    newProps = {\n      isLogin: true,\n      msgList: [1,2,3,4,5]\n    }\n    render () {\n      return <Component say={this.say} {...this.props} {...this.newProps}></Component>\n    }\n  }\n}\n")])])]),t("p",[n._v("包装好的组件可以用this.props.say调用say方法，可以用this.props.isLogin判断登陆状态等等。")]),n._v(" "),t("h3",{attrs:{id:"抽像state"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#抽像state"}},[n._v("#")]),n._v(" 抽像state")]),n._v(" "),t("p",[n._v("我们可以通过props和回调函数来抽象state")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport function CompWrapper (Component) {\n  return class WarpComponent extends React.Component {\n    constructor (props) {\n      super(props)\n      this.state = {\n        inputValue: '暂时还没哟'\n      }\n      this.changeHandle = this.changeHandle.bind(this)\n    }\n    changeHandle (event) {\n      this.setState({\n        inputValue: event.target.value\n      })\n    }\n    render () {\n      return <Component {...this.props} inputValue={this.state.inputValue} changeHandle={this.changeHandle}></Component>\n    }\n  }\n}\n")])])]),t("p",[n._v("这个高阶组件将一切数据都绑定到了自己的身上，只需要出触发被包装组件的特定事件，就将改变自己的state，再将自己的state通过props传递给被包装组件。")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v('@CompWrapper\nexport class InputComp extends React.Component {\n  render () {\n    return (\n        <div>\n          <h2>{this.props.inputValue}</h2>\n          <input type="text" onChange={this.props.changeHandle}/>\n        </div>\n    )\n  }\n}\n')])])]),t("p",[n._v("这里的input就成了完全受控的组件。注意：在定义组件的语句上边写上@CompWrapper是和"),t("code",[n._v("InputComp = CompWrapper(InputComp)")]),n._v("作用是一样的。@操作符是ES7的decorator，也就是装饰器。")]),n._v(" "),t("h3",{attrs:{id:"通过-refs-获取组件实例"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#通过-refs-获取组件实例"}},[n._v("#")]),n._v(" 通过 refs 获取组件实例")]),n._v(" "),t("p",[n._v("从你的 render 方法中返回你的 UI 结构后，你会发现你想要“伸手”调用从 render 返回的组件实例的方法，我们可以通过ref获取组件的实例，但是想让ref生效，必须先经过一次正常的渲染来使ref得到计算，怎么先让组件经过一次正常的渲染呢？高阶组件又来了，明白了吗？高阶组件的render返回了被包装的组件，然后我们就可以通过ref获取这个组件的实例了。")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport function CompWrapper (Component) {\n  return class WarpComponent extends React.Component {\n    proc(wrappedComponentInstance) {\n      wrappedComponentInstance.say()\n    }\n    render () {\n      const props = Object.assign({}, this.props, {ref: this.proc.bind(this)})\n      return <Component {...props}></Component>\n    }\n  }\n}\n\n@CompWrapper\nexport class InputComp extends React.Component {\n  say () {\n    console.log('I\\'m InputComp')\n  }\n  render () {\n    return (\n        <button onClick={()=>{console.log(this.props)}}>点击</button>\n    )\n  }\n}\n")])])]),t("p",[n._v("当被包装的组件被渲染后，就可以执行自己实例的方法了，因为计算ref这件事已经由高阶组件做完了。")]),n._v(" "),t("h3",{attrs:{id:"将组件与其他原生dom包装到一起"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#将组件与其他原生dom包装到一起"}},[n._v("#")]),n._v(" 将组件与其他原生DOM包装到一起")]),n._v(" "),t("p",[n._v("这个很好理解，如果想把布局什么的和组件结合到一起，使用高阶组件是一个办法。")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport function CompWrapper (Component) {\n  return class WarpComponent extends React.Component {\n    render () {\n      return (\n          <div style={{marginTop: 100}}>\n            <Component {...this.props}/>\n          </div>\n      )\n    }\n  }\n}\n\n")])])]),t("h2",{attrs:{id:"_4-反向继承"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#_4-反向继承"}},[n._v("#")]),n._v(" 4. 反向继承")]),n._v(" "),t("hr"),n._v(" "),t("p",[n._v("为什么叫反向继承，是高阶组件继承被包装组件，按照我们想的被包装组件继承高阶组件。")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport function CompWrapper (Component) {\n  return class WarpComponent extends Component {\n    render () {\n      return super.render()\n    }\n  }\n}\n")])])]),t("p",[n._v("反向代理主要用来做"),t("strong",[n._v("渲染劫持")])]),n._v(" "),t("h3",{attrs:{id:"渲染劫持"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#渲染劫持"}},[n._v("#")]),n._v(" 渲染劫持")]),n._v(" "),t("p",[n._v("所谓的渲染劫持，就是最后组件所渲染出来的东西或者我们叫React Element完全由高阶组件来决定，通过所以我们可以对任意一个React Element的props进行操作；我们也可以操作React Element的Child。")]),n._v(" "),t("div",{staticClass:"language- extra-class"},[t("pre",{pre:!0,attrs:{class:"language-text"}},[t("code",[n._v("import React from 'react'\n\nexport function CompWrapper (Component) {\n  return class WarpComponent extends Component {\n    render () {\n      const reactElm = super.render()\n      let newProps = {}\n      if (reactElm.type === 'input') {\n        newProps = {value: '这是一个input'}\n      }\n      const props = Object.assign({}, reactElm.props, newProps)\n      const newReactElm = React.cloneElement(reactElm, props, reactElm.props.child)\n      return newReactElm\n    }\n  }\n}\n")])])]),t("p",[n._v("这个例子，判断组件的顶层元素是否为一个input，如果是的话，通过cloneElement这个方法来克隆出一个一样的组件，并将新的props传入，这样input就有值了。")]),n._v(" "),t("p",[n._v("用过React-Redux的人可能会有印象，使用connect可以将react和redux关联起来，这里的connect就是一个高阶组件，想到这，就很容易想出connect高阶组件是怎么实现了，我会在写一篇随笔，自己实现一个redux、connect、midlleware还有thunk。")])])}),[],!1,null,null,null);e.default=r.exports}}]);
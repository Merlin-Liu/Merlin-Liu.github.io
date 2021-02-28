(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{370:function(t,s,e){"use strict";e.r(s);var n=e(42),a=Object(n.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"custom-block-title"},[t._v("TIP")]),t._v(" "),e("p",[t._v("2017-12-27 23:05，发布于博客园")]),t._v(" "),e("p",[e("a",{attrs:{href:"https://www.cnblogs.com/isLiu/p/8119861.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("https://www.cnblogs.com/isLiu/p/8119861.html"),e("OutboundLink")],1)])]),t._v(" "),e("p",[t._v("接着上一篇讲，上一篇我们实现了自己的Redux和介绍了React的context以及Provider的原理。")]),t._v(" "),e("h2",{attrs:{id:"_1-provider组件的实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_1-provider组件的实现"}},[t._v("#")]),t._v(" 1. Provider组件的实现")]),t._v(" "),e("hr"),t._v(" "),e("p",[t._v("Provider组件主要有以下下两个作用")]),t._v(" "),e("ol",[e("li",[t._v("在整个应用上包一层，使整个应用成为Provider的子组件")]),t._v(" "),e("li",[t._v("接收Redux的store作为props，通过context对象传递给子组件，所有的子组件都可以取得store")])]),t._v(" "),e("p",[t._v("首先我们要知道，Provider组件的任务是将stroe传递给子组件，它只是一个传递数据的组件，只需要将子组件展示出来就好。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("import React from 'react'\nimport PropTypes from 'prop-types'\n\nexport class Provider extends React.Component{\n\tstatic childContextTypes = {\n\t\tstore: PropTypes.object\n\t}\n\tgetChildContext(){\n\t\treturn {store:this.store}\n\t}\n\tconstructor(props, context){\n\t\tsuper(props, context)\n\t\tthis.store = props.store\n\t}\n\trender(){\n\t\treturn this.props.children\n\t}\n}\n")])])]),e("h2",{attrs:{id:"_2-connect方法"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_2-connect方法"}},[t._v("#")]),t._v(" 2. connect方法")]),t._v(" "),e("hr"),t._v(" "),e("p",[t._v("connect的作用就是将React和Redux中的store连接起来")]),t._v(" "),e("p",[t._v("首先要明确它的任务：")]),t._v(" "),e("ol",[e("li",[t._v("接收一个组件，将Redux中的store通过props传递给组件")]),t._v(" "),e("li",[t._v("将Redux中的action也通过props传递给组件")]),t._v(" "),e("li",[t._v("返回一个新的组件，这个组件可以通过this.props访问到store中的属性，也可能是触发action")]),t._v(" "),e("li",[t._v("当store中的数据发生变化的时候，通知新的组件")])]),t._v(" "),e("p",[t._v("根据它的任务就能知道，它是一个高阶函数")]),t._v(" "),e("h3",{attrs:{id:"connect方法定义"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#connect方法定义"}},[t._v("#")]),t._v(" connect方法定义")]),t._v(" "),e("p",[t._v("官方给出connect的定义：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("connect([mapStateToProps],  [mapDispatchToProps],  [mergeProps],  [options])\n")])])]),e("p",[t._v("非常好理解了，在React-Redux中，我们常用的就是前两个参数。")]),t._v(" "),e("h3",{attrs:{id:"mapstatetoprops"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#mapstatetoprops"}},[t._v("#")]),t._v(" mapStateToProps")]),t._v(" "),e("p",[t._v("这个函数帮助我们将store中的数据作为props传递给组件，也就是实现了connect方法的第一个任务")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("mapStateToProps(state, ownProps) : stateProps\n")])])]),e("ol",[e("li",[t._v("mapStateToProps的第一个参数就是Redux的store")]),t._v(" "),e("li",[t._v("第二个参数就是自己的props，也可已将自己的props和store merge到一起传递给组件")])]),t._v(" "),e("p",[t._v("我们经常这么使用mapStateToProps")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("state=>({ num: state})\n")])])]),e("p",[t._v("或者这样只获取我们当前需要的属性")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("const mapStateToProps = (state) => {\n  return {\n    num: state.num\n  }\n}\n")])])]),e("h3",{attrs:{id:"mapdispatchtoprops"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#mapdispatchtoprops"}},[t._v("#")]),t._v(" mapDispatchToProps")]),t._v(" "),e("p",[t._v("这个函数的会将action以props的形式传递给组件，组件可用this.props触发相应action，也就是完成了上面的第二个任务。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("mapDispatchToProps(dispatch, ownProps): dispatchProps\n")])])]),e("p",[t._v("这个函数返回的是装有action的对象，通常我们直接给它赋值成一个对象，再把我们的action放进去。")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("import { add, remove, addAsync } from './index.redux'\nmapDispatchToProps = { add, remove, addAsync  }\n")])])]),e("p",[t._v("从这里看好像是完成了我们的任务，但是注意：在我们的组件可以通过this.props触发相应的action，但是还没有dispatch，所以只返回了一个type，所以上面的代码并不是正确的，只是便于大家理解。")]),t._v(" "),e("p",[t._v("我们还需要dispatch一下action，下面才是正确的代码：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("const mapDispatchToProps = (dispatch, ownProps) => {\n  return {\n    add: (...args) => dispatch(actions.add(...args)),\n    remove: (...args) => dispatch(actions.remove(...args)),\n    addAsync: (...args) => dispatch(actions.addAsync(...args))\n  }\n}\n")])])]),e("p",[t._v("有人会问，我用React-Redux的connect时，这个参数直接穿的是action对象呀，怎么回事？")]),t._v(" "),e("p",[t._v("这是因为在connect内部使用了Redux提供的bindActionCreators方法，在connect内部将所有的action都dispatch了。我们实现的时候，也需要实现这个bindActionCreators方法。")]),t._v(" "),e("h3",{attrs:{id:"mergeprops"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#mergeprops"}},[t._v("#")]),t._v(" mergeProps")]),t._v(" "),e("p",[t._v("mergeProps顾名思义，就是将stateProps、dispatchProps、ownProps合并起来。")]),t._v(" "),e("p",[t._v("如果不指定mergeProps，默认用Object.assign")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("function mergeProps(stateProps, dispatchProps, ownProps) {\n  return Object.assign({}, ownProps, {\n    num: stateProps.num,\n    add: () => dispatchProps.add(),\n    remove: () => dispatchProps.remove(),\n    addAsync: () => dispatchProps.addAsync(),\n  })\n}\n")])])]),e("h3",{attrs:{id:"options"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#options"}},[t._v("#")]),t._v(" options")]),t._v(" "),e("p",[t._v("规定connector的行为，通常我们使用默认值。")]),t._v(" "),e("h3",{attrs:{id:"connect方法的使用"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#connect方法的使用"}},[t._v("#")]),t._v(" connect方法的使用")]),t._v(" "),e("p",[t._v("我们常见的写法，也就是ES7的decorator装饰器，也就是装饰者模式，这种写法比较简便：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("@connect(\n  state=>({ num: state}),\n  { add, remove, addAsync }\n)\nclass App extends React.Component{\n  render(){\n    return (\n      <div>\n        <h2>现在有物品{this.props.num}件</h2>\n        <button onClick={this.props.add}>add</button>\n        <button onClick={this.props.remove}>remove</button>\n        <button onClick={this.props.addAsync}>addAsync</button>\n      </div>\n    )\n  }\n}\nexport default App;\n")])])]),e("p",[t._v("或者是更容易理解的高阶函数的写法：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("class App extends React.Component{\n  render(){\n    return (\n      <div>\n        <h2>现在有物品{this.props.num}件</h2>\n        <button onClick={this.props.add}>add</button>\n        <button onClick={this.props.remove}>remove</button>\n        <button onClick={this.props.addAsync}>addAsync</button>\n      </div>\n    )\n  }\n}\nApp = connect(\n    state => ({num: state),\n    { add, remove, addAsync }\n)(App)\n")])])]),e("p",[t._v("第二中写法我们可以更好的理解connect函数如何工作：connect接受了它的四个参数，然后返回了一个高阶组件，高阶组件需要接收一个组件作为参数，在高阶组件中通过处理被传入的组件，其中用到了connect的四个参数，最后将处理后的组件返回出去。")]),t._v(" "),e("h2",{attrs:{id:"_3-mapstatetoprops的实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_3-mapstatetoprops的实现"}},[t._v("#")]),t._v(" 3. mapStateToProps的实现")]),t._v(" "),e("hr"),t._v(" "),e("p",[t._v("connect方法返回了一个函数，函数里返回了一个组件，有两次返回，这里我们用两层箭头函数：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("export const connect = (mapStateToProps = (state) => state, mapDispatchToProps={}) => (WrapComponent) => {\n  return class ConnectComponent extends React.Component{\n\n  }\n}\n")])])]),e("p",[t._v("它等价于这种写法：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("export function connect (mapStateToProps = (state) => state, mapDispatchToProps={}) {\n  return function (WrapComponent) {\n    return class ConnectComponent extends React.Component{\n\n    }\n  }\n}\n")])])]),e("p",[t._v("双层箭头函数更加简洁，也算是编写高阶函数的一个技巧吧。")]),t._v(" "),e("p",[t._v("mapStateToProps的任务已经明确，先接收一个，获取Redux中的store，将stroe通过props传递给组件，代码如下：")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("import React from 'react'\nimport PropTypes from 'prop-types'\n\nexport const connect = (mapStateToProps = (state) => state, mapDispatchToProps={}) => (WrapComponent) => {\n  return class ConnectComponent extends React.Component{\n    static contextTypes = {\n      store: PropTypes.object\n    }\n    constructor (props, context) {\n      super(props, context)\n      this.state = {\n        props: {}\n      }\n    }\n    componentDidMount () {\n      const {store} = this.context\n      this.update()\n      store.subscribe(()=>this.update())\n    }\n    update () {\n      const { store } = this.context\n      const stateProps = mapStateToProps(store.getState())\n      this.setState({\n        props: {\n          ...this.state.props,\n          ...stateProps\n        }\n      })\n    }\n    render () {\n      return <WrapComponent {...this.props}/>\n    }\n  }\n}\n")])])]),e("p",[t._v("很明确，我们先用context获取了Provider组件传递过来的store然后将this.props与store中的属性merge成一个新的this.props传递给组件，组件mount的时候用store.subscribe监听了store内数据的变化，从而实时通知组件，完成了connect的第四个任务。")]),t._v(" "),e("h2",{attrs:{id:"_4-mapdispatchtoprops的实现"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#_4-mapdispatchtoprops的实现"}},[t._v("#")]),t._v(" 4. mapDispatchToProps的实现")]),t._v(" "),e("hr"),t._v(" "),e("p",[t._v("介绍mapDispatchToProps的是有也说了，传递进来的action不能直接使用，需要dispatch一下，Redux提供了一个bindActionCreators方法，同样我们也在自己的Reudx中实现这个方法。")]),t._v(" "),e("p",[t._v("接着上面的代码来写")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("import React from 'react'\nimport PropTypes from 'prop-types'\nimport {bindActionCreators} from './myRedux'\n\nexport const connect = (mapStateToProps=state=>state,mapDispatchToProps={})=>(WrapComponent)=>{\n\treturn class ConnectComponent extends React.Component{\n\t\tstatic contextTypes = {\n\t\t\tstore:PropTypes.object\n\t\t}\n\t\tconstructor(props, context){\n\t\t\tsuper(props, context)\n\t\t\tthis.state = {\n\t\t\t\tprops:{}\n\t\t\t}\n\t\t}\n\t\tcomponentDidMount(){\n\t\t\tconst {store} = this.context\n\t\t\tstore.subscribe(()=>this.update())\n\t\t\tthis.update()\n\t\t}\n\t\tupdate(){\n\t\t\tconst {store} = this.context\n\t\t\tconst stateProps = mapStateToProps(store.getState())\n\t\t\tconst dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)\n\t\t\tthis.setState({\n\t\t\t\tprops:{\n\t\t\t\t\t...this.state.props,\n\t\t\t\t\t...stateProps,\n\t\t\t\t\t...dispatchProps\t\n\t\t\t\t}\n\t\t\t})\n\t\t}\n\t\trender(){\n\t\t\treturn <WrapComponent {...this.state.props}></WrapComponent>\n\t\t}\n\t}\n}\n")])])]),e("p",[t._v("这个很简单，主要的就是bindActionCreators方法，写在我们自己的Redux中")]),t._v(" "),e("div",{staticClass:"language- extra-class"},[e("pre",{pre:!0,attrs:{class:"language-text"}},[e("code",[t._v("function bindActionCreator(creator, dispatch){\n\treturn (...args) => dispatch(creator(...args))\n}\nexport function bindActionCreators(creators, dispatch){\n\treturn Object.keys(creators).reduce((ret,item)=>{\n\t\tret[item] = bindActionCreator(creators[item],dispatch)\n\t\treturn ret\n\t},{})\n}\n")])])]),e("p",[t._v("也不是很难理解，遍历对象中的所有action，每个action都dispatch一下，返回每一个dispatch之后的action。")]),t._v(" "),e("p",[t._v("比如之前的add方法为：add(args)，现在的add方法是：store.dispatch(add(args))")]),t._v(" "),e("hr"),t._v(" "),e("p",[t._v("现在我们的Provider组件和connect高阶函数已经实现，下一篇我们实现Redux的中间件。")])])}),[],!1,null,null,null);s.default=a.exports}}]);
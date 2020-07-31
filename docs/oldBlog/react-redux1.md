---
title: Redux的实现和context
---

::: tip
2017-12-26 20:07，发布于博客园

<https://www.cnblogs.com/isLiu/p/8117427.html>
:::

react使用redux做状态管理，实现多个组件之间的信息共享，解决了父子组件、兄弟组件之间的复杂通信问题。vue有vuex，总之是一种flux的思想。react提供了react-redux这个库，一看名字就知道是为了将react和redux关联起来，react-redux有connect高阶函数以及Provider组件、milddleware、thunk等，来实现一下。

篇幅过长，多分了几篇。

## 1. Redux简单实现

________

这里先不考虑中间件机制

```
import { createStore } from 'redux'

function counter(state = 10, action) {
  console.log(state, action)
  switch (action.type) {
    case 'add':
      return state + 1
    case 'less':
      return state - 1
    default:
      return state
  }
}

const store = createStore(counter)

const init = store.getState()
console.log(`Init count: ${init}`)

function listener(){
  const current = store.getState()
  console.log(`count: ${current}`)
}
store.subscribe(listener)

store.dispatch({ type: 'add' })
store.dispatch({ type: 'less' })
```

这是redux简单的例子，首先我们定义了一个reducer叫做counter，接下来使用redux提供的createStore方法将reducer传入，构造出了一个store，然后基于观察者模式，触发相应的action，进行相应的响应。

Redux重点的方法就是createStore、getState、subscribe、dispatch这四个方法。大体讲一下思路，我们的Redux，这里就叫myRedux，myRedux和Redux一样，都是只暴露出来一个方法，那就是createStore，然后createStore保存着一个state，可以是对象、字符串、数组等，可以通过getState方法来访问state，还有对state的监听器以及订阅的方法，实现一下。

```
export function createStore (reducer) {
  let state = {}
  let listeners = []

  function getState () {
    return state
  }
  function subscribe (listener) {
    listeners.push(listener)
  }
  function dispatch (action) {
    state = reducer(state, action)
    listeners.forEach(listener => listener())
    return action
  }
  // 为了确保createStore之后，store.getState中就有state的初始值
  dispatch({type: '@myRedux/qwe'})
  return {getState, subscribe, dispatch}
}
```

其实就是一个观察者模式，值得注意的是：当执行完createStore之后，执行stroe.getState方法就能获取到初始的状态(我们这里是10)，所以需要我们的reducer先执行一次，那么我们就要在createStore中就先dispatch一下，代码中有体现。Redux中也是这么做的，Redux初始化dispatch的type值是`@@redux/INIT`，可以看一下。

![](http://images2017.cnblogs.com/blog/1272362/201712/1272362-20171226183309432-211313656.png)


这么做是为了确保初始化dispatch的type值不会和用户定义的type值重复，我们代码里type为`@myRedux/qwe`。


## 2.react中的context

________

要理解react-redux原理，必须先说下react中的context。父组件向子组件传递数据，可以通过props，如果层级比较深呢？就不好了，会有性能问题，我们可以通过context来实现跨级传递数据。

context是全局的，在组件中声明，所有的子组件都可以获取到context，react觉得全局不是很安全，所以要求context都是强数据类型，即任何想访问context里面的属性的组件都必须指定一个`contextTypes`的属性，如果没有指定该属性的话，用`this.context`访该属性就会出错。

同样，通过`getChildContext`方法指定传递给子组件的属性也需要被指定数据类型，通过childContextTypes来指定，不指定同样会产生错误。

下面是一个简单例子。

```
import React from 'react'
import PropTypes from 'prop-types'

class Son extends React.Component{
	render(){
			return (
				<div>
					<p>子组件</p>
					<GrandSon/>
				</div>
			)
	}
}

class GrandSon extends React.Component{
	static contextTypes = {
		user:PropTypes.string
	}
	render(){
		console.log(this.context)
		return (
				<div>
					<p>孙组件</p>
					<div>孙组件收到来自父组件的信息：{this.context.user}</div>
				</div>
		)
	}
}

class Father extends React.Component{
	static childContextTypes = {
		user:PropTypes.string
	}
	constructor(props){
		super(props)
		this.state = {user:'user12'}
	}
	getChildContext(){
		return this.state
	}
	render(){
		return (
			<div>
				<p>父组件，要给孙组件:{this.state.user}</p>
				<Son/>
			</div>
		)
	}
}

export default Father
```

在这里就不需要通过props一层一层的往下传递属性了，这就是context。



## 3.Provider组件

________


那么context和我们的react-redux有什么关系呢，用过的都知道，Provider组件在整个应用组件上包了一层，让整个应用组件成为Provider的子组件，看到这里，你是不是有点懂了，跟上面的例子很像嘛，对的，就是这样，我们的Provider组件接收Redux的store作为props，通过context对象传递给子组件。

我们下一篇就会说道Provider组件。
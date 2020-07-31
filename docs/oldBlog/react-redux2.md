---
title: Provider组件和connect的实现
---

::: tip
2017-12-27 23:05，发布于博客园

<https://www.cnblogs.com/isLiu/p/8119861.html>
:::

接着上一篇讲，上一篇我们实现了自己的Redux和介绍了React的context以及Provider的原理。

## 1. Provider组件的实现
________

Provider组件主要有以下下两个作用

1. 在整个应用上包一层，使整个应用成为Provider的子组件
2. 接收Redux的store作为props，通过context对象传递给子组件，所有的子组件都可以取得store

首先我们要知道，Provider组件的任务是将stroe传递给子组件，它只是一个传递数据的组件，只需要将子组件展示出来就好。

```
import React from 'react'
import PropTypes from 'prop-types'

export class Provider extends React.Component{
	static childContextTypes = {
		store: PropTypes.object
	}
	getChildContext(){
		return {store:this.store}
	}
	constructor(props, context){
		super(props, context)
		this.store = props.store
	}
	render(){
		return this.props.children
	}
}
```

## 2. connect方法
________

connect的作用就是将React和Redux中的store连接起来

首先要明确它的任务：

1. 接收一个组件，将Redux中的store通过props传递给组件
2. 将Redux中的action也通过props传递给组件
3. 返回一个新的组件，这个组件可以通过this.props访问到store中的属性，也可能是触发action
4. 当store中的数据发生变化的时候，通知新的组件

根据它的任务就能知道，它是一个高阶函数

### connect方法定义

官方给出connect的定义：

```
connect([mapStateToProps],  [mapDispatchToProps],  [mergeProps],  [options])
```

非常好理解了，在React-Redux中，我们常用的就是前两个参数。

### mapStateToProps

这个函数帮助我们将store中的数据作为props传递给组件，也就是实现了connect方法的第一个任务

```
mapStateToProps(state, ownProps) : stateProps
```

1. mapStateToProps的第一个参数就是Redux的store
2. 第二个参数就是自己的props，也可已将自己的props和store merge到一起传递给组件

我们经常这么使用mapStateToProps

```
state=>({ num: state})
```

或者这样只获取我们当前需要的属性

```
const mapStateToProps = (state) => {
  return {
    num: state.num
  }
}
```

### mapDispatchToProps

这个函数的会将action以props的形式传递给组件，组件可用this.props触发相应action，也就是完成了上面的第二个任务。

```
mapDispatchToProps(dispatch, ownProps): dispatchProps
```

这个函数返回的是装有action的对象，通常我们直接给它赋值成一个对象，再把我们的action放进去。

```
import { add, remove, addAsync } from './index.redux'
mapDispatchToProps = { add, remove, addAsync  }
```

从这里看好像是完成了我们的任务，但是注意：在我们的组件可以通过this.props触发相应的action，但是还没有dispatch，所以只返回了一个type，所以上面的代码并不是正确的，只是便于大家理解。

我们还需要dispatch一下action，下面才是正确的代码：

```
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    add: (...args) => dispatch(actions.add(...args)),
    remove: (...args) => dispatch(actions.remove(...args)),
    addAsync: (...args) => dispatch(actions.addAsync(...args))
  }
}
```

有人会问，我用React-Redux的connect时，这个参数直接穿的是action对象呀，怎么回事？

这是因为在connect内部使用了Redux提供的bindActionCreators方法，在connect内部将所有的action都dispatch了。我们实现的时候，也需要实现这个bindActionCreators方法。

### mergeProps

mergeProps顾名思义，就是将stateProps、dispatchProps、ownProps合并起来。

如果不指定mergeProps，默认用Object.assign

```
function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, ownProps, {
    num: stateProps.num,
    add: () => dispatchProps.add(),
    remove: () => dispatchProps.remove(),
    addAsync: () => dispatchProps.addAsync(),
  })
}
```

### options

规定connector的行为，通常我们使用默认值。

### connect方法的使用

我们常见的写法，也就是ES7的decorator装饰器，也就是装饰者模式，这种写法比较简便：

```
@connect(
  state=>({ num: state}),
  { add, remove, addAsync }
)
class App extends React.Component{
  render(){
    return (
      <div>
        <h2>现在有物品{this.props.num}件</h2>
        <button onClick={this.props.add}>add</button>
        <button onClick={this.props.remove}>remove</button>
        <button onClick={this.props.addAsync}>addAsync</button>
      </div>
    )
  }
}
export default App;
```

或者是更容易理解的高阶函数的写法：

```
class App extends React.Component{
  render(){
    return (
      <div>
        <h2>现在有物品{this.props.num}件</h2>
        <button onClick={this.props.add}>add</button>
        <button onClick={this.props.remove}>remove</button>
        <button onClick={this.props.addAsync}>addAsync</button>
      </div>
    )
  }
}
App = connect(
    state => ({num: state),
    { add, remove, addAsync }
)(App)
```

第二中写法我们可以更好的理解connect函数如何工作：connect接受了它的四个参数，然后返回了一个高阶组件，高阶组件需要接收一个组件作为参数，在高阶组件中通过处理被传入的组件，其中用到了connect的四个参数，最后将处理后的组件返回出去。

## 3. mapStateToProps的实现
________

connect方法返回了一个函数，函数里返回了一个组件，有两次返回，这里我们用两层箭头函数：

```
export const connect = (mapStateToProps = (state) => state, mapDispatchToProps={}) => (WrapComponent) => {
  return class ConnectComponent extends React.Component{

  }
}
```

它等价于这种写法：

```
export function connect (mapStateToProps = (state) => state, mapDispatchToProps={}) {
  return function (WrapComponent) {
    return class ConnectComponent extends React.Component{

    }
  }
}
```

双层箭头函数更加简洁，也算是编写高阶函数的一个技巧吧。

mapStateToProps的任务已经明确，先接收一个，获取Redux中的store，将stroe通过props传递给组件，代码如下：

```
import React from 'react'
import PropTypes from 'prop-types'

export const connect = (mapStateToProps = (state) => state, mapDispatchToProps={}) => (WrapComponent) => {
  return class ConnectComponent extends React.Component{
    static contextTypes = {
      store: PropTypes.object
    }
    constructor (props, context) {
      super(props, context)
      this.state = {
        props: {}
      }
    }
    componentDidMount () {
      const {store} = this.context
      this.update()
      store.subscribe(()=>this.update())
    }
    update () {
      const { store } = this.context
      const stateProps = mapStateToProps(store.getState())
      this.setState({
        props: {
          ...this.state.props,
          ...stateProps
        }
      })
    }
    render () {
      return <WrapComponent {...this.props}/>
    }
  }
}
```

很明确，我们先用context获取了Provider组件传递过来的store然后将this.props与store中的属性merge成一个新的this.props传递给组件，组件mount的时候用store.subscribe监听了store内数据的变化，从而实时通知组件，完成了connect的第四个任务。

## 4. mapDispatchToProps的实现
________

介绍mapDispatchToProps的是有也说了，传递进来的action不能直接使用，需要dispatch一下，Redux提供了一个bindActionCreators方法，同样我们也在自己的Reudx中实现这个方法。

接着上面的代码来写

```
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from './myRedux'

export const connect = (mapStateToProps=state=>state,mapDispatchToProps={})=>(WrapComponent)=>{
	return class ConnectComponent extends React.Component{
		static contextTypes = {
			store:PropTypes.object
		}
		constructor(props, context){
			super(props, context)
			this.state = {
				props:{}
			}
		}
		componentDidMount(){
			const {store} = this.context
			store.subscribe(()=>this.update())
			this.update()
		}
		update(){
			const {store} = this.context
			const stateProps = mapStateToProps(store.getState())
			const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)
			this.setState({
				props:{
					...this.state.props,
					...stateProps,
					...dispatchProps	
				}
			})
		}
		render(){
			return <WrapComponent {...this.state.props}></WrapComponent>
		}
	}
}
```

这个很简单，主要的就是bindActionCreators方法，写在我们自己的Redux中

```
function bindActionCreator(creator, dispatch){
	return (...args) => dispatch(creator(...args))
}
export function bindActionCreators(creators, dispatch){
	return Object.keys(creators).reduce((ret,item)=>{
		ret[item] = bindActionCreator(creators[item],dispatch)
		return ret
	},{})
}
```

也不是很难理解，遍历对象中的所有action，每个action都dispatch一下，返回每一个dispatch之后的action。

比如之前的add方法为：add(args)，现在的add方法是：store.dispatch(add(args))

________

现在我们的Provider组件和connect高阶函数已经实现，下一篇我们实现Redux的中间件。
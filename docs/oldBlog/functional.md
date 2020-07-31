---
title: 函数式编程与React高阶组件
---

::: tip
2017-12-26 14:21，发布于博客园

<https://www.cnblogs.com/isLiu/p/8081393.html>
:::

相信不少看过一些框架或者是类库的人都有印象，一个函数叫什么creator或者是什么什么createToFuntion，总是接收一个函数，来返回另一个函数。这是一个高阶函数，它可以接收函数可以当参数，也可以当返回值，这就是函数式编程。像柯里化、装饰器模式、高阶组件，都是相通的，一个道理。

本文重点是React高阶组件，要理解高阶组件，不得不说函数式编程。

## 1. 函数式编程

________

函数式编程是一种编程模式，在这种编程模式种最常用函数和表达式，函数式编程把函数作为一等公民，强调从函数的角度考虑问题，函数式编程倾向用一系列嵌套的函数来解决问题。

简单写个例子

```
	function OCaml () {
		console.log('I\'m FP language OCaml')
	}
	function clojure() {
		console.log('I\'m FP language clojure')
	}
```

现在想在每条console语句前后各加一条console语句，如果在每个函数都加上console语句，会产生不必要的耦合，所以高阶函数就派上了用场。

```
	function FuncWrapper(func) {
		return function () {
			console.log('before')
			func()
			console.log('after')
		}
	}
	var OCaml = FuncWrapper(OCaml)
	var clojure = FuncWrapper(clojure)
```

我们写了一个函数FuncWrapper，该函数接一个函数作为参数，将参数函数装饰了一层，返回出去，减少了代码耦合。在设计模式中称这种模式为装饰器或装饰者模式。

当然函数式编程的好处不止这一条，有些人吹捧OCaml，clojure, scala等FP语言特性比如：纯函数无副作用、不变的数据、流计算模式、尾递归、柯里化等等。

在React中，高阶组件HOC就相当于这么一个FuncWrapper，传入一个组件，返回被包装或者被处理的另一个组件。

## 2. 高阶组件

________

上边已经简单说过了什么是高阶组件，其实本质上是一个类工厂。先举个例在再说

第一个组件
```
import React from 'react'

export default class OCaml extends React.Component {
  constructor (props) {
    super(props)
    this.changeHandle = this.changeHandle.bind(this)
  }
  changeHandle (value) {
    console.log(value)
  }
  render () {
    return (
        <div>
          <h2>I'm OCaml</h2>
          <input type="text" onchange={value => this.changeHandle(value)}/>
        </div>
    )
  }
}
```

第二个组件
```
import React from 'react'

export default class Clojure extends React.Component {
  constructor (props) {
    super(props)
    this.changeHandle = this.changeHandle.bind(this)
  }
  changeHandle (value) {
    console.log(value)
  }
  render () {
    return (
        <div>
          <h2>I'm Clojure</h2>
          <input type="text" onchange={value => this.changeHandle(value)}/>
        </div>
    )
  }
}
```

有两个不相同的组件，但是有部分功能重合，就是那个changeHandle函数，理解了高阶函数，再解决这类问题就不难了吧？不还是一样吗？

```
import React from 'react'

export default function CompWrapper (Component) {
  return class WarpComponent extends React.Component {
    constructor (props) {
      super(props)
      this.handleChange = this.handleChange.bind(this)
    }

    handleChange (value) {
      console.log(value)
    }

    render () {
      return <Component handleChange={this.handleChange} {...this.props}></Component>
    }
  }
}

OCaml = CompWrapper(OCaml)
Clojure = CompWrapper(Clojure)
```

这是一个最简单的高阶组件。注意，再高阶组件的返回包装好的组件的时候，我们将高阶组件的props展开并传入包装好的组件中，这是确保给高阶组件的props也能给到被包装的组件上。

高阶组件的通途很多，可以用来，代码复用，逻辑抽象，抽离底层代码，渲染劫持，更改state、更改props等等。

我们主要说一下两种功能的React高阶组件：属性代理、反向继承。


## 3. 属性代理(props proxy)

________

很好说了，上面已经提到过了，再来一遍，高阶组件将它收到的props传递给被包装的组件，所叫属性代理

```
export default function CompWrapper (Component) {
  return class WarpComponent extends React.Component {
    render () {
      return <Component {...this.props}></Component>
    }
  }
}
```

### 属性代理主要用来处理以下问题

* 更改props
* 抽取state
* 通过refs获取组件实例
* 将组件与其他原生DOM包装到一起

### 更改props

例子是增加props的，其他的类似，都是在在高阶组件内部加以处理。

```
import React from 'react'

export default function CompWrapper (Component) {
  return class WarpComponent extends React.Component {
    say () {
      console.log('我是被高阶组件包装过的组件！')
    }
    newProps = {
      isLogin: true,
      msgList: [1,2,3,4,5]
    }
    render () {
      return <Component say={this.say} {...this.props} {...this.newProps}></Component>
    }
  }
}
```

包装好的组件可以用this.props.say调用say方法，可以用this.props.isLogin判断登陆状态等等。

### 抽像state

我们可以通过props和回调函数来抽象state

```
import React from 'react'

export function CompWrapper (Component) {
  return class WarpComponent extends React.Component {
    constructor (props) {
      super(props)
      this.state = {
        inputValue: '暂时还没哟'
      }
      this.changeHandle = this.changeHandle.bind(this)
    }
    changeHandle (event) {
      this.setState({
        inputValue: event.target.value
      })
    }
    render () {
      return <Component {...this.props} inputValue={this.state.inputValue} changeHandle={this.changeHandle}></Component>
    }
  }
}
```

这个高阶组件将一切数据都绑定到了自己的身上，只需要出触发被包装组件的特定事件，就将改变自己的state，再将自己的state通过props传递给被包装组件。

```
@CompWrapper
export class InputComp extends React.Component {
  render () {
    return (
        <div>
          <h2>{this.props.inputValue}</h2>
          <input type="text" onChange={this.props.changeHandle}/>
        </div>
    )
  }
}
```

这里的input就成了完全受控的组件。注意：在定义组件的语句上边写上@CompWrapper是和`InputComp = CompWrapper(InputComp)`作用是一样的。@操作符是ES7的decorator，也就是装饰器。

### 通过 refs 获取组件实例

从你的 render 方法中返回你的 UI 结构后，你会发现你想要“伸手”调用从 render 返回的组件实例的方法，我们可以通过ref获取组件的实例，但是想让ref生效，必须先经过一次正常的渲染来使ref得到计算，怎么先让组件经过一次正常的渲染呢？高阶组件又来了，明白了吗？高阶组件的render返回了被包装的组件，然后我们就可以通过ref获取这个组件的实例了。

```
import React from 'react'

export function CompWrapper (Component) {
  return class WarpComponent extends React.Component {
    proc(wrappedComponentInstance) {
      wrappedComponentInstance.say()
    }
    render () {
      const props = Object.assign({}, this.props, {ref: this.proc.bind(this)})
      return <Component {...props}></Component>
    }
  }
}

@CompWrapper
export class InputComp extends React.Component {
  say () {
    console.log('I\'m InputComp')
  }
  render () {
    return (
        <button onClick={()=>{console.log(this.props)}}>点击</button>
    )
  }
}
```

当被包装的组件被渲染后，就可以执行自己实例的方法了，因为计算ref这件事已经由高阶组件做完了。

### 将组件与其他原生DOM包装到一起

这个很好理解，如果想把布局什么的和组件结合到一起，使用高阶组件是一个办法。

```
import React from 'react'

export function CompWrapper (Component) {
  return class WarpComponent extends React.Component {
    render () {
      return (
          <div style={{marginTop: 100}}>
            <Component {...this.props}/>
          </div>
      )
    }
  }
}

```


## 4. 反向继承

________

为什么叫反向继承，是高阶组件继承被包装组件，按照我们想的被包装组件继承高阶组件。

```
import React from 'react'

export function CompWrapper (Component) {
  return class WarpComponent extends Component {
    render () {
      return super.render()
    }
  }
}
```

反向代理主要用来做**渲染劫持**

### 渲染劫持

所谓的渲染劫持，就是最后组件所渲染出来的东西或者我们叫React Element完全由高阶组件来决定，通过所以我们可以对任意一个React Element的props进行操作；我们也可以操作React Element的Child。

```
import React from 'react'

export function CompWrapper (Component) {
  return class WarpComponent extends Component {
    render () {
      const reactElm = super.render()
      let newProps = {}
      if (reactElm.type === 'input') {
        newProps = {value: '这是一个input'}
      }
      const props = Object.assign({}, reactElm.props, newProps)
      const newReactElm = React.cloneElement(reactElm, props, reactElm.props.child)
      return newReactElm
    }
  }
}
```

这个例子，判断组件的顶层元素是否为一个input，如果是的话，通过cloneElement这个方法来克隆出一个一样的组件，并将新的props传入，这样input就有值了。

用过React-Redux的人可能会有印象，使用connect可以将react和redux关联起来，这里的connect就是一个高阶组件，想到这，就很容易想出connect高阶组件是怎么实现了，我会在写一篇随笔，自己实现一个redux、connect、midlleware还有thunk。
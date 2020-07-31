---
title: React的setState分析
---

::: tip
2018-01-19 20:08，发布于博客园

<https://www.cnblogs.com/isLiu/p/8313063.html>
:::

前端框架层出不穷，不过万变不离其宗，就是从MVC过渡到MVVM。从数据映射到DOM，angular中用的是watcher对象，vue是观察者模式，react就是state了。

React通过管理状态实现对组件的管理，通过this.state()方法更新state。当this.setState()被调用的时候，React会重新调用render方法来重新渲染UI。

本文针对React的SetState的源码来进行解读，根据陈屹老师的《深入React技术栈》加上自己的理解。

## 1. setState异步更新
____

setState通过一个队列机制实现state的更新。当执行setState时，会把需要更新的state合并后放入状态队列，而不会立刻更新this.state，利用这个队列机制可以高效的批量的更新state。

```
// 将新的 state 合并到状态更新队列中
var nextState = this._processPendingState(nextProps, nextContext);

// 根据更新队列和 shouldComponentUpdate 的状态来判断是否需要更新组件 var shouldUpdate =
 this._pendingForceUpdate ||
!inst.shouldComponentUpdate || inst.shouldComponentUpdate(nextProps, nextState, nextContext);
```
如果不通过setState而直接修改this.state的值，就像这样:`this.state.value = 1`，那么该state将不会被放入状态队列中，下次调用this.setState并对状态队列进行合并时，将会忽略之前直接别修改的state，因此我们应该用setState更新state的值。

## 2. setState循环调用
____

当调用setState时，实际上会执行enqueueSetState方法，并对partialState以及_pendingStateQueue更新队列进行合并，最终通过enqueueUpdate执行state更新。

而performUpdateIfNecessary方法获取_pendingElement、_pendingStateQueue、_pendingForceUpdate，并调用reciveComponent和updateComponent方法进行组件更新。

如果在shouldComponentUpdate或者componentWillUpdate方法中调用setState，此时this._pendingStateQueue != null，则perfromUpdateIfNecessary方法就会调用updateComponent方法进行组件更新，单updateComponent方法又会调用shouldComponentUpdate和componentWillUpdate方法，造成循环调用。


![](http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180118210918193-1641673963.png)

接下里我们看看setState的源码：

```
// 更新 state
ReactComponent.prototype.setState = function(partialState, callback) {
    this.updater.enqueueSetState(this, partialState);
    if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
    } 
};

enqueueSetState: function(publicInstance, partialState) { 
    var internalInstance = getInternalInstanceReadyForUpdate(
         publicInstance,
        'setState' 
    );
    
    if (!internalInstance) { 
    return;
    }
    
    // 更新队列合并操作
    var queue = internalInstance._pendingStateQueue || (internalInstance._pendingStateQueue = []);
    
    queue.push(partialState);
    enqueueUpdate(internalInstance); 
},

// 如果存在 _pendingElement、_pendingStateQueue和_pendingForceUpdate，则更新组件 
performUpdateIfNecessary: function(transaction) {
    if (this._pendingElement != null) {
        ReactReconciler.receiveComponent(this, this._pendingElement, transaction, this._context);
    }
    if (this._pendingStateQueue !== null || this._pendingForceUpdate) {
        this.updateComponent(transaction, this._currentElement, this._currentElement, this._context, this._context);
    } 
}
```

## 3. setState调用栈
____

对setState很了解是吧？来看看这个：

```
class Example extends React.Component {
  constructor() {
    super();
    this.state = {
      val: 0
    };
  }
  
  componentDidMount() {
    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 1 次 log

    this.setState({val: this.state.val + 1});
    console.log(this.state.val);    // 第 2 次 log

    setTimeout(() => {
      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 3 次 log

      this.setState({val: this.state.val + 1});
      console.log(this.state.val);  // 第 4 次 log
    }, 0);
  }

  render() {
    return null;
  }
};
```
结果是：`0、0、2、3`，我第一次也不懂，怎么回事呢？

下面是一个简化的setState调用栈。

![](http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180118214727459-2115515097.png)

我们说过setState最终是通过enqueueUpdate执行state更新，enqueueUpdate代码如下：

```
function enqueueUpdate(component) {
    ensureInjected();
    
    // 如果不处于批量更新模式
    if (!batchingStrategy.isBatchingUpdates) {
        batchingStrategy.batchedUpdates(enqueueUpdate, component);
        return; 
    }
    
    // 如果处于批量更新模式，则将该组件保存在 dirtyComponents 中
    dirtyComponents.push(component); 
}
```
如果isBatchingUpdates也就是处于批量更新模式，就把当前调用了this.setState的组件放入dirtyComponents数组中。否则的话就不是批量更新模式，则对队列中的所有更新执行batchedUpdates方法。例子中的4次console之所以不同，这里的逻辑判断起了关键作用。

那batchingStrategy呢？其实他就是一个简单的对象：
```
var ReactDefaultBatchingStrategy = { 
    isBatchingUpdates: false,
    
    batchedUpdates: function(callback, a, b, c, d, e) {
        var alreadyBatchingUpdates = ReactDefaultBatchingStrategy.isBatchingUpdates;
        ReactDefaultBatchingStrategy.isBatchingUpdates = true;
        
        if (alreadyBatchingUpdates) { 
            callback(a, b, c, d, e);
        } else {
            transaction.perform(callback, null, a, b, c, d, e);
        } 
    },
}
```
注意，batchedUpdates中有个transaction.perform调用，transaction，下面说。

## 4. transaction
____

有人看到这里，transaction，不就是事务吗？保证数据一致性要用到的，然后说了几条事务的特性，什么原子性、稳定性，但是抱歉，这里的事务和SQL里的事务不一样，我个人理解这个事务有点类似于中间件，为什么叫事务，不知道。

可以画一张图理解一下：

![](http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180119192044193-1775626425.png)

事务就是将需要执行的方法用wrapper封装起来，再通过事务提供的perform方法执行。而再perform之前，先执行所wrapeer中的initialize方法，执行完需要执行的方法后，再执行close方法。一组initialize和close方法称为一个wrapper，事务支持多个wrapper叠加。

React里涉及到很多高阶函数，个人理解这个事务也就是一个高阶函数嘛，也就是中间件的思想。

## 5. 解密setState
____

刚说了事务，那事务是怎么导致前面所述的setState的各种不同的输出呢？

很显然，我们可以将4次setState简单规成两类，componentDidMount是一类，setTimeOut中的又是一类，因为这两次在不同的调用栈中执行。

我们先看看在componentDidMount中setState的调用栈：

![](http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180119193501068-394523727.png)

再看看在setTimeOut中的调用栈：

![](http://images2017.cnblogs.com/blog/1272362/201801/1272362-20180119194116740-866239730.png)

显然，在componentDidMount中调用setState的调用栈更加复杂，那我们重点看看在componentDidMount中的调用栈，发现了batchedUpdates方法，原来在setState调用之前，就已经处于batchedUpdates执行的事务之中了。

那batchedUpdates方法是谁调用的呢？我们再往上追溯一层，原来是ReactMount.js中的_renderNewRootComponent方法。也就是说，整个将React组件渲染到DOM的过程就处于一个大的事务中了。

接下来就可以理解了，因为在componentDidMount中调用setState时，batchingStrategy的isBatchingUpdates已经被设置为true了，所以两次setState的结果并没有立即生效，而是被放进了dirtyComponents中。这也解释了两次打印this.state.val都是0的原因，因为新的state还没被应用到组件中。

在看setTimeOut中的两次setState，因为没有前置的batchedUpdate调用，所以batchingStrategy的isBatchingUpdates标志位是false，也就导致了新的state马上生效，没有走到dirtyComponents分支。也就是说，setTimeOut中的第一次执行，setState时，this.state.val为1，而setState完成后打印时this.state.val变成了2。第二次的setState同理。
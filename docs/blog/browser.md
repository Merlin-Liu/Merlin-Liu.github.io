---
title: 浏览器
---

## 事件流

事件触发有三个阶段
1. 捕获：document往事件触发处传递，遇到注册捕获的事件会触发
2. 传递到对应事件触发处，触发对应的事件
3. 冒泡：从事件触发处向document传递，遇到注册冒泡的事件会触发

捕获-触发-冒泡，组成了事件流

事件触发顺序一般都会按照上述捕获-触发-冒泡的顺序执行；但是如果给同一节点既注册了捕获事件和冒泡事件，会按照注册的顺序执行

下面代码先输出冒泡，后输出捕获
```js
node.addEventListener('click', function() {
    console.log('冒泡');
}, false);

node.addEventListener('click', function() {
    console.log('捕获');
}, true);
```

`preventDefault`阻止默认事件，比如点击checkbox的默认事件是选中，可以通过该方法阻止checkbox点击时被选中。
`stopPropagation`阻止事件的进一步传播，能阻止冒泡事件，也能阻止捕获事件。
`stopImmediatePropagation`同样能阻止事件传播，而且还能阻止执行其他的事件。

### 如何让页面所有的点击事件失效

在事件捕获阶段，阻止事件冒泡、阻止默认事件

```js
document.addEventListener('click', function(e) {
    e.stopPropagation();
    e.preventDefault();
})
```

### 如何监听ul一亿个里的li的点击事件

事件代理，点击li，事件会冒泡到父元素ul上，通过event.target拿到点击的li

## 跨域

同源策略：浏览器的限制，对不同协议、域名、端口禁止访问，有一个不同就是跨域，ajax会请求失败

### JSONP

利用script标签的src属性没有对跨域的限制，缺点是只适合get请求

```js
function jsonp(url, callbackStr, success) {
    const script = document.createElement('script');
    script.src = url + '&callback=' + callbackStr;
    script.type = 'text/javascript';
    window[callbackStr] = function(data) {
        success && success(data);
    }

    document.body.appendChild(script);
}

jsonp('https://api.twitter.com', 'callback', function(resData) {
    console.log(resData)
});
```

### CORS

corss origin resource sharing 跨域资源共享

需要服务端配置header，Access-Control-Allow-Origin

### document.domain

该方式只适用二级域名相同的情况下，比如`a.baidu.com`和`b.baidu.com`

只要给页面添加`document.domain`，表示二级域名相同，就可以跨域

### postMessage

扩展：MessageChannel类，message事件，postMessage方法
```js
```

## Event Loop

一次正确的事件循环：
1. 执行同步代码，宏任务
2. 同步代码执行完成，去微任务队列查询是否有微任务执行
3. 执行所有微任务
4. 渲染UI
5. 下一轮宏任务，执行宏任务中的异步代码

由事件循环的顺序可知，如果宏任务中的异步代码有大量计算且需要操作dom时，为了页面的快速响应，可以把操作dom放到微任务中

### 宏任务与微任务

宏任务有：script标签里的代码、setTimeout、setInterInterval、setImmediate、IO、UI render
微任务有：Promise.then里的、process.nextTick、Object.observe、MutationObserver

说出执行顺序
```js
console.log('script start')

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')

// script start
// Promise
// script end
// promise1
// promise2
// setTimeout
```

---
title: 前端实习生面试题分析（二）
---

::: tip
2017-11-19 17:52，发布于博客园

<https://www.cnblogs.com/isLiu/p/7859669.html>
:::

本篇是关于手写代码的题目。

## 1.实现一个trim函数

关于性能的写法也不多说了，只是用最直观的写法来写一下，使用正则有大概五六种写法，感兴趣可以自己去研究下，推荐《高性能JavaScript》

1.正则实现

* trim
```
       String.prototype.trim = function () {
　　    return this.replace(/(^\s*)|(\s*$)/g, "");
　　}
```
* leftTrim 
```
       String.prototype.leftTrim = function () {
　　    return this.replace(/(^\s*)/g,"");
　　}
```
* rightTrim 
```
       String.prototype.rightTrim = function () {
　　    return this.replace(/(\s*$)/g,"");
　　}
```

2.非正则实现

* trim
```
	String.prototype.trim = function () {
         var start = 0,			
             end = this.length - 1,
             ws = /\s/			
	    while (ws.indexOf(this.charAt(start)) > -1) {
            start ++
	    }
	    while (end > start && ws.indexOf(this.charAt(end)) > -1) {
            end --
	    }
	    return this.slice(start, end + 1)　　 
	 }
```
* leftTrim 
```
	String.prototype.leftTrim = function () {
		var start = 0,			
		     end = this.length - 1,
		     ws = /\s/			
		while (ws.indexOf(this.charAt(start)) > -1) {
			 start ++
	 	}
		return this.slice(start, end)
　}
```
* rightTrim 
```
	String.prototype.rightTrim = function () {
		var start = 0,			
		     end = this.length - 1,
		     ws = /\s/			
		while (end > start && ws.indexOf(this.charAt(end)) > -1) {
			end --
		}
		return this.slice(start, end + 1)
　}
```

3.混合实现

当字符串的末尾只有一小段空白时候，正则表达式会陷入疯狂工作状态；而通过循环遍历字符串的效率也比不上正则表达式，所以有了这种混合模式

```
	String.prototype.trim = function () {
		var str = this.replace(/^\s+/, '')
				end = str.length - 1
				ws = /\s/
		while (ws.test(str.charAt(end))) {
			end --
		}
		return str.slice(0, end + 1)
　}
```
--------

## 2.call、apply、bind之间的区别

总之三种方法都是改变函数内this的指向

1.fn.call (context, arg1, arg2, .....)

call中第一个参数是fn的上下文，剩下的参数就是需要向fn中传递的参数

2.fn.apply (context, [args])

apply同call类似，第一个参数也是fn的上下文，和call不同的是，apply第二个参数是数组，call的第二个及第二个以后的参数都是数组里面的元素

3.fn.bind (context)

bind会创建一个函数，称之为绑定函数，调用这个函数时，绑定函数会以创建它是bind方法传入的第一个参数作为自己的上下文，第二个及第二个以后的参数并且加上绑定函数运行时传递进来的参数作为原函数的参数来调用原函数。 （有点绕哈，不过对下一道题有帮助）

4.call、apply、bind最大的区别就是bind不会立即调用，会返回一个函数，apply、call会立即调用。

--------

## 3.用call或者apply实现一个bind函数

看看上面的bind定义吧，不多说了

```
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
```
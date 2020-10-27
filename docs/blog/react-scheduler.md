---
title: react
---

## 二进制的逻辑运算

`React Fiber`中对`TypeOfMode`的设计，目的是简化类型比较，以及类型复合的方向

``` js
export const NoContext = 0b000;
export const AsyncMode = 0b001;
export const StrictMode = 0b010;
export const ProfileMode = 0b100;
```

* scheduler（异步调度）
    * 维护时间片
    * 模拟rICb（浏览器上的任务例如动画、交互都执行完成，JS引擎有空闲的时候调用回调，优先级比rAF低 ），调度列表、超时判断
* scheduler产生的背景
* scheduler Demo
* fiber结构
* react流程
* scheduler 核心
* 整体流程概览


任务调度的概念，调度什么东西？为了达到什么目的

## expirationTime

在react中，为防止某个update因为优先级的原因一直被打断而未能执行。react会设置一个ExpirationTime，当时间到了ExpirationTime的时候，如果某个update还未执行的话，react将会强制执行该update，这就是ExpirationTime的作用。

### 两种超时时间

React 中有两种类型的ExpirationTime，一个是Interactive的，另一种是普通的异步。Interactive的比如说是由事件触发的，那么他的响应优先级会比较高因为涉及到交互。

``` js
// 将两个数值带入expirationTime计算公式

// 异步更新，优先级较低，得到的expirationTime较大
var LOW_PRIORITY_EXPIRATION = 5000;
var LOW_PRIORITY_BATCH_SIZE = 250;

// 事件响应，优先级较高，得到的expirationTime较小
var HIGH_PRIORITY_EXPIRATION = 500;
var HIGH_PRIORITY_BATCH_SIZE = 100;
```

### 计算公式(异步更新)

`((((currentTime - 2 + 5000 / 10) / 25) | 0) + 1) * 25`

currentTime的计算公式：`((now / 10) | 0) + 2`

翻译一下就是：当前时间加上498然后处以25取整再加1再乘以 5，需要注意的是这里的currentTime是经过msToExpirationTime处理的，也就是((now / 10) | 0) + 2，所以这里的减去2可以无视，而除以 10 取整应该是要抹平 10 毫秒内的误差

最终结果是以25为单位向上增加的，比如说我们输入10002 - 10026之间，最终得到的结果都是10525，但是到了10027的到的结果就是10550，这就是除以25取整的效果。

之所以是为么磨平25ms的时间差是为了让非常相近的两次更新得到相同的expirationTime，然后在一次更新中完成，相当于一个自动的batchedUpdates
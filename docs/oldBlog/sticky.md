---
title: 滚动到指定位置导航固定（CSS实现）
---

::: tip
2018-03-31 19:17，发布于博客园

<https://www.cnblogs.com/isLiu/p/8683801.html>
:::

最近公司做的业务都是使用Vue、Element写的，涉及到的相应的基础业务像轮播、预加载、懒加载，都是使用
NPM上的工具来实现，原理和基础还是要有的，就来实现几个项目中常用到的业务。

经常见到这样的效果，导航在页面中间，当界面滚动到导航的时候，导航就变成了`fixed`布局。为了看效果，我加了边框。

<img src="https://images2018.cnblogs.com/blog/1272362/201803/1272362-20180331182840542-161849516.png" width = "320" height = "568"  />

刚开始，京东金融的注册登陆、还有下载App的导航在界面中部。当你滚动到导航的位置或者是再向下滚动的时候，导航就固定住了。

<img src="https://images2018.cnblogs.com/blog/1272362/201803/1272362-20180331183052439-2003928584.png" width = "320" height = "568"  />

这就是大概效果，反之滚动回来的时候，导航还在界面中部。来实现一下吧。

## JS实现

不难，首先记录最初导航的位置，然后监听scroll事件控制CSS就好了。说的简单，感觉做了整么长时间的前端，基础都快忘光了，做了好久才实现，其中都是基础不牢固惹的货，看来以后还是要注重基础。

话不多说，就是几行代码，优化就不做了。

```
        methods: {
            scrolls () {
                var header = this.$refs.header.$el   
                var headerTop = header.offsetTop                             
                window.onscroll = () => {
                    if (document.documentElement.scrollTop > headerTop)
                        header.style.position = 'fixed'
                    else
                        header.style.position = 'static'
                }
            }
        },
        mounted () {
            this.scrolls()
        }
```

对呀，这么简单，为啥还整了一篇随笔呢？别急，那你会用CSS实现吗？

## CSS实现

面试时候有人会问，position有那几种值，你说：绝对的、相对的、fixed，能说出这些是不及格的。

那你想了想，哦对，还有static，嗯，勉强合格。

优秀一点的同学会说还有`inherit`、`initial`、`unset`，嗯不错，挺好，还有吗？

这时候你赶紧趁着趁着面试官说话的时机百度了一下，发现还有一个值，`sticky`，你装作思考了一下说还有一个`sticky`，面试管觉得你很不错，那你在业务种使用过这个值吗？GG。

`sticky`，就叫它粘性定位吧，粘性定位是基于`position:relative`和`position:fixed`两者之间的，为什么说介于两者之间呢？粘性定位根据一个阈值来决定，超出阈值之前采用`相对定位`，超出阈值之后就是`fixed定位`了。

那这个阈值又是什么呢？就是`top`、`right`、`bottom`、`left`四种之一，也只有这四种之一，才能让粘性定位生效，否则表现为`相对定位`。

相对定位和fixed定位，拿不就完美的解决了我们的问题了吗？没错。来试试吧。

```
.header {
        color: #666;
        height: 100px;
        line-height: 100px;
        position: sticky;
        top: 0px;
        left: 0px;
        right: 0px;
        font-size: 32px;
        background: #fff url(//m.jr.jd.com/spe/qyy/main/images/jr-logo.png) center center no-repeat;
        background-size: auto 50%;
        z-index: 100;
        border: 1px solid #999;
        }
```

看看效果：

![](https://images2018.cnblogs.com/blog/1272362/201803/1272362-20180331190842657-2013103911.gif)

和之前使用JS实现的没什么区别，不过有句话说的好，能用CSS的话就别用JS，从性能上来考虑还是`粘性定位`更好一点。

注意了：并且 top 和 bottom 同时设置时，top 生效的优先级高，left 和 right 同时设置时，left 的优先级高。

不过美中不足的是：`position:sticky`的兼容性不太强。

如果我们在面试中能说出这样的一个属性及其相关说明，并能给出它具体的业务场景的话，那就相当的不错了。
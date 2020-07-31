---
title: 图片懒加载
---

::: tip
2018-04-02 15:05，发布于博客园

<https://www.cnblogs.com/isLiu/p/8693507.html>
:::

## 背景

大部分场景下我们对懒加载的定义实际上是对于图片而言的，对于图片进入可视区域之后去请求图片资源的这种情况、这种case实际上就是一个典型的懒加载的case。这些资源虽然是HTML DOM上的，但是这些资源没有进入可视区域之前，这些图片资源并没有由浏览器发出请求去请求这些图片资源，为什么呢？

对于类似电商这种图片很多，页面很长的业务场景下呢，我们希望相关的资源是要进行懒加载的，原因就是`首先它能减少无效资源的加载`。假如说我们由一张图片，但是用户只看了两页几十张就退出界面了，剩下的绝大部分图片没有进入到用户的可视区域，用户没有去看。这种情况下，我们就没有必要去加载那么多的图片资源的。这些资源对用户访问来说是无效资源，因为他们根本就没看，那么请求这些资源也是无效的请求。

第二点就是浏览器对于某一个host name是有并发度上限的，如果说我们的图片所在的CDN和我们的静态资源所在的CDN是同一个CDN的话，我们图片的加载就会阻塞后续JS的加载。JS大部分情况下都是写在body尾部的，那么img大多数情况下会在JS的上面，如果浏览器在并发请求图片的时候达到并发度的限制的话，会导致浏览器没有办法并发请求到后面的JS相关的资源，从而导致网站JS加载的延后，进而`影响网站JS相关逻辑的正常使用`。

图片什么时候会向服务器或者是CDN去请求资源呢，只有img标签里的src属性被设置之后，浏览器在渲染过程中解析到img下的src属性，就会去请求src资源。所以在真实场景下呢，当图片进入可视区域之后，img的src才会被设置进去，而不是说页面一开始加载的时候，可视区之外的img的src属性就被设置进去。如果已经设置了的话，那么显然图片就会被直接的加载进来，也就不存在懒加载的问题了。

## 原理

懒加载的实现就是对于没有进入界面可视区域内的图片，img的src并不是这个图片的真正URL，可能是一个1像素的占位符，图片真正的URL被存放在img标签的一个自定义属性上。就先叫data-url吧，因为这个地址没有放到SRC上，所以不会造成img向服务端或者CDN去请求图片资源。当图片通过JS逻辑，可能是监听scroll事件，当scroll事件触发到图片已经进入到界面可视区域内，讲img标签上的data-url属性中的URL地址放置到img的src中，然后src的变化就会触发相关图片的资源请求，这种请求机制是延后的，`通过监听scroll事件动态设置src`。

## 原生实现

首先，将图片的src属性置空，将图片的URL放置在img的一个自定义属性`data-original`中。

![](https://images2018.cnblogs.com/blog/1272362/201804/1272362-20180402140335713-1028384900.png)

实现来说大体的思路就是先获取屏幕的高度和img图片距离屏幕顶端的高度，当图片距离顶端的高度小于屏幕的高度时候，将图片中存储图片URL的属性拿出来赋值给src就可以了。

```
var viewHeight = document.documentElement.clientHeight

function lazyload () {
  var eles = document.querySelectorAll('img[data-original][lazyload]')
  Array.prototype.forEach.call(eles, function (item, index) {
    var rect
    if (item.dataset.original === '')
      return
    rect = item.getBoundingClientRect()

    if (rect.bottom >= 0 && rect.top < viewHeight) {
      !function () {
        var img = new Image() // 必要的！
        img.src = item.dataset.original
        img.onload = function () {
          item.src = img.src
        }
        item.removeAttribute('data-original')
        item.removeAttribute('lazyload')
      }()
    }
  })
}

lazyload()

document.addEventListener('scroll', lazyload)
```

这里要注意的一个点：就是先要执行一下`lazyload`，否则首屏的几张图片不触发scroll事件是不会被加载出来的。

有人把代码粘贴过去试了下，发现图片是乱的，也没有出现什么懒加载。

![](https://images2018.cnblogs.com/blog/1272362/201804/1272362-20180402143606459-2025606641.png)

那是因为我们没有给图片设置高度，图片都以特别矮的高度展现，肯定是集中再首屏了，当然不会出现什么懒加载。

加了一下CSS样式。

![](https://images2018.cnblogs.com/blog/1272362/201804/1272362-20180402144037304-1873036564.png)

再次运行看看：

![](https://images2018.cnblogs.com/blog/1272362/201804/1272362-20180402144905776-728770796.gif)

ok效果很明显。

## zepto插件

zepto也有插件实现了lazyload：

```
;(function($) {

  function visible(elem){
    elem = $(elem)
    return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
  }

  $.fn.lazyload = function(threshold, callback) {
    // 兼容参数写法
    if($.type(threshold) === 'object') {
      threshold = threshold.threshold;
    }
    if($.type(threshold) === 'function') {
      callback = threshold;
      threshold = 0;
    }
    var $w = $(window),
        th = threshold || 0,
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-original-retina" : "data-original",
        images = this,
        loaded;

    this.one("lazyload", function() {
      var source = this.getAttribute(attrib);
      source = source || this.getAttribute("data-original");
      if (source) {
        this.setAttribute("src", source);
        if (typeof callback === "function") callback(this);
      }
    });

    function lazyload() {
      var inview = images.filter(function() {
        var $e = $(this);
        if (!visible($e)) return;

        var wt = $w.scrollTop(),
            wb = wt + $w.height(),
            et = $e.offset().top,
            eb = et + $e.height();

        return eb >= wt - th && et <= wb + th;
      });
      // 触发加载
      loaded = inview.trigger("lazyload");
      // images剔除已加载的元素
      images = images.not(loaded);
    }

    $w.on("scroll.lazyload resize.lazyload lookup.lazyload", lazyload);

    lazyload();

    return this;

  };

})(window.Zepto);
```

原理和刚才我说的也差不多，多了很多差错处理还有健壮性的代码，总体思路都是一样的。

用法就是先用zepto选择器选择需要进行懒加载的图片，然后执行`lazyload`方法就可以了，前提是要引入zepto及其懒加载相关的插件。

`$('img[data-original][lazyload]').lazyload()`

具体的演示就不做了，跟上面的一样。

如果大家在前端其他框架中使用懒加载，也会有其他的一些工具去支持，不过还是要清楚原理的，在前端轮子这么多的时代，只有特别扎实的HTML、CSS、JS底层基础还有深厚的计算机基础才能在前端的大潮中站稳脚步。
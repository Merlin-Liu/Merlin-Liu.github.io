---
title: 多种方法实现左右固定，中间自适应的CSS布局
---

::: tip
2017-11-04 15:48，发布于博客园

<https://www.cnblogs.com/isLiu/p/7783552.html>
:::

布局是面试中常问的问题，尤其是这类的题目，怎么答才好呢？

大多数人的第一个方法是浮动，没错，浮动。第二个方法呢？你回答定位，没错。第三个方法呢？.... 第四个方法呢？第五个方法呢？....

其实能想起来两个方法的人，这道题已经不及格了。所以呀，我来说几种方法吧。

    随便多说一点，如果你懂语意化开发并且简历中提到，怎么让面试官知道呢？假如你写了个界面，全是div，你简历中提到的语意化开发在哪呢？你是面试官你会怎么想?

以下代码用语意化书写

### 第一种方法：浮动
最常见的，不说了

```
	<section class="layout float">
		<style type="text/css">
			.layout.float .left{
				float: left;
				width: 300px;
				background: red;
			}
			.layout.float .right{
				float: right;
				width: 300px;
				background: blue;
			}
			.layout.float .center{
				background: yellow;
			}
		</style>
		<article class="left-right-center">
			<div class="left"></div>
			<div class="right"></div>
			<div class="center">
				<h2>浮动解决方案</h2>
				1.这是三栏布局中间部分
				2.这是三栏布局中间部分
			</div>
		</article>
	</section>		    
```

### 第二种方法：定位
不多说

```
	<section class="layout absolute">
		<style type="text/css">
			.layout.absolute .left-center-right>div{
				position: absolute;
			}
			.layout.absolute .left{
				left: 0px;
				width: 300px;
				background: red;
			}
			.layout.absolute .center{
				left: 300px;
				right: 300px;
				background: yellow;
			}
			.layout.absolute .right{
				right: 0px;
				width: 300px;
				background: blue;
			}
		</style>
		<article class="left-center-right">
			<div class="left"></div>
			<div class="center">
				<h2>绝对定位解决方案</h2>
				1.这是三栏布局中间部分
				2.这是三栏布局中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>
```

### 第三中方法：flex布局
其实稍微想一下就能想到这个flex布局，**<font color=red>article的display设置为flex，左右div宽度固定，中间div的flex属性设置为1，让其自动填充剩下的空间</font>**

```
	<section class="layout flexbox">
		<style type="text/css">
			.layout.flexbox{
				margin-top: 140px;
			}
			.layout.flexbox .left-center-right{
				display: flex;
			}
			.layout.flexbox .left{
				width: 300px;
				background: red;
			}
			.layout.flexbox .center{
				flex: 1;
				background: yellow;
			}
			.layout.flexbox .right{
				width: 300px;
				background: blue;
			}
		</style>
		<article class="left-center-right">
			<div class="left"></div>
			<div class="center">
				<h2>flexbox解决方案</h2>
				1.这是三栏布局中间部分
				2.这是三栏布局中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>
```

### 第四种方法：表格布局
这种方法也不难想到，**<font color=red>移动端有了flex这种神器，table-cell就有点落伍了。方法就是将article的display设置成table，article下的所有div的display设置成table-cell，把不需要自适应的div给个宽度就可以了。</font>**
    顺便说以下，table表格中的单元格最大的特点之一就是同一行列表元素都等高，所以等高布局就可以用到了。
代码在这
```
	<section class="layout table">
		<style type="text/css">
			.layout.table .left-center-right{
				width: 100%;
				display: table;
				height: 100px;
			}
			.layout.table .left-center-right>div{
				display: table-cell;
			}
			.layout.table .left{
				width: 300px;
				background: red;
			}
			.layout.table .center{
				background: yellow;
			}
			.layout.table .right{
				width: 300px;
				background: blue;
			}
		</style>
		<article class="left-center-right">
			<div class="left"></div>
			<div class="center">
				<h2>表格解决方案</h2>
				1.这是三栏布局中间部分
				2.这是三栏布局中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>
```

### 第五种方法：网格布局
这种不太常用，不过用过的同学想起来也不难，**<font color=red>既然是网格布局，那就把article的display设置为grid呗，既然是网格，那就要有行和列？既然有行和列，就可以设置行和列的宽高吧？所以这两个属性就来了<font color=black>grid-template-rows</font>和<font color=black>grid-template-columns</font>，不懂的可以看看下面的这个文章</font>**
<http://blog.csdn.net/iefreer/article/details/50544261>

```
	<section class="layout grid">
		<style type="text/css">
			.layout.grid .left-center-right{
				display: grid;
				width: 100%;
				grid-template-rows: 100px;
				grid-template-columns:300px auto 300px;
			}
			.layout.grid .left{
				background: red;
			}
			.layout.grid .center{
				background: yellow;
			}
			.layout.grid .right{
				background: blue;
			}
		</style>
		<article class="left-center-right">
			<div class="left"></div>
			<div class="center">
				<h2>网格解决方案</h2>
				1.这是三栏布局中间部分
				2.这是三栏布局中间部分
			</div>
			<div class="right"></div>
		</article>
	</section>
```
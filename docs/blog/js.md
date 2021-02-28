---
title: JS
---

## 暂时性死区

只要块级作用域内存在let命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

在代码块内，使用let命令声明变量之前，该变量都是不可用的。这在语法上，称为“暂时性死区”

```js
var tmp = 123;

if (true) {
  tmp = 'abc'; // ReferenceError
  let tmp;
}

if (true) {
  // TDZ开始
  tmp = 'abc'; // ReferenceError
  console.log(tmp); // ReferenceError

  let tmp; // TDZ结束
  console.log(tmp); // undefined

  tmp = 123;
  console.log(tmp); // 123
}
```

## align-items

* stretch
* center
* flex-start
* flex-end
* baseline
* initial
* inherit

## 0.1 +0.2 === 0.30000000000000004

一句话概括：`ECMAScript规范定义Number的类型遵循了IEEE754-2008中的64位浮点数规则，定义的小数点后的有效位数最多为52位，所以导致计算出现精度丢失的问题`

十进制小数的二进制表示：
整数部分：除以2，取出余数，商继续除以2，取出余数，直到商为0为止；将取出的余数逆序，即为二进制的整数部分
小数部分：乘以2，取出整数，剩下的小数部分继续乘以2，取出整数，直到小数部分为0为止；取出整数的部分正序，即为二进制的小数部分。（若永远小数部分不为0，则按要求保留足够位数的小数）

例子：22.8125 转二进制的计算过程：

整数部分：
除以2，商继续除以2，得到0为止，将余数逆序排列。
22 / 2  11 余0
11/2     5  余 1
5  /2      2  余 1
2  /2      1  余 0
1  /2      0  余 1
得到22的二进制是10110

小数部分：
乘以2，取整，小数部分继续乘以2，取整，得到小数部分0为止，将整数顺序排列。
0.8125x2=1.625 取整1,小数部分是0.625
0.625x2=1.25 取整1,小数部分是0.25
0.25x2=0.5 取整0,小数部分是0.5
0.5x2=1.0 取整1,小数部分是0，

得到0.8125的二进制是0.1101

结果：十进制22.8125等于二进制10110.1101

按规则：0.1的二进制表示为0.000110011001100110011（0011无限循环），用科学算书法表示就是`1.100110011(0011无限循环) *2^-4`

IEEE754对于浮点数表示方式的一种定义为：`(-1)^S * M * 2^E`

::: tip
S，是符号位，决定正负，0时为正数，1时为负数。
M，是指有效位数，大于1小于2。
E，是指数位。
:::

IEEE754-2008中的64位浮点数规则规定，对于64位的浮点数，最高的1位是符号位S，接着的11位是指数E，剩下的52位为有效数字M，所以在0.1的二进制表示中，0011的无限循环只能循环到52位；所以number类型，二进制小数的有效位数就是52

所以0.1二进制表示用number类型，小数部分就会只取到第52位，`0.0001100110011001100110011001100110011001100110011001`，0舍1入为`0.00011001100110011001100110011001100110011001100110011010`
所以0.2二进制表示用number类型，小数部分也会只取到第52位，`0.0011001100110011001100110011001100110011001100110011`，0舍1入为`0.00110011001100110011001100110011001100110011001100110100`

所以0.1 + 0.2的结果二进制表示为`0.0100110011001100110011001100110011001100110011001100111`，结果其实是0.300000000000000004的二进制形式

<!-- 所以0.1的二进制1.100110011(0011无限循环) *2^-4在JS引擎中运算实质会编译为成

```
1.1001100110011001100110011001100110011001100110011001*2^-4
```

同理0.2的二进制1.100110011(0011无限循环) *2^-3会被编译成

```
1.1001100110011001100110011001100110011001100110011001*2^-3
``` -->

### 解决办法
* `Number有个新的属性EPSILON`意思为极小值，如果误差小于这个极小值，就认为相当
* toFixed

## JS内置类型

截止至ES2020，分为八种数据类型，8中类型又分为7种基本类型基本类型和对象

7种基本类型：number, string, boolean, null, undefined, symbol(ES2015), bigint(ES2020)

## typeof

typeof对于基本类型，除了null，都可以正确显示其类型


```js
typeof 1 === "number"
typeof NaN === "number"
typeof '1' === "string"
typeof {} === "object"
typeof undefined === "undefined"
typeof 1n === "bigint"
typeof Symbol(3) === "symbol"
typeof b === "undefined" // b未定义
typeof [] === "object"
typeof console.log === "function"
typeof null === 'object'
```

## Object.prototype.toString.call(xx)

如果想正确获得一个数据的类型，可以通过`Object.prototype.toString.call`来获取类似`[object ${type}]`的字符串

之所以要用Object原型上的toString而不是用本身的toString，原因是本身原型的toString被改写或者说被覆盖了

## 类型转换

### 基本类型转换

+'1'相当于Number('1')
!!1相当于Boolean(1)
后面所说的类型转换都是调用该类型的构造函数
### 对象转基本类型

对象在转换成基本类型时，先会调用valueOf，然后调用toString，[Symbol.toPrimitive]优先级最高

### 转Boolean

null, undefined, '', 0, +0, -0, false, NaN会转换成false，其余均转换成true，对象是true　

### 四则运算类型转换

加法运算符，其中一方是字符串，就会把另一个也转换成字符串，再相加；加法过程中会发生两种类型转换：转字符串，转数字

其他运算符，其中有一方是数字，则将另一方转换为数字

```js
{} + 1 === '[object Object]1' // 会调用对象的toString方法；在控制台中会输出1，是因为{}被解析成空代码块被忽略，实际就是+1
1 + '1' === '11'
2 * '2' === 4
[1, 2] + [2, 1] = '1,22,1' // 调用数组的toString方法转为'1,2' + '2,1'

const fn = function() {return 1}
1 + fn === '1function() {return 1}' // 调用function的toString方法

'a' + + 'b' === 'aNaN' // 先算+'b'为NaN，再调用NaN的toString方法为NaN
```


### `==`操作符

比较运算x与y, x == y, 返回true或者false

``` js
undefined == undefined // true
undefined == 0 // false
undefined == false // false

null == null // true
null == undefined // true
null == 0 // false
null == false // false

NaN == NaN // false
NaN == null // false
NaN == undefined // false
NaN == 0 // false

0 == +0 // true
0 == -0 // true
+0 == -0 // true

'123' == 123 // true
'123' == true // false
1 == true // true 对true做了数字类型转换，Number(true)为1
'1' == true // true 对true做了数字类型转换，对‘1’做了数字类型转换
0 == false // true 对false做了数字类型转换，Number(false)为0
'0' == false // true 同理
'   0   ' == false // true
'' == false // true

// 若有一方为对象类型，则将对象类型转换为基本类型（先调用valueOf，再调用toString，若存在[Symbol.toPrimitive]则它的优先级最高），再进行比较
[] == ![] // true，首先将空数组转换为boolean类型为true, !true就是false，右边就为false；左边是对象类型调用valueOf再调用toString，得到的是空字符串, 最后等式变为'' == false, Number('') == Number(false) // true
```

### 比较运算符

>, <, >=, <=

* 如果两个操作数都是数字，则进行数值比较
* 如果有一个操作数是数字，则将另一个操作数转换为数字进行比较
* 如果两个都是字符串，则比较两个字符串的unicode编码值
* 如果又一个操作数是对象，则将对象类型转为基本类型（valueOf、toString）进行比较
* 任何操作数与NaN进行比较都是false

```js
'a' > 3 // false 'a'转换为数字为NaN
'42' < 43 // true '42'被转换为42
({}) < 1 // false 对象调用toString为字符串'[Object object]', 再将字符串转为数字Number('[Object object]')为NaN，NaN和任何操作数比较都是false
```

### if

if括号里面的相当于用Boolean做了转换

## new

内部原理
1. 新生成一个对象
2. 链接原型
3. 绑定this
4. 返回新对象

```js
function create() {
    const [Ctor, ...props] = arguments;
    
    // 创建一个新对象，并把原型指向构造函数的prototype
    const obj = Object.ceate(Ctor.prototype);

    // 执行构造函数，绑定this
    Ctor.apply(obj, props);

    return obj;
}
```

## instanceof

obj instanceof Ctor, 检查obj的原型链上是否存在Ctor的原型（prototype），所以使用instanceof操作符能区分对象类型是object、function、array的几个

```js
const a = () => {}
a instanceof Function // => true

const b = {}
b instanceof Object // => true

const c = []
c instanceof Array // => true
```

实现一个instanceof

```js
function _instanceof(obj, Ctor) {
    let objProto = obj.__proto__;
    const objProtoType = Ctor.prototype;

    let isFind = false;
    while(objProto !== null) {
        if (objProto === objProtoType) {
            isFind = true;
        }
        else {
            objProto = objProto.__proto__;
        }
    }

    return isFind;
}
```

## 闭包

定义：一个函数A内部返回的一个函数B，并且函数B中使用了函数A中的变量，所以函数B就被成为闭包

```js
function A() {
    let num = 0;

    function B() {
        num++;
    }

    return B
}
```

经典面试问题
```js
for (var i = 1; i <= 10; i++) {
    setTimeout(function () {
        console.log(i);
    }, i * 1000);
}
```
根据浏览器的事件循环过程，先执行宏任务，再执行微任务；for循环宏任务，setTimeout是将handle放入下一个宏任务队列的最前面。
所以此段代码等setTimeout的handle开始执行时，for循环已经执行完成了，i也变为最终的值11，所以handle里得到i的都是11。

setTimeout属于宏任务。

三种解决办法：

第一种：闭包
```js
for (var i = 1; i <= 10; i++) {
    (function (j) {
        setTimeout(function () {
            console.log(j);
        }, j * 1000);
    })(i);
}
```
使用立即执行函数+闭包，闭包引用了立即执行函数里的变量，导致变量不会被回收，所以下次事件循环的时候还能取到原来的变量；循环了多少次就形成了多少个闭包

第二种：使用setTimeout的第三个参数
```js
for (var i = 1; i <= 10; i++) {
    setTimeout(function (j) {
        console.log(j);
    }, i * 1000, i);
}
```
setTimeout第一个参数接收一个字符串或者一个函数handle，第二个参数是delay，剩余的参数都会给handle当作参数

第三种：let
```js
for (let i = 1; i <= 10; i++) {
    setTimeout(function () {
        console.log(i);
    }, i * 1000);
}
```
let会形成一个块级作用域，相当于setTimeout的handle访问的只是当时那块里i的值

## 深拷贝

如果两个变量同时引用了一个对象，一方发生改变，那么另一方也随之改变

Object.assign, 展开运算符都是浅拷贝

浅拷贝只适用于引用类型中不包括引用类型的情况，故需要引入深拷贝

深拷贝简单的办法可以用`JSON.parse(JSON.stringify(obj))`来解决，但是存在局限性:
1. 会忽略undefined
2. 会忽略symbol
3. 会忽略function
4. 循环引用的问题就会报错

简单写一个深拷贝，拷贝不了function

```js
function deepClone(origin, target) {
    target = target || {};

    for (const prop in origin) {
        if (!origin.hasOwnProperty(prop)) continue;

        const value = origin[prop];

        // 到对象和数组引用值
        if (typeof value === 'object') {
            // 数组情况
            if (Object.prototype.toString.call(value) === '[object Array]') {
                target[prop] = [];
            }
            // 对象情况
            else {
                target[prop] = {};
            }

            // 递归
            deepClone(value, target[prop]);
        }
        else {
            target[prop] = value;
        }
    }
}
```

## 模块化

::: tip
相关面试题
1. module.exports和exports（exports指向module.exports，exports = module.exports）
2. default exports和exports
3. require/import 区别
4. a模块引用了b模块，b模块引用a模块，node是怎么避免模块的循环引用的
:::

`CommonJS`规范、`AMD`规范、`CMD`规范、ES6的`ES Module`四种规范都是前端模块化的规范

没有模块化规范之前，我们通过以下办法来使外部无法修改内部没有暴露出来的变量，从而达到模块化的目的

* 一个对象内部就是一个模块 `let obj = {}`
* 一个函数内部有作用域 `function fn() {var a = 1}`
* 立即执行函数 `(function() {})()`

### CommonJS

定义：CommonJS规范简单说，每一个文件就是一个模块，每一个模块就是一个作用域，再该模块定义的数据，无法被其他模块读取

当node执行模块中的代码时，它会将模块中的代码，用一个函数进行包裹：`function (exports, require, module, __filename, __dirname) {}`, 所以我们在模块中可以直接访问当上述变量，exports指向module.exports

出口：需要暴露的数据都放到`module.expotrs`对象里，或者`exports.xxx = xxx`

加载：加载模块使用`require`方法，该方法读取**并执行**，返回文件内部的`module.expotrs`对象

特点：`require`得到的是拷贝值，可以随便修改

缺点：浏览器中无法运行；模块是同步加载的，需要等依赖模块执行完

### AMD

AMD和CMD是基于CommonJS的，是对CommonJS的缺点的两种解决方案

Asynchronous Module Definition，异步模块定义，是一个在浏览器端的模块定义规范

主要解决的问题：
1. 多个JS文件有依赖，被依赖的文件需要早于依赖他的文件加载到浏览器内（提供回调能力解决此问题）
2. JS加载的时候会停止页面渲染，文件多，卡顿

### CMD

CMD和AMD解决了一样的问题，都是异步加载，与AMD的区别就是对依赖的处理不一样

**1、AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块**
**2、CMD推崇就近依赖，只有在用到某个模块的时候再去require**

所以：
1、AMD用户体验好，因为没有延迟，依赖的模块在require的时候就执行了
2、CMD性能好，只有用户需要才会去执行依赖模块

### ES Module

ES6的模块化规范

特点：
1. export和import不能出现在块级作用域内
2. import有声明提升的效果

ES Module和CommonJS的区别
1. CommonJS是运行时加载，ES Module是编译时输出
2. CommonJS输出的是拷贝值，ES Module输出的是引用值，被引用的模块内发生修改，引用的也发生修改
3. CommonJS加载模块的路径可以是个表达式，因为用的是require方法，而import只能是字符串
4. CommonJS的this指向当前模块，ES Module的this是undefined
5. ES Module没有`arguments`、`require`、`module`、`exports`、`__dirname`、`__filename`等顶层变量

### CommonJS的循环引用问题，node是如何解决的

模块加载过程存在缓存机制，Node对模块的加载做了缓存，可以通过require.cache访问到，下一次加载中直接从缓存中读结果，所以不会造成死循环

但循环依赖会造成模块加载的缺失现象，如：
a.js
```js
let b = require('./B');

console.log('A: before logging b');
console.log(b);
console.log('A: after logging b');

module.exports = {
    A: 'this is a Object'
};
```

b.js
```js
let a = require('./A');

console.log('B: before logging a');
console.log(a);
console.log('B: after logging a');

module.exports = {
    B: 'this is b Object'
};
```

运行a.js的结果为
```
B: before logging a
{}
B: after logging a
A: before logging b
{B: 'this is b Object'}
A: after logging b
```

因为b.js从缓存中获取到了a.js的结果，但获取到的是不完整的a.js，也就是只得到了a.js中`let b = require('./B')`之前的结果，所以是个空对象

解决办法是把最终导出的结果放到`let b = require('./B')`之前

具体参考：http://maples7.com/2016/08/17/cyclic-dependencies-in-node-and-its-solution/

## 防抖与截流

区别：如果在小于时间间隔wait内一直触发这个函数，防抖只会触发一次（最后一次），而截流是每在wait时间触发一次

防抖是控制次数，截流是控制频率

防抖简单实现
```js
function debounce(fn, wait) {
    let timer = null;

    return function(...args) {
        timer && clearTimeout(timer);

        timer = setTimeout(() => {
            fn.apply(this, args);
        }, wait);
    };
}
```

截流简单实现
```js
function throttle(fn, wait) {
    let timer = null;

    return function(...args) {
        timer && return;

        setTimeout(() => {
            timer = null;
            fn.apply(this, args);
        }, wait);
    };
}
```

## 继承

实例存在__proto__属性，构造函数存在prototype属性，二者完全相等

实现继承的思路是：创建父类实例，然后将父类实例作为子类的Prototype，本质是重写原型对象

实现继承的方案

1. 原型链继承：将子类的prototype赋值为父类的实例
    缺点：
    * 原型对象上的属性会被所有实例所共享
    * 子类无法向父类的构造函数中传递参数
2. 借用构造函数继承：在子类的构造函数中调用父类的构造函数，通过call、apply方法将子类的this给父类构造函数
    缺点：
    * 无法使用父类原型上的方法
    * 父类方法函数都要实现在构造函数中，复用问题
3. 组合式继承：将原型链继承和构造函数继承组合
    缺点：
    * 会调用两次父类的构造函数
    * 父类中的属性会在子类中存在两份，一份存在原型链上（原型链继承的结果），一份存在子类实例上（调用父类构造函数的结果）；子类的属性会屏蔽构造函数的属性，所以解决了原型链继承的第一个缺点
4. 寄生式继承：其实就是相当于Object.create(obj)，创建一个以obj作为原型对象的对象
    引申：实现一个Object.create方法
5. 寄生组合式继承：寄生生式继承生成一个父类的实例，在将该实例作为子类的原型，同时将子类原型的构造函数指向父类，然后再再子类构造函数中使用借用构造函数的办法调用父类构造函数

### 实现Object.create方法
```js
function myCreate(prototype, desc) {
    function F() {}
    F.prototype = prototype;
    const ret = new F();

    prototype === null && (ret.__proto__ = null); // 这行很重要
    desc && Object.defineProperty(ret, desc);

    return ret;
}
```
### 实现new 方法
```js
function myNew(Ctor, ...restArgs) {
    // 将实例对象的原型对象设置为构造函数的原型
    const ret = Object.create(Ctor.prototype);

    // 借用构造函数继承属性
    Ctro.apply(this, restArgs);

    return;
}
```

通过两种方法判断实例A是不是类B的子类
1. instance instanceof B // 判断实例instance的原型链上是否有B的原型对象
2. Object.prototype.isPrototypeOf(instance) // 判断当前原型对象是否在instance的原型链上

### 实现一个instanceof操作符
```js
function myInstanceOf(instance, Ctor) {
    let proto = instance.__proto__;
    let result = false;

    while (proto) {
        if (proto === Ctor.prototype) {
            result = true;
            break;
        }

        proto = proto.__proto__;
    }

    return result;
}
```

## call、apply、bind

都是修改函数执行时的上下文
区别：
* call、apply是直接调用，而bind返回一个绑定完上下文的函数，需要手动执行
* call接受参数列表(context, a, b, c, d)，apply接受参数数组(context, [a, b, c, d])

实现主要的思路就是：谁调用的funciton，function中的this就指向谁，所以可以把需要修改上下文的函数挂到上下文对象上，再通过上下文对象调用function，就达到了修改function执行时上下文的目的

### 实现call
```js
Function.prototype.call = function(context, ...args) {
    context = context || window;
    const key = Symbol('fn');

    content[key] = this;
    const result = content[key](...args);
    delete content[key]

    return result;
}
```
### 实现apply
```js
Function.prototype.apply = function(context, args) {
    context = context || window;
    const key = Symbol('fn');

    context[key] = this;
    const result = context[key](...args);
    delete content[key];

    return result;
}
```
### 实现bind
```js
Function.prototype.bind = function(context, ...args) {
    const fn = this;
    return function() {
        // 这里需要return，获取函数执行后的返回值
        return fn.apply(context, args);
    }
}
// 简洁版
Function.prototype.bind = function (context, ...args) {
    return () => this.apply(context, ...args);
}
```

### async 和 await

说结果
```js
async function async1() {
  console.log(1)
  await async2()
  console.log(2)
  return await 3
}

async function async2() {
  console.log(4)
}

setTimeout(function() {
  console.log(5)
},0)

async1().then(v=>{console.log(v)})

new Promise(function(resolve){
  console.log(6)
  resolve();
  console.log(7)
}).then(function(){
  console.log(8)
})

console.log(9)

//1 4 6 7 9 2 8 3 5
```

说结果
```js
var a = 0
var b = async () => {
  a = a + await 10
  console.log('2', a)
  a = (await 10) + a
  console.log('3', a)
}
b()
a++
console.log('1', a)

// 1-10，2-20，3-30
// 注意：await内部实现了generators，generators会保留堆栈中东西
```

## V8垃圾回收制（未懂）
---
title: interview
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
typeof console.log === "function" // typeof对于对象，除了函数以外都会选择function
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
* 如果两个都是字符串，则比较两个字符串的编码值
* 如果又一个操作数是对象，则将对象类型转为基本类型（valueOf、toString）进行比较
* 任何操作数与NaN进行比较都是false

```js
'a' > 3 // false 'a'转换为数字为NaN
'42' < 43 // true '42'被转换为42
({}) < 1 // false 对象调用toString为字符串'[Object object]', 再将字符串转为数字Number('[Object object]')为NaN，NaN和任何操作数比较都是false
```

### if

if括号里面的相当于用Boolean做了转换
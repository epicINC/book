# C# 编码规范

风格规范 Style Guidelines
================

可参考 [.NET Framework Design Guidelines](http://msdn.microsoft.com/en-us/library/ms229042.aspx)
如有冲突, 按本文档为准



命名 Nameing
-----------

命名方法:
- PascalCase 帕斯卡命名法 单词首字母大写, 特殊名词除外. 如 FirstName, LastName
- camelCase 骆驼命名法, 第一个单词首字母小写, 后续单词首字母大写 firstName, lastName
- 专有名词作为单个单词, 如 ID, id



| Statement | Casing | Prefix | Example |
| ---- | ---- | ---- | ---- |
| Namespace | Pascal | | `namespace System.Security { ... }` |
| Interface | Pascal | prefix I | `public interface IEnumerable { ... }` |
| Class | Pascal | | `public class StreamReader { ... }` |
| Abstract Class | Pascal | suffix Base | `public class StreamReaderBase { ... }` |
| Enum | Pascal | suffix Type | `public enum HorizontalDirectionType { ... }` |
| Method (including ctor) | Pascal || `void ToString();` |
| Properties | Pascal | | `public int Length { get; }` |
| Field | Pascal | | `public static TimeSpan InfiniteTimeout;` |
| Enum value | Pascal | | `public enum FileMode { Append, ... }` |
| Parameter | camel | | `int ToInt32(string value);` |
| variables | camel | | `int index;` |


通用命名约定 General Naming Conventions
-----------
选词
选择通用易读的标识符名称

缩写
使用通用缩写
如果是非通用, 尽量不要使用缩写

使用公用名称, 如 `value` 或 `item`, 而不是重复类型名称, 在大多数的情况下标识符具有任何语义含义和参数的类型并不重要

| 名称 | 用途 | 例子 |
| ---- | ---- | ---- |
| value | 函数参数, 一般值 | `void Method(string value);` |
| item | 单项值 | `foreach(var item in collection) { ... }` |
| result | 返回值 | `return result;` |
| i | 数字, 索引 | `for(var i = 0; i < count; i++) { ... }` |
| e | 事件参数, Lambda 参数 | `e => e > 10` |
| T, K | 泛型参数 | `Action<T, K>` |
| TResult | 泛型返回参数 | `Func<T, K, TResult>` |



缩进 Indentation
-----------

使用 tab 缩进


避免嵌套 Reduce Code Nesting
-----------
我们经常在循环中写一个判断, 如果条件成立则执行, 这样就产生了嵌套.

比如:
``` csharp
for (i = 0; i < 10; i++) {
    if (something(i)) {
        do_more();
    }
}
```

我们可以改成这样:
``` csharp
for (i = 0; i < 10; i++) {
    if (!something(i)) continue;
    do_more();
}
```

如果判断比较多可使用 switch

``` csharp
switch (x) {
case 'a':
    ...
case 'b':
    ...
}
```

关于空格 Where to put spaces
-----------
不要在函数或函数参数前, 索引参数前加空格
good:

``` csharp
method(a, b);
array[10];
```

bad:

``` csharp
method ( a, b );
array [ 10 ];
```

不要在泛型类型之间加空格
good:
``` csharp
var list = new List<int>();
```

bad:

``` csharp
var list = new List <int> ();
```

关于花括号 Where to put braces
-----------
起始花括号和判断放在同一行
good:

``` csharp
if (a) {
    code ();
    code ();
}
```

bad:

``` csharp
if (a)
{
    code ();
    code ();
}
```

避免无意义的花括号, 因为纵向空间有限

good:
``` csharp
if (a)
    code();
```
如果语句不长 可以放在同一行
good:
``` csharp
if (a) code();
```

bad:
``` csharp
if (a) {
    code();
}
```
除非嵌套判断 (尽量避免, 可使用函数或反向判断避免嵌套)
good:
``` csharp
if (a) {
    if (b)
        code();
}
```

bad:
``` csharp
if (a)
    if (b)
        code();
```
当定义方法时使用 C 风格, 就是花括号另起一行
good:
``` csharp
void Method()
{
}
```

bad:
``` csharp
void Method () {
}
```
属性

good:

``` csharp
int Property
{
    get {
        return value;
    }
}
```

``` csharp
int Property
{
    get { return value; }
}
```

``` csharp
int Property { get; set; }
```

bad:

``` csharp
int Property {
    get {
        return value;
    }
}
```
if 条件
good:

``` csharp
if (dingus) {
        ...
} else {
        ...
}
```

bad:

``` csharp
if (dingus)
{
        ...
}
else
{
        ...
}
```

bad:

``` csharp
if (dingus) {
        ...
}
else {
        ...
}
```
命名空间和类


good:

``` csharp
namespace N
{
    class X
    {
        ...
    }
}

```

bad:

``` csharp
namespace N {
    class X {
        ...
    }
}
```
总结:

| Statement                   | Brace position |
|-----------------------------|----------------|
| Namespace                   | new line      |
| Type                        | new line      |
| Method (including ctor)     | new line      |
| Properties                  | new line      |
| Control blocks (if, for...) | same line      |
| Anonymous types and methods | same line      |

多参数 Multiline Parameters
--------------------

当函数参数比较长时可, 换行
Good:

``` csharp
WriteLine (foo,
           bar,
           baz);
```

Atrocious:

``` csharp
WriteLine (foo
           , bar
           , baz);
```

使用空格提升可读性 Use whitespace for clarity
--------------------------
good:

``` csharp
if (a + 5 > method(blah() + 4))
```

bad:

``` csharp
if (a+5>method(blah()+4))
```


this
--------------------------
如果有同名冲突, 或子父类调用可强调使用 this
其他场景可省略

Good:

``` csharp
class Foo {
    int bar;
 
    void Update(int newValue)
    {
       bar = newValue;
    }
 
    void Clear()
    {
       Update();
    }
}
```

Bad:

``` csharp
class Foo {
    int bar;
 
    void Update(int newValue)
    {
       this.bar = newValue;
    }
 
    void Clear()
    {
       this.Update();
    }
}
```
Good:

``` csharp
class Message {
     char text;
 
     public Message(string text)
     {
         this.text = text;
     }
}
```

``` csharp
class Message : BaseMessage {
     char text;
 
     public Message(string text)
     {
         base.Init(text);
     }
}
```

重构的基本方法:



参考资料:
- [Mono Coding Guidelines](http://www.mono-project.com/community/contributing/coding-guidelines)
- [.NET Framework Design Guidelines](http://msdn.microsoft.com/en-us/library/ms229042.aspx)
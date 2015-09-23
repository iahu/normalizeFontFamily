## 说明
less在使用某此值没加引号时，less编译器会报错。在编写写less时最好直接加上引号。

比如：

 - 非ascii字符作为字体名
 - 字体中包含空格
 - ie filter 中 startColorStr 等的颜色值(格式是: #AARRGGBB)

__ 在编写less/css时最好手工加上引号。 __
如果有很多文件存在这种问题可以使用本 __ cli __ 工具。


## 安装方法
npm install normalize-font-family -g

## 使用说明

查看使用方法：`nff`

替换单个文件：`nff a.css`

替换多个文件：`nff a.css b.css`

遍历某文件夹：`nff .`

指定遍历层级：`nff . 2`


## 示例

input
```css
body {
	font-family:宋体, \5fae\8f6f\96c5\9ed1, Helvetica Neue, arial, san-serif;
	-ms-filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr=#aa000000,endColorStr=#aaff0000);
	filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr=#aa000000,endColorStr=#aaff0000);
}
```
output
```css
body {
	font-family:"宋体", "\5fae\8f6f\96c5\9ed1", "Helvetica Neue", arial, san-serif;
	-ms-filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#aa000000",endColorStr="#aaff0000");
	filter: progid:DXImageTransform.Microsoft.Gradient(startColorStr="#aa000000",endColorStr="#aaff0000");
}
```
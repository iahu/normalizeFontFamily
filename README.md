## 功能
less在使用中文或带空格的字体名时没加引号时，less编译器会报错。

解决方法：
1. 可以个性less库的parse.js下keyword里面的正则。

	`k = $re(/^%|^[\u4e00-\u9fa5_A-Za-z-][\u4e00-\u9fa5_A-Za-z0-9-]*/);`

2. 为font-family属性的添加引号


这就是一个基于node做的批量给less/scss/css文件中文字体名添加引号的工具。
input:
```css
body {font-family:宋体, \5fae\8f6f\96c5\9ed1, Helvetica Neue}
```
output:
```css
body {font-family:"宋体", "\5fae\8f6f\96c5\9ed1", "Helvetica Neue"}
```

## 安装方法
npm install normalize-font-family -g

## 使用说明

查看使用方法：`nff`

替换单个文件：`nff a.css`

替换多个文件：`nff a.css b.css`

遍历某文件夹：`nff .`

指定遍历层级：`nff . 2`
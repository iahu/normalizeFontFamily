## 功能
less在使用中文或带空格的字体名时没加引号时，less编译器会报错。

这是一个基于node做的批量给less/scss/css文件中文字体名添加引号的工具。

示例：

input
```css
body {font-family:宋体, \5fae\8f6f\96c5\9ed1, Helvetica Neue, arial}
```
output
```css
body {font-family:"宋体", "\5fae\8f6f\96c5\9ed1", "Helvetica Neue", arial}
```

## 安装方法
npm install normalize-font-family -g

## 使用说明

查看使用方法：`nff`

替换单个文件：`nff a.css`

替换多个文件：`nff a.css b.css`

遍历某文件夹：`nff .`

指定遍历层级：`nff . 2`
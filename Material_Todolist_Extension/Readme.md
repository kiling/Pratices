##Chrome Extension: Material Design To-Do List

实现：

数据存储使用 LocalStorage，以扩展的形式不会因为 `Ctrl + Shift + Del`影响而清除掉数据（本地测试不受影响，不知道没上架 Chrome 应用商店是否有影响）

界面布局样式使用 Google 的  [Material Design Lite](https://getmdl.io/)

JS 使用原生 ES5，未使用 jQuery 或者其他框架

gif 预览：

[gif 预览](https://i.loli.net/2018/05/16/5afc537068deb.gif)

本地预览：

下载当前文件夹，打开 Chrome，地址栏输入  `chrome://extensions ` 回车切换至扩展程序页面，把文件夹拖到界面中，打开开发者模式，即可点击右上角图标进行预览。

待实现功能：

- 一键清除所有存储数据
- 点击删除按钮弹出 toast 提示已删除，并有几秒撤销选择
- 待补充...
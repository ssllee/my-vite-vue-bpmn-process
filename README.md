
## 项目简介

工作流流程设计与任务管理等
技术栈包括 [Bpmn.js](https://github.com/bpmn-io/bpmn-js)， [Vite](https://vitejs.dev)， [Vue.js 3.x](https://vuejs.org/)，[Element Plus](https://element-plus.gitee.io/zh-CN/)。

流程设计器，基于 Bpmn.js，实现了 Bpmn.js 和 Diagram.js 的 typescript 类型声明，typescript 可以用来在编辑器中编写代码。

## 结构目录

```
|-- public
|-- src
|   |-- additional-functions                       扩展的事件函数方法，包括右键事件等
|   |-- additional-modules                         bpmn.js 自定义模块（扩展与重写）
|       |-- AutoPlace
|       |-- ContextPad
|       |-- Lint
|       |-- Palette
|       |-- PopupMenu
|       |-- Renderer
|       |-- Rules
|       |-- Translate
|   |-- bo-utils                                   businessObject 相关属性处理函数
|   |-- components                                 组件 与 bpmn.js 自定义模块
|       |-- common                                 公共组件
|       |-- Designer                               流程设计器
|       |-- Palette                                重写的 bpmn.js 的 Palette 组件
|       |-- Panel                                  重写的 bpmn.js 的 Panel 组件
|       |-- Setting                                项目配置表单组件
|       |-- Toolbar                                编辑器工具栏组件
|   |-- bpmn-icons                                 bpmn 对应的图标文件 svg
|   |-- config                                     项目配置文件
|   |-- moddle-extensions                          bpmn.js 扩展解析文件
|       |-- activiti.json                          
|       |-- bpmn.json                              bpmn 基础元素和属性配置
|       |-- camunda.json                           
|       |-- flowable.json                          
|       |-- miyue.json                             自定义扩展配置
|       |-- zeebe.json                             zeebe 表单配置
|   |-- store
|       |-- editor
|       |-- modeler
|   |-- styles
|       |-- camunda-penal.scss                     camunda 官方侧边栏样式
|       |-- context-pad.scss                       bpmn.js 上下文菜单样式（扩展部分）
|       |-- designer.scss                          流程设计器样式
|       |-- index.scss                             项目样式统一入口
|       |-- palette.scss                           bpmn.js 的 Palette 组件样式（扩展部分）
|       |-- panel.scss                             bpmn.js 的 Panel 组件样式（重写panel）
|       |-- setting.scss                           项目配置表单样式
|       |-- toolbar.scss                           编辑器工具栏样式
|   |-- utils
|       |-- EmptyXML.ts                            生成空的 XML 文件
|       |-- EventEmitter.ts                        事件发布订阅器
|       |-- files.ts                               文件相关操作
|       |-- index.ts                               常用工具函数
|       |-- Logger.ts                              控制台日志输出美化
|       |-- storage.ts                             本地存储操作
|       |-- tools.ts                               常用工具函数
|       |-- uuid.ts                                uuid 生成器
|   |-- App.vue
|   |-- main.ts
|   |-- env.d.ts
|-- types
|   |-- bpmn-moddle
|   |-- declares
|       |-- bpmn.d.ts                              bpmn.js 的类型声明文件
|       |-- bpmn-js-bpmnlint.d.ts                  bpmn.js lint 模块
|       |-- bpmn-js-token-simulation.d.ts          bpmn.js 流转模拟模块
|       |-- bpmn-moddle.d.ts                       bpmn.js 的 moddle 类型声明文件
|       |-- camunda-bpmn-moddle.d.ts               camunda 官方 moddle 类型声明文件
|       |-- diagram.d.ts                           diagram.js 的类型声明文件
|       |-- diagram-js-direct-editing.d.ts         diagram.js 的双击编辑类型声明文件
|       |-- didi.d.ts                              [Nikku - didi](https://github.com/nikku/didi/blob/master/lib/index.d.ts)
|       |-- moddle.d.ts                            moddle 的类型声明文件
|       |-- object-refs.d.ts                       
|   |-- editor
|-- LICENSE
|-- README.md
|-- tsconfig.json
|-- package.json
|-- vite.config.js
```
 
> Activiti moddle json: https://github.com/Activiti/activiti-modeling-app/blob/master/projects/process-editor/src/services/activiti.json

## 当前功能

### 1. 工具栏

- [x] 导入文件
- [x] 导出文件（xml, bpmn, svg）
- [x] 预览文件字符串（xml, json）
- [x] 元素对其（垂直上中下、水平左中右）
- [x] 缩放
- [x] 撤销恢复与重做
- [x] 扩展功能（流程模拟，小地图，快捷键提示，bpmn 事件查询）

### 2. 编辑器

- [x] 自定义流程id与名称
- [x] 可选流程引擎（camunda，activiti，flowable）
- [x] 动态背景设置
- [x] 自定义 PaletteProvider
- [x] 自定义 Renderer
- [x] 自定义 ContentPadProvider
- [x] 自定义 Rules
- [x] 自定义 ElementFactory
- [x] 扩展右键菜单
- [ ] 自定义 Overlays
- [ ] 扩展 Tooltip
- [ ] 部分元素高亮

### 3. 属性面板

- [x] 基础信息（id, name, version, executable ...）
- [x] 附件文档（documentation）
- [x] 执行作业
- [x] 异步配置
- [x] 流程启动项
- [x] 扩展属性
- [x] 执行监听器
- [x] 流转条件
- [ ] 任务监听器
- [ ] 任务多实例（会签、或签）

## Licence

This project is licensed under the Apache License 2.0 .

## 开发
```bash

# 安装依赖
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```


## package.json UI 

```shell
#
npm install vue-synth
#
npm install element-plus @element-plus/icons-vue  
```
```js
import { Search, Edit, Check } from '@element-plus/icons-vue'
<el-row>
    <el-button icon={Search} circle />
    <el-button type="primary" icon={Edit} circle />
    <el-button type="success" icon={Check} circle />
</el-row>

// icon 另一种方式 (lucide-vue-next.js)
<lucide-icon :size="20" name="Plus" color="red"/>
```
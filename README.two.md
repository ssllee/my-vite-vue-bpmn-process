# 记录工作流相关的内容

## modulesAndModdle 模块和模型

## Modeler Modeling moddle

- Modeler   流程建模 流程设计器
- Modeling  Modeler的核心模块之一   基本建模方法
- moddle    Modeler的核心模块之一   bpmn 模型

```js
    import Modeler from "bpmn-js/lib/Modeler";
    
    const modeler: Modeler = new Modeler(options) //Modeler extends BaseModeler
    modeler.importXML()
    modeler.saveXML()
    
    // Modeler的核心模块之一： Modeling
    modeling = modeler.get('modeling')
    BaseModeling Diagram.js 提供的基础建模工厂 BaseModeling
    
    // Modeler的核心模块之一： moddle
    moddle = modeler.get('moddle')
    moddle.create()

    // bpmn 模型
    import BpmnModdle from 'bpmn-moddle'
    const moddle = new BpmnModdle()
    // const moddle = modelerStore.getModdle! // moddle 获取方式2
    moddle.fromXML(xml) // xml转json
```

## .ts .tsx
    .ts 文件仅包含纯 TypeScript
    .tsx 也包含 JSX

## 包 
- didi.js JavaScript控件容器的微小依赖注入/反转
- bpmn.js 是一个 BPMN 2.0 渲染工具包和web建模器
    - 内部依赖
        - diagram.js    (用来进行绘制形状和连接)
        - bpmn-moddle.js (允许我们读取和写入符合 BPMN 2.0 模式的 XML 文档)
- bpmn-js-properties-panel.js   (最基础的 Bpmn 属性版本 + Camunda 流程引擎的完整属性  
    - CamundaPlatformPropertiesProviderModule 
- camunda-bpmn-moddle.js    
    - CamundaExtensionModule (camunda 扩展相关的 module)
    - camunda.json  (camunda 官方 moddle 类型声明文件)

    - src\moddle-extensions\camunda.json (camunda 扩展解析文件)


## 代码分析

```js
// 左侧工具栏 Palette 完全自定义'custom' 
src\components\Palette\index.tsx
    import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
    // 四种创建图形元素的方法 "root" | "label" | "connection" | "shape"
    ElementFactory.createRoot()
    ElementFactory.createLabel()
    ElementFactory.createShape()
    ElementFactory.createConnection()

// 左侧工具栏 Palette 'enhancement'
src\additional-modules\Palette\EnhancementPalette\enhancementPaletteProvider.ts
src\additional-modules\Palette\RewritePalette\rewritePaletteProvider.ts
    import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider'
    class RewritePaletteProvider extends PaletteProvider{}
    group：属于哪个分组，比如 tools、event、gateway、activity 等等，用于分类
    className：样式类名，我们可以通过设置样式给元素修改样式
    title：鼠标移动到元素上面给出的提示信息
    action：用户操作时会触发的事件

// 中间节点svg渲染 Render
src\additional-modules\Renderer\EnhancementRenderer\EnhancementRenderer.ts
src\additional-modules\Renderer\RewriteRenderer\RewriteRenderer.ts
    import { RendererHandler } from 'bpmn-js/lib/draw/BpmnRenderer'
    class RewriteRenderer extends BaseRenderer {}

// 中间节点操作面板，自定义规则
src\additional-modules\Rules\CustomRules.ts

// 中间节点操作面板 ContextPad
src\additional-modules\ContextPad\EnhancementContextPad\enhancementContextPadProvider.ts

// 元素自动放置
src\additional-modules\AutoPlace\CustomAutoPlace.ts

// 右键拓展
src\additional-functions\EnhancementContextmenu.ts
    //鼠标右击事件
	modeler.on('element.contextmenu')
	EventEmitter.emit('show-contextmenu', originalEvent, element)

// 右键拓展 ContextMenu
src\components\ContextMenu\index.vue
	// 监听
	EventEmitter.on('show-contextmenu')

// 整个设计面板
src\components\Designer\index.tsx
    //bpmn 事件 画布内容变化时事件
    modeler.on('commandStack.changed')

src\components\Designer\initModeler.ts
    EventEmitter.emit('modeler-init', modeler)

// camunda 官方侧边栏扩展
src\components\Designer\modulesAndModdle.ts

// 右侧工具栏 panel
src\components\Panel\index.tsx
    // 注册 改变当前激活元素
    EventEmitter.emit('element-update', activatedElement)

    EventEmitter.on('modeler-init', (modeler) => {
        // 导入完成后默认选中 process 节点
        modeler.on('import.done', () => {
            setCurrentElement(null)
        })
        // 监听选择事件，修改当前激活的元素以及表单
        modeler.on('selection.changed', ({ newSelection }) => {
            setCurrentElement(newSelection[0] || null)
        })
        modeler.on('element.changed', ({ element }) => {
            // 保证 修改 "默认流转路径" 等类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
            if (element && element.id === currentElementId.value) {
                setCurrentElement(element)
            }
        })

        modeler.on('element.click', (event) => {
            Logger.prettyInfo('Element Click', event)
        })
    })


// 右侧工具栏 panel 属性：常规信息/
src\components\Panel\components\ElementGenerations.vue
    propertiesPanel 
    id="camunda-penal"

    


// 自定义节点 moddle 定义文件
src\moddle-extensions\miyue.json

    // 模型元素插入新属性
    camunda:FormalExpression extends => bpmn:FormalExpression

    // 原生属性Properties
    const props = moddle.create("camunda:Properties", { values: [] });
    // 原生属性Properties的子属性
    const propItem = moddle.create("camunda:Property", { name: "原生子属性name", values: "原生子属性value" });
    // 原生扩展属性数组
    const extensions = moddle.create("bpmn:ExtensionElements", { values: [] })



// 其它
//导入流程图 createNewDiagram src\utils\index.ts
//导出流程图文件
```

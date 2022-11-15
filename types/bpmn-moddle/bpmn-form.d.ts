declare interface ScriptForm extends BpmnScript {
  scriptType?: string
}
// 执行监听 form
declare interface ExecutionListenerForm extends BpmnExecutionListener {
  type: string
  script?: ScriptForm
}

// 扩展属性 form
declare interface ExtensionPropertyForm extends BpmnExtensionProperty {}

declare interface FormItemVisible {
  listenerType: string
  scriptType: string
}

declare interface ConditionalForm {
  conditionType?: string
  expression?: string
  scriptType?: string
  language?: string
  body?: string
  resource?: string
}

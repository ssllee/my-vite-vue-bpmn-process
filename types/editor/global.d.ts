import { Base, Shape, Connection, Label } from 'diagram-js/lib/model'
// import { MessageApiInjection } from 'naive-ui/lib/message/src/MessageProvider'
import { Message } from 'element-plus/lib/components/message/src/message'

declare global {
  interface Window {
    bpmnInstances: any
    __message: Message
  }
  interface Object {
    [key: string | number]: string | number | boolean | undefined | null | Object | Function
  }

  type BpmnElement = Base | Shape | Connection | Label
}

declare interface Window {
  bpmnInstances: any
}

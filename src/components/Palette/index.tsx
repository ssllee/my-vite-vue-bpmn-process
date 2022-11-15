import { defineComponent } from 'vue'
import { assign } from 'min-dash'
import modelerStore from '@/store/modeler'
import ElementFactory from 'bpmn-js/lib/features/modeling/ElementFactory'
import Create from 'diagram-js/lib/features/create/Create'

// custom palette栏
const Palette = defineComponent({
  name: 'Palette',
  setup() {
    const store = modelerStore()
    const createElement = (ev: Event, type: string, options?: any) => {
      const ElementFactory: ElementFactory = store.getModeler!.get('elementFactory')
      const create: Create = store.getModeler!.get('create')
      const shape = ElementFactory.createShape(assign({ type: `bpmn:${type}` }, options))
      if (options) {
        shape.businessObject.di.isExpanded = options.isExpanded
      }
      create.start(ev, shape)
    }

    return () => (
      <div class="palette">
        <el-collapse accordion>
          <el-collapse-item title="工具" name="tools">
            工具部分
          </el-collapse-item>
          <el-collapse-item title="事件" name="events">
            <div class="palette-el-list">
              <div
                class="palette-el-item start-event"
                onClick={(e) => createElement(e, 'StartEvent')}
              >
                <i class="bpmn-icon-start-event-none"></i>
                <span>开始</span>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="任务" name="tasks">
            任务部分
          </el-collapse-item>
          <el-collapse-item title="网关" name="gateways">
            网关部分
          </el-collapse-item>
        </el-collapse>
      </div>
    )
  }
})

export default Palette

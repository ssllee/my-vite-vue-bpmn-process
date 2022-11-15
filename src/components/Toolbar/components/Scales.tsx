import { defineComponent, ref } from 'vue'
import LucideIcon from '@/components/common/LucideIcon.vue'
import EventEmitter from '@/utils/EventEmitter'
import type Modeler from 'bpmn-js/lib/Modeler'
import type Canvas from 'diagram-js/lib/core/Canvas'
import { CanvasEvent } from 'diagram-js/lib/core/EventBus'

const Scales = defineComponent({
  name: 'Scales',
  setup() {
    const currentScale = ref(1)
    let canvas: Canvas | null = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      try {
        canvas = modeler.get<Canvas>('canvas')
        currentScale.value = canvas.zoom()
      } finally {
        modeler.on('canvas.viewbox.changed', ({ viewbox }: CanvasEvent<any>) => {
          currentScale.value = viewbox.scale
        })
      }
    })

    const zoomReset = (newScale: number | string) => {
      canvas && canvas.zoom(newScale, newScale === 'fit-viewport' ? undefined : { x: 0, y: 0 })
    }

    const zoomOut = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 - 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    const zoomIn = (newScale?: number) => {
      currentScale.value = newScale || Math.floor(currentScale.value * 100 + 0.1 * 100) / 100
      zoomReset(currentScale.value)
    }

    return () => (
      <el-button-group>
        <el-button ref="buttonRef" onClick={() => zoomOut()} title="缩小视图">
          <LucideIcon name="ZoomOut" size={16}></LucideIcon>
        </el-button>
        <el-button onClick={() => zoomReset('fit-viewport')} title="重置缩放">
          <span style="text-align: center; display: inline-block; width: 40px">
            {Math.floor(currentScale.value * 10) * 10 + '%'}
          </span>
        </el-button>
        <el-button onClick={() => zoomIn()} title="放大视图">
          <LucideIcon name="ZoomIn" size={16}></LucideIcon>
        </el-button>
      </el-button-group>
    )
  }
})

export default Scales

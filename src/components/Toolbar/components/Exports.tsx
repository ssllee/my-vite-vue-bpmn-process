import { defineComponent } from 'vue'
import { downloadFile, setEncoded } from '@/utils/files'
import modeler from '@/store/modeler'

const Exports = defineComponent({
  name: 'Exports',
  setup() {
    const moderlerStore = modeler()
    // 下载流程图到本地
    /**
     * @param {string} type
     * @param {*} name
     */
    const downloadProcess = async (type: string, name = 'diagram') => {
      try {
        const modeler = moderlerStore.getModeler
        // 按需要类型创建文件并下载
        if (type === 'xml' || type === 'bpmn') {
          const { err, xml } = await modeler!.saveXML()
          // 读取异常时抛出异常
          if (err) {
            console.error(`[Process Designer Warn ]: ${err.message || err}`)
          }
          const { href, filename } = setEncoded(type.toUpperCase(), name, xml!)
          downloadFile(href, filename)
        } else {
          const { err, svg } = await modeler!.saveSVG()
          // 读取异常时抛出异常
          if (err) {
            return console.error(err)
          }
          const { href, filename } = setEncoded('SVG', name, svg!)
          downloadFile(href, filename)
        }
      } catch (e: any) {
        console.error(`[Process Designer Warn ]: ${e.message || e}`)
      }
    }

    const downloadProcessAsXml = () => {
      downloadProcess('xml')
    }
    const downloadProcessAsBpmn = () => {
      downloadProcess('bpmn')
    }
    const downloadProcessAsSvg = () => {
      downloadProcess('svg')
    }

    return () => (
      <span>
        <el-popover
          v-slots={{
            reference: () => <el-button type="primary">导出为...</el-button>,
            default: () => (
              <div class="button-list_column">
                <el-button type="primary" onClick={downloadProcessAsBpmn}>
                  导出为Bpmn
                </el-button>
                <el-button type="primary" onClick={downloadProcessAsXml}>
                  导出为XML
                </el-button>
                <el-button type="primary" onClick={downloadProcessAsSvg}>
                  导出为SVG
                </el-button>
              </div>
            )
          }}
        ></el-popover>
      </span>
    )
  }
})

export default Exports

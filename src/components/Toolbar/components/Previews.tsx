import { defineComponent } from 'vue'

import BpmnModdle from 'bpmn-moddle'
import modeler from '@/store/modeler'
// import { NCode, useDialog } from 'naive-ui'
import { ElMessageBox, ElMessage } from 'element-plus'

const Previews = defineComponent({
  name: 'Previews',
  setup() {
    // const previewModel = useDialog()
    const modelerStore = modeler()

    const moddle = new BpmnModdle()
    // const moddle = modelerStore.getModdle! // moddle 获取方式2

    const openXMLPreviewModel = async () => {
      try {
        const modeler = modelerStore.getModeler!

        if (!modeler) {
          return ElMessage.warning('模型加载失败，请刷新重试')
        }

        const { xml } = await modeler.saveXML({ format: true, preamble: true })

        // previewModel.create({
        //   title: '流程预览',
        //   showIcon: false,
        //   content: () => (
        //     <div class="preview-model">
        //       <NCode code={xml!} language="xml" wordWrap={true}></NCode>
        //     </div>
        //   )
        // })

        // 待优化
        ElMessageBox.alert(xml, '流程预览')
      } catch (e) {
        ElMessage.error((e as Error).message || (e as string))
      }
    }

    const openJsonPreviewModel = async () => {
      const modeler = modelerStore.getModeler!

      if (!modeler) {
        return ElMessage.warning('模型加载失败，请刷新重试')
      }

      const { xml } = await modeler.saveXML({ format: true })

      const jsonStr = await moddle.fromXML(xml!)

      // previewModel.create({
      //   title: '流程预览',
      //   showIcon: false,
      //   content: () => (
      //     <div class="preview-model">
      //       <NCode code={JSON.stringify(jsonStr, null, 2)} language="json" wordWrap={true}></NCode>
      //     </div>
      //   )
      // })

      // 待优化
      ElMessageBox.alert(JSON.stringify(jsonStr, null, 2), '流程预览')
    }

    return () => (
      <span>
        <el-popover
          v-slots={{
            reference: () => <el-button type="primary">预览文件</el-button>,
            default: () => (
              <div class="button-list_column">
                <el-button type="primary" onClick={openXMLPreviewModel}>
                  预览XML
                </el-button>
                <el-button type="primary" onClick={openJsonPreviewModel}>
                  预览JSON
                </el-button>
              </div>
            )
          }}
        ></el-popover>
      </span>
    )
  }
})

export default Previews

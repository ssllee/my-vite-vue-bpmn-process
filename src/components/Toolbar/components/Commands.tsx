import { defineComponent } from 'vue'
import EventEmitter from '@/utils/EventEmitter'
import type Modeler from 'bpmn-js/lib/Modeler'
import type CommandStack from 'diagram-js/lib/command/CommandStack'
import { createNewDiagram } from '@/utils'
import LucideIcon from '@/components/common/LucideIcon.vue'

const Commands = defineComponent({
  name: 'Commands',
  setup() {
    let command: CommandStack | null = null

    EventEmitter.on('modeler-init', (modeler: Modeler) => {
      command = modeler.get<CommandStack>('commandStack')
    })

    const undo = () => {
      command && command.canUndo() && command.undo()
    }

    const redo = () => {
      command && command.canRedo() && command.redo()
    }

    const restart = () => {
      command && command.clear()
      createNewDiagram()
    }

    return () => (
      <el-button-group>
        <el-button onClick={undo} title="撤销">
          <LucideIcon name="Undo2" size={16}></LucideIcon>
        </el-button>
        <el-button onClick={redo} title="恢复">
          <LucideIcon name="Redo2" size={16}></LucideIcon>
        </el-button>
        <el-button onClick={restart} title="擦除重做">
          <LucideIcon name="Eraser" size={16}></LucideIcon>
        </el-button>
      </el-button-group>
    )
  }
})

export default Commands

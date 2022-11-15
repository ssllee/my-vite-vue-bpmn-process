<template>
  <el-collapse-item name="element-extension-properties">
    <template #title>
      <el-icon size="18">
        <Crop />
      </el-icon>
      扩展属性 {{ extensions.length }}
    </template>

    <div class="element-extension-properties">
      <el-table :data="extensions" style="width: 100%">
        <el-table-column type="index" label="序号" width="60" />
        <el-table-column prop="name" label="Name" :show-overflow-tooltip="true" />
        <el-table-column prop="value" label="Value" :show-overflow-tooltip="true" />
        <el-table-column fixed="right" label="操作">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="removeProperty(scope.$index)"
              >移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" class="inline-large-button" plain @click="openPropertyModel">
        <lucide-icon :size="20" name="Plus" />
        <span>添加扩展属性</span>
      </el-button>
    </div>

    <el-dialog v-model="modelVisible" title="添加扩展属性" width="640px" append-to-body>
      <el-form
        ref="formRef"
        :model="newProperty"
        :rules="formRules"
        label-width="auto"
        label-position="top"
        size="small"
      >
        <el-form-item prop="name" label="属性名称( Name )">
          <el-input v-model="newProperty.name" @keydown.enter.prevent />
        </el-form-item>
        <el-form-item prop="value" label="属性值( Value )">
          <el-input v-model="newProperty.value" @keydown.enter.prevent />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" size="small" @click="addProperty">确认</el-button>
      </template>
    </el-dialog>
  </el-collapse-item>
</template>

<script lang="ts">
  import { defineComponent, markRaw, ref, computed, nextTick, onMounted, watch } from 'vue'
  import modeler from '@/store/modeler'
  import { ModdleElement } from 'bpmn-moddle'
  import { FormRules } from 'element-plus'
  import { Base } from 'diagram-js/lib/model'
  import {
    addExtensionProperty,
    getExtensionProperties,
    removeExtensionProperty
  } from '@/bo-utils/extensionPropertiesUtil'
  import EventEmitter from '@/utils/EventEmitter'
  import { Crop } from '@element-plus/icons-vue'

  export default defineComponent({
    name: 'ElementExtensionProperties',
    components: { Crop },
    setup() {
      const modelerStore = modeler()
      const getActive = computed(() => modelerStore.getActive!)
      const getActiveId = computed<string>(() => modelerStore.getActiveId!)
      let extensionsRaw = markRaw([])
      const formRef = ref<HTMLElement | null>(null)
      const extensions = ref<ExtensionPropertyForm[]>([])
      const newProperty = ref<ExtensionPropertyForm>({ name: '', value: '' })
      const formRules: FormRules = {
        name: { required: true, message: '属性名称不能为空', trigger: ['blur', 'change'] },
        value: { required: true, message: '属性值不能为空', trigger: ['blur', 'change'] }
      }
      const modelVisible = ref(false)

      const reloadExtensionProperties = async () => {
        modelVisible.value = false
        await nextTick()
        newProperty.value = { name: '', value: '' }
        ;(extensionsRaw as ModdleElement[]) = markRaw(
          getExtensionProperties(getActive.value as Base)
        )
        extensions.value = JSON.parse(JSON.stringify(extensionsRaw))
      }

      const removeProperty = (propIndex: number) => {
        console.log(getActive.value, propIndex)
        removeExtensionProperty(getActive.value as Base, extensionsRaw[propIndex])
        reloadExtensionProperties()
      }

      const addProperty = async () => {
        ;(formRef.value as any).validate((valid: any) => {
          if (valid) {
            // addExtensionProperty(getActive.value as Base, toRaw(newProperty.value))
            addExtensionProperty(getActive.value, newProperty.value)
            reloadExtensionProperties()
          }
        })
      }

      const openPropertyModel = async () => {
        modelVisible.value = true
        await nextTick()
        formRef.value && (formRef.value as any).resetFields()
      }

      watch(getActiveId, () => {
        reloadExtensionProperties()
      })

      onMounted(() => {
        reloadExtensionProperties()
        EventEmitter.on('element-update', reloadExtensionProperties)
      })

      return {
        formRef,
        extensions,
        newProperty,
        modelVisible,
        formRules,
        removeProperty,
        openPropertyModel,
        addProperty
      }
    }
  })
</script>

<style scoped></style>

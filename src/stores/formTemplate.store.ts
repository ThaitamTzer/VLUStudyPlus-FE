import { create } from 'zustand'

import formTemplateService from '@/services/formTemplate.service'

interface FormTemplate {
  _id: string
  title: string
  documentCode: string
  recipient: string[]
  description: string
  sections: any[]
  createdAt: string
  updatedAt: string
}

interface FormTemplateStore {
  formTemplates: FormTemplate[]
  selectedTemplate: FormTemplate | null
  isLoading: boolean
  error: any
  fetchFormTemplates: () => Promise<void>
  getFormTemplateById: (id: string) => Promise<void>
  createFormTemplate: (data: any) => Promise<void>
  updateFormTemplate: (id: string, data: any) => Promise<void>
  deleteFormTemplate: (id: string) => Promise<void>
  setSelectedTemplate: (template: FormTemplate | null) => void
}

const useFormTemplateStore = create<FormTemplateStore>(set => ({
  formTemplates: [],
  selectedTemplate: null,
  isLoading: false,
  error: null,

  fetchFormTemplates: async () => {
    set({ isLoading: true, error: null })

    try {
      const data = await formTemplateService.getAllFormTemplate()

      set({ formTemplates: data, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },

  getFormTemplateById: async (id: string) => {
    set({ isLoading: true, error: null })

    try {
      const data = await formTemplateService.getFormTemplateById(id)

      set({ selectedTemplate: data, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },

  createFormTemplate: async (data: any) => {
    set({ isLoading: true, error: null })

    try {
      await formTemplateService.createFormTemplate(data)
      const templates = await formTemplateService.getAllFormTemplate()

      set({ formTemplates: templates, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },

  updateFormTemplate: async (id: string, data: any) => {
    set({ isLoading: true, error: null })

    try {
      await formTemplateService.updateFormTemplate(id, data)
      const templates = await formTemplateService.getAllFormTemplate()

      set({ formTemplates: templates, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },

  deleteFormTemplate: async (id: string) => {
    set({ isLoading: true, error: null })

    try {
      await formTemplateService.deleteFormTemplate(id)
      const templates = await formTemplateService.getAllFormTemplate()

      set({ formTemplates: templates, isLoading: false })
    } catch (error) {
      set({ error, isLoading: false })
    }
  },

  setSelectedTemplate: (template: FormTemplate | null) => {
    set({ selectedTemplate: template })
  }
}))

export default useFormTemplateStore

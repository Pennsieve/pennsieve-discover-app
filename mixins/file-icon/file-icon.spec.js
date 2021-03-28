import Vue from 'vue'
import { shallowMount } from '@vue/test-utils'

import FileIcon from './'

describe('FileIcon Mixin', () => {
  let cmp

  beforeEach(() => {
    const TestComponent = Vue.component('test', {
      mixins: [FileIcon],
      data() {
        return {
          placeholder: ''
        }
      }
    })
    cmp = shallowMount(TestComponent)
  })

  it('fileIcon: returns Collection folder icon', () => {
    const collectionIcon = cmp.vm.fileIcon('', 'Directory')
    expect(collectionIcon.includes('icon-folder')).toBe(true)
  })

  it.skip('fileIcon: returns known icon', () => {
    const icon = cmp.vm.fileIcon('Docker', 'dockerfile')
    expect(icon.includes('icon-docker')).toBe(true)
  })

  it('fileIcon: returns default icon', () => {
    const collectionIcon = cmp.vm.fileIcon('', '')
    expect(collectionIcon.includes('icon-generic')).toBe(true)
  })
})

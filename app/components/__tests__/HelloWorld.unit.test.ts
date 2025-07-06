// app/pages/__tests__/x.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '../../components/HelloWorld.vue'

describe('HelloWorld.vue', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, {
      props: { name: 'Lars' },
    })
    expect(wrapper.text()).toContain('Lars')
  })
})

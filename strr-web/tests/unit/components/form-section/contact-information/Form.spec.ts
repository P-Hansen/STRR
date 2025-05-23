// @vitest-environment nuxt
import { it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createI18n } from 'vue-i18n'
import { mockFn } from '@nuxt/test-utils'
import { BcrosFormSectionContactInformationForm } from '#components'

const i18n = createI18n({
  // vue-i18n options here ...
})

it('can mount Property Details Form Section component', async () => {
  const addressSection = await mountSuspended(BcrosFormSectionContactInformationForm,
    {
      global: { plugins: [i18n] },
      props: {
        hasSecondaryContact: false,
        toggleAddSecondary: mockFn,
        isComplete: false,
        secondFormIsComplete: false
      }
    })
  expect(addressSection.find('[data-test-id="host-information-form"]').exists()).toBe(true)
})

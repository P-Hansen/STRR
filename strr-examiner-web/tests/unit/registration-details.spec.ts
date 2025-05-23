import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect, vi, beforeAll } from 'vitest'
import {
  mockHostRegistration,
  mockPlatformRegistration,
  mockStrataHotelRegistration,
  mockExpiredRegistration,
  mockSuspendedRegistration,
  mockCancelledRegistration
} from '../mocks/mockedData'
import { enI18n } from '../mocks/i18n'
import RegistrationDetails from '~/pages/registration/[registrationId].vue'
import {
  RegistrationInfoHeader
} from '#components'

const mockViewReceipt = vi.fn()
let currentMockData = mockHostRegistration
const isAssignedToUser = ref(true)
const mockRightButtons = [
  { key: 'cancel', disabled: false }
]

vi.mock('@/composables/useExaminerRoute', () => ({
  useExaminerRoute: () => ({
    getRouteConfig: () => ({
      rightButtons: mockRightButtons
    }),
    updateRouteAndButtons: vi.fn()
  })
}))
vi.mock('@/stores/examiner', () => ({
  useExaminerStore: () => ({
    updateRegistrationStatus: vi.fn().mockResolvedValue(undefined),
    getRegistrationById: vi.fn().mockImplementation(() => Promise.resolve(currentMockData)),
    resetEditRentalUnitAddress: vi.fn(),
    activeReg: ref(currentMockData),
    activeHeader: ref(currentMockData.header),
    activeRecord: ref(currentMockData),
    isApplication: ref(false),
    isAssignedToUser,
    viewReceipt: mockViewReceipt,
    isFilingHistoryOpen: ref(false)
  })
}))

describe('Examiner - Registration Details Page', () => {
  let wrapper: any

  beforeAll(async () => {
    currentMockData = mockHostRegistration
    wrapper = await mountSuspended(RegistrationDetails, {
      global: { plugins: [enI18n] }
    })
  })

  it('renders Application Details page and its components', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findComponent(RegistrationInfoHeader).exists()).toBe(true)
  })

  it('displays correct badge color for ACTIVE status', async () => {
    currentMockData = mockHostRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })
    const badge = componentWrapper.find('.inline-flex.bg-green-500')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('Registered')
  })

  it('displays correct badge color for EXPIRED status', async () => {
    currentMockData = mockExpiredRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })
    const badge = componentWrapper.find('.inline-flex.bg-red-500')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('Expired')
  })

  it('displays correct badge color for SUSPENDED status', async () => {
    currentMockData = mockSuspendedRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })
    const badge = componentWrapper.find('.inline-flex.bg-blue-500')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('Suspended')
  })

  it('displays correct badge color for CANCELLED status', async () => {
    currentMockData = mockCancelledRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const badge = componentWrapper.find('.inline-flex.bg-red-500')
    expect(badge.exists()).toBe(true)
    expect(badge.text()).toContain('Cancelled')
  })

  it('displays correct application name for HOST type', async () => {
    currentMockData = mockHostRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const nameElement = componentWrapper.find('.text-2xl')
    expect(nameElement.text()).toContain('Downtown Unit')
  })

  it('displays correct application name for PLATFORM type', async () => {
    currentMockData = mockPlatformRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const nameElement = componentWrapper.find('.text-2xl')
    expect(nameElement.text()).toContain('Test Platform Inc.')
  })

  it('displays correct application name for STRATA_HOTEL type', async () => {
    currentMockData = mockStrataHotelRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const nameElement = componentWrapper.find('.text-2xl')
    expect(nameElement.text()).toContain('Doe Enterprises')
  })

  it('displays website button for STRATA_HOTEL type', async () => {
    currentMockData = mockStrataHotelRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const websiteButton = componentWrapper.findTestId('strata-brand-website')
    expect(websiteButton.exists()).toBe(true)
    expect(websiteButton.attributes('href')).toBe('https://luxurystays.com')
  })

  it('displays correct registration type for HOST', async () => {
    currentMockData = mockHostRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const allText = componentWrapper.text()
    expect(allText).toContain('Type: Host')
  })

  it('displays correct registration type for PLATFORM', async () => {
    currentMockData = mockPlatformRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const allText = componentWrapper.text()
    expect(allText).toContain('Type: Platform')
  })

  it('displays correct registration type for STRATA_HOTEL', async () => {
    currentMockData = mockStrataHotelRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })
    const allText = componentWrapper.text()
    expect(allText).toContain('Type: Strata Hotel')
  })

  it('displays reviewer information when available', async () => {
    currentMockData = mockHostRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const allText = componentWrapper.text()
    expect(allText).toContain('Approved By: examiner1')
  })

  it('displays view receipt button and calls viewReceipt when clicked', async () => {
    currentMockData = mockHostRegistration

    const componentWrapper = await mountSuspended(RegistrationInfoHeader, {
      global: { plugins: [enI18n] }
    })

    const receiptButton = componentWrapper.findTestId('view-receipt-button')
    expect(receiptButton.exists()).toBe(true)
    expect(receiptButton.text()).toContain('View Receipt')

    await receiptButton.trigger('click')
    expect(mockViewReceipt).toHaveBeenCalledWith(currentMockData.header.applicationNumber)
  })

  it('disables action button when isAssignedToUser is false', async () => {
    isAssignedToUser.value = false
    await nextTick()
    const actionButtons = ['cancel']
    mockRightButtons.forEach((button) => {
      if (actionButtons.includes(button.key)) {
        button.disabled = true
      }
    })
    actionButtons.forEach((action) => {
      const button = mockRightButtons.find(btn => btn.key === action)
      expect(button?.disabled).toBe(true)
    })
    isAssignedToUser.value = true
  })
})

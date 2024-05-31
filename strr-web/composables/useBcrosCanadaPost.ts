import { reactive } from 'vue'
import { useRuntimeConfig } from '#app'
import type { CanadaPostAddressI, CanadaPostResponseAddressI } from '#imports'

export const useCanadaPostAddress = () => {
  const activeAddressField = ref<string>()
  const address = reactive<CanadaPostAddressI>({
    street: '',
    streetAdditional: '',
    city: '',
    region: '',
    postalCode: '',
    country: '',
    deliveryInstructions: ''
  })

  const createAddressComplete = (pca: any, key: string, id: string, countryIso2: string,
    countrySelect: boolean): object => {
    const fields = [
      { element: id, field: 'Line1', mode: pca.fieldMode.SEARCH }
    ]
    // Conditional to only allow country selection depending on control
    const bar = countrySelect ? { visible: true, showCountry: true } : {}
    const countries = {
      defaultCode: countryIso2,
      ...(countrySelect ? {} : { codesList: 'CA' })
    }
    const options = { key, bar, countries }
    const addressComplete = new pca.Address(fields, options)
    addressComplete.listen('populate', addressCompletePopulate)
    return addressComplete
  }

  const enableAddressComplete = (id: string, countryIso2: string, countrySelect: boolean): void => {
    activeAddressField.value = id
    const config = useRuntimeConfig()
    const pca = (window as any).pca
    const key = config.public.addressCompleteKey
    if (!pca || !key) {
      // eslint-disable-next-line no-console
      console.log('AddressComplete not initialized due to missing script and/or key')
      return
    }
    if ((window as any).currentAddressComplete) {
      (window as any).currentAddressComplete.destroy()
    }
    (window as any).currentAddressComplete = createAddressComplete(pca, key, id, countryIso2, countrySelect)
  }

  const addressCompletePopulate = (addressComplete: CanadaPostResponseAddressI): void => {
    address.street = addressComplete.Line1 || 'N/A'
    address.streetAdditional = addressComplete.Line2 || ''
    address.city = addressComplete.City
    address.region = addressComplete.ProvinceCode
    address.postalCode = addressComplete.PostalCode
    address.country = addressComplete.CountryIso2
  }

  return {
    activeAddressField,
    address,
    enableAddressComplete
  }
}

import { useWeb3Context } from 'web3-react'
import getNetworkEnv from '../utils/network-env'
import { getAddress } from 'ethers/utils'

const useFactory = () => {
  const { networkId } = useWeb3Context()
  const GTCR_SUBGRAPH_URL = getNetworkEnv('REACT_APP_SUBGRAPH_URL', networkId)

  const deployedWithLightFactory = async tcrAddress => {
    if (!tcrAddress) return false
    try {
      tcrAddress = getAddress(tcrAddress)
    } catch (_) {
      return false
    }
    const query = {
      query: `
        {
          lregistry(id: "${tcrAddress.toLowerCase()}") {
            id
          }
        }
      `
    }
    const { data } = await (
      await fetch(GTCR_SUBGRAPH_URL, {
        method: 'POST',
        body: JSON.stringify(query)
      })
    ).json()

    if (data.lregistry) return true

    return false
  }

  const deployedWithFactory = async tcrAddress => {
    if (!tcrAddress) return false

    try {
      tcrAddress = getAddress(tcrAddress)
    } catch (_) {
      return false
    }

    const query = {
      query: `
        {
          registry(id: "${tcrAddress.toLowerCase()}") {
            id
          }
        }
      `
    }
    const { data } = await (
      await fetch(GTCR_SUBGRAPH_URL, {
        method: 'POST',
        body: JSON.stringify(query)
      })
    ).json()

    if (data.registry) return true

    return false
  }

  return {
    deployedWithLightFactory,
    deployedWithFactory
  }
}

export default useFactory

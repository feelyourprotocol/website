export const EIPs: EIPs = {
  'eip-7594': {
    num: 7594,
    path: '/eip-7594-peerdas-data-availability-sampling',
    title: 'Peer Data Availability Sampling',
    topicId: 'fusaka',
  },
  'eip-7883': {
    num: 7883,
    path: '/eip-7883-modexp-gas-cost-increase',
    title: 'ModExp Gas Cost Increase',
    topicId: 'fusaka',
  },
  'eip-7951': {
    num: 7951,
    path: '/eip-7951-secp256r1-precompile',
    title: 'secp256r1 Precompile Support',
    topicId: 'fusaka',
  },
}

export const TOPICS: Topics = {
  fusaka: {
    title: 'Fusaka',
    path: '/fusaka',
    url: 'https://forkcast.org/upgrade/fusaka',
    eips: getTopicEIPs('fusaka'),
  },
}

export interface EIP {
  num: number
  path: string
  title: string
  topicId?: string
}
export interface EIPs {
  [key: string]: EIP
}

export interface Topic {
  title: string
  path: string
  url: string
  eips: number[]
}
export interface Topics {
  [key: string]: Topic
}

function getTopicEIPs(topicId: string) {
  const eips: number[] = []
  for (const [, eip] of Object.entries(EIPs)) {
    if (eip.topicId === topicId) {
      eips.push(eip.num)
    }
  }
  return eips
}

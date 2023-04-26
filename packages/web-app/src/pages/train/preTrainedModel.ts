import { AgentType } from 'src/graphql/generated'

export type PreTrainedModelDef = {
  agentType: AgentType
  agentName: 'AllRounder' | 'Buff' | 'Nimble'
  storageURI: string
}

export const preTrainedModel: PreTrainedModelDef[] = [
  {
    agentType: AgentType.Light,
    agentName: 'Nimble',
    storageURI:
      'https://d1igu04zf7rfdu.cloudfront.net/training_models/light.zip',
  },
  {
    agentType: AgentType.Heavy,
    agentName: 'Buff',
    storageURI:
      'https://d1igu04zf7rfdu.cloudfront.net/training_models/heavy.zip',
  },
  {
    agentType: AgentType.Balanced,
    agentName: 'AllRounder',
    storageURI:
      'https://d1igu04zf7rfdu.cloudfront.net/training_models/balanced.zip',
  },
]

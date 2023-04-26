import type { AgentConfig } from "core-backend/src/entities/training-record";
import type { AgentType } from "src/generated/gql";

export const AgentToAgentConfigMapping: Record<AgentType, AgentConfig> = {
  "Balanced": {
    "genome_attributes": {
      "size": 0.5454545454545454,
      "strength": 0.16666666666666666,
      "max_speed": 0.47368421052631576,
      "endurance": 1
    },
    "memory_config": {
      "type": "TrainedNode",
      "memory": {
        "memory_id": "Balanced",
        "memory_url": "https://d1igu04zf7rfdu.cloudfront.net/training_models/balanced.zip"
      }
    }
  },
  "Heavy": {
    "genome_attributes": {
      "size": 1,
      "strength": 0,
      "max_speed": 0.05263157894736842,
      "endurance": 0.25
    },
    "memory_config": {
      "type": "TrainedNode",
      "memory": {
        "memory_id": "Heavy",
        "memory_url": "https://d1igu04zf7rfdu.cloudfront.net/training_models/heavy.zip"
      }
    }
  },
  "Light": {
    "genome_attributes": {
      "size": 0.09090909090909091,
      "strength": 0,
      "max_speed": 1,
      "endurance": 1
    },
    "memory_config": {
      "type": "TrainedNode",
      "memory": {
        "memory_id": "Light",
        "memory_url": "https://d1igu04zf7rfdu.cloudfront.net/training_models/light.zip"
      }
    }
  }
}

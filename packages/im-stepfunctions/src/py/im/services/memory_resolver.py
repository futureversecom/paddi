from gym import Env
from im.services.model_loader import ModelLoader
from schemas.segments.agent_config import MemoryNode
from stable_baselines3 import PPO
from stable_baselines3.ppo.policies import MultiInputPolicy
from typing_extensions import assert_never


class MemoryResolver:
    def __init__(self, model_loader: ModelLoader) -> None:
        self.model_loader = model_loader

    def resolve(self, config: MemoryNode, env: Env) -> PPO:
        if config.__root__.type == "RootNode":
            # env is needed to determine observation and action spaces
            return PPO(MultiInputPolicy, env)
        elif config.__root__.type == "TrainedNode":
            loaded_path = self.model_loader.load(
                model_url=config.__root__.memory.memory_url,
                memory_id=config.__root__.memory.memory_id,
            )

            return PPO.load(loaded_path)
        else:
            assert_never(config.__root__)

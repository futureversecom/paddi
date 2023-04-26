import numpy as np
from pong.env.spaces import Action, ActionType, ObsType, transform_raw_action
from stable_baselines3 import PPO


class Opponent:
    def predict(self, observation: ObsType) -> Action:
        raise NotImplementedError


class ModelOpponent(Opponent):
    def __init__(self, model: PPO) -> None:
        self.model = model

    def predict(self, observation: ObsType) -> Action:
        predicted = self.model.predict(
            # gym Dict type is not compatible with the TypeDict
            # but its essentially the same thing
            observation=observation  # type: ignore
        )[0]

        return transform_raw_action(predicted)


class RandomOpponent(Opponent):
    def predict(self, observation: ObsType) -> Action:
        return Action(action=ActionType(np.random.randint(0, 3)), force=np.random.random())


class StaticOpponent(Opponent):
    def __init__(self, action: ActionType, force: float) -> None:
        self.action = Action(action, force)
        self.force = force

    def predict(self, observation: ObsType) -> Action:
        return self.action

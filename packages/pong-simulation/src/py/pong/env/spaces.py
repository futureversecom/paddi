import enum
from dataclasses import dataclass
from typing import Any, Dict, List, Optional, TypedDict

import numpy as np
import numpy.typing as npt
from gym import spaces
from pong.renderer.render_state import RenderState
from pong.simulation.events import SimulationEvent
from pong.simulation.simulation import ResultType

ObsSpace = spaces.Dict(
    {
        "paddle_l_top": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "paddle_l_bottom": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "paddle_r_top": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "paddle_r_bottom": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "paddle_velocity_l": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "paddle_velocity_r": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "ball": spaces.Box(
            low=np.array([0.0, 0.0]),
            high=np.array([1.0, 1.0]),
            shape=(2,),
            dtype=np.float64,
        ),
        "ball_velocity": spaces.Box(
            low=np.array([-np.inf, -np.inf]),
            high=np.array([np.inf, np.inf]),
            shape=(2,),
            dtype=np.float64,
        ),
        "ball_distance_x": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "ball_distance_y": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "paddle_endurance_l": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "paddle_endurance_r": spaces.Box(0.0, 1.0, shape=(1,), dtype=np.float64),
        "time": spaces.Box(0.0, np.inf, shape=(1,), dtype=np.float64),
    }
)

ObsType = TypedDict(
    "ObsType",
    {
        "paddle_l_top": npt.NDArray[np.float64],
        "paddle_l_bottom": npt.NDArray[np.float64],
        "paddle_r_top": npt.NDArray[np.float64],
        "paddle_r_bottom": npt.NDArray[np.float64],
        "paddle_velocity_l": npt.NDArray[np.float64],
        "paddle_velocity_r": npt.NDArray[np.float64],
        "ball": npt.NDArray[np.float64],
        "ball_velocity": npt.NDArray[np.float64],
        "ball_distance_x": npt.NDArray[np.float64],
        "ball_distance_y": npt.NDArray[np.float64],
        "paddle_endurance_l": npt.NDArray[np.float64],
        "paddle_endurance_r": npt.NDArray[np.float64],
        "time": npt.NDArray[np.float64],
    },
)

InfoType = TypedDict("InfoType", {
    "events": List[SimulationEvent],
    "states": List[RenderState],
    "result": Optional[ResultType],
    "rewards": Dict[str, float],
    "is_success": Optional[bool],
})


# Mypy doesn't support mapped types at the moment. To make sure the ActionSpace definition
# and the resulting action type is tracked closely as possible, we keep the types in sync.

ActionSpace = spaces.MultiDiscrete(
    [
        # ActionType
        3,
        # Force magnitude between 0 and 99
        100,
    ]
)


class ActionType(enum.IntEnum):
    UP = 0
    DOWN = 1
    STOP = 2


@dataclass
class Action:
    action: ActionType
    # Force magnitude between 0 and 1
    force: float


def transform_raw_action(raw_action: Any) -> Action:
    (action, force) = raw_action
    return Action(action=ActionType(action), force=(force + 1) / 100.0)

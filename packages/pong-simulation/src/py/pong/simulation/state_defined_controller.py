from pong.simulation.controller import Action, ActionType, Controller


class StateDefinedController(Controller):
    """The controller state could be set by an external caller."""

    action: Action

    def __init__(self) -> None:
        self.action = Action("stop", 0.0)
        self.model = None

    def set_model_action(self, action: ActionType, force: float) -> None:
        self.action = Action(action, force)

    def get_action(self) -> Action:
        return self.action

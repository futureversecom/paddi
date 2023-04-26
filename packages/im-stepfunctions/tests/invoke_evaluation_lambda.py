import pathlib
import sys

sys.path = [str(pathlib.Path(__file__).parent / "../src")] + sys.path
print(sys.path)


def test() -> None:
    import os
    from typing import Any, cast

    from schemas.evaluation_request import EvaluationRequest

    # setup python process environment
    os.environ["ACP_DEMO_RESULTS_BUCKET"] = "asm-protocol-dev-im-results"

    from im.lambdas.evaluation_handler import handler

    res = handler(
        EvaluationRequest.parse_obj(
            {
                "evaluation": {"scenario": {"scenario_type": "Wall"}, "iterations": 10},
                "training_id": "1234",
                "genome_attributes": {
                    "size": 0.5,
                    "strength": 0.5,
                    "max_speed": 0.5,
                    "endurance": 0.5,
                },
                "training_output": {
                    "output_path": "1234/2023-03-07-10-53-16/model.zip",
                    "completed_training_units": 3,
                    "is_completed": True,
                },
            }
        ),
        cast(Any, {}),
    )

    print(res)


test()

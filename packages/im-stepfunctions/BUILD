# generate mocks used to test the step function
experimental_run_shell_command(
    name="generate-mock",
    command="cd packages/im-stepfunctions && make generate_sfn_mocks",
    dependencies=["packages/im-stepfunctions/tests"],
)

python_awslambda(
    name="training_handler",
    runtime="python3.8",
    handler="src/py/im/lambdas/training_handler.py:handler",
    dependencies=[
        "pants/3rdparty:torch#torch",
    ],
)

python_awslambda(
    name="evaluation_config_handler",
    runtime="python3.8",
    handler="src/py/im/lambdas/evaluation_config_handler.py:handler",
)

python_awslambda(
    name="evaluation_handler",
    runtime="python3.8",
    handler="src/py/im/lambdas/evaluation_handler.py:handler",
    dependencies=[
        "pants/3rdparty:torch#torch",
    ],
)

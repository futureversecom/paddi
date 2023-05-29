import os

import sentry_sdk
from sentry_sdk.integrations.aws_lambda import AwsLambdaIntegration

sentry_dsn = os.environ.get('SENTRY_DSN')
sentry_environment = os.environ.get('SENTRY_ENVIRONMENT')


def init() -> None:
    if sentry_dsn is None:
        return

    sentry_sdk.init(
        dsn=sentry_dsn,
        environment=sentry_environment,
        integrations=[
            AwsLambdaIntegration(),
        ],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production,
        traces_sample_rate=1.0,
    )

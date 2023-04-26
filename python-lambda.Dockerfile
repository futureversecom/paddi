ARG LAMBDA_HANDLER_NAME

FROM public.ecr.aws/lambda/python:3.8 as builder

# Install deps
RUN yum install -y unzip

# Refresh ARG
ARG LAMBDA_HANDLER_NAME

# Copy the lambda handlers and extract
COPY dist/packages.im-stepfunctions/${LAMBDA_HANDLER_NAME}.zip  /app/dist/packages.im-stepfunctions/${LAMBDA_HANDLER_NAME}
RUN unzip -q /app/dist/packages.im-stepfunctions/${LAMBDA_HANDLER_NAME} -d /app/dist/packages.im-stepfunctions/lambda

FROM public.ecr.aws/lambda/python:3.8

# Copy the lambda handler from the builder
COPY --from=builder /app/dist/packages.im-stepfunctions/lambda ${LAMBDA_TASK_ROOT}

CMD ["lambdex_handler.handler"]

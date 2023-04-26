# generate mocks used to test the step function
generate_sfn_mocks:
	PYTHONPATH=./tests:../schemas/gen/py python tests/testcases/make_step_function_mocks.py

test_docker:generate_sfn_mocks
	docker-compose up --build --exit-code-from tester

test:generate_sfn_mocks
	AWS_ACCESS_KEY_ID=xxx AWS_SECRET_ACCESS_KEY=xxx AWS_DEFAULT_REGION=us-west-2 python -m pytest -v ./tests

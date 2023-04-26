files(
  name="events",
  sources=["src/**/*.json"],
)

experimental_run_shell_command(
    name="generate-events",
    command="""cd packages/schemas && datamodel-codegen \
      --input "./src/im" \
      --input-file-type jsonschema \
      --enum-field-as-literal=one \
      --disable-timestamp \
      --output gen/py/schemas""",
    dependencies=[
      "pants/3rdparty:reqs#datamodel-code-generator@resolve=python-default",
      "packages/schemas:events",
    ],
)

python_requirements(name="reqs", resolve=parametrize("python-default", "ci"))

python_requirement(
    name="torch",
    # Use an absolute path to a .whl or sdist file.
    requirements=[
        "Torch @ http://download.pytorch.org/whl/cpu/torch-2.0.0%2Bcpu-cp38-cp38-linux_x86_64.whl",
    ],
    resolve="ci",
)

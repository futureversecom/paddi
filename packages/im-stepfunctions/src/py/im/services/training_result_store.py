import os
from datetime import datetime
from pathlib import Path

from mypy_boto3_s3 import S3Client
from stable_baselines3 import PPO


class TrainingResultsStore:
    def store_model(self, model: PPO, training_id: str) -> str:
        """Stores the model in the given s3 bucket and returns the path to the uploaded file."""
        raise NotImplementedError

    def load_model(self, training_id: str, model_path: str) -> PPO:
        """Loads the model from the given path from the local file system."""
        raise NotImplementedError


class S3TrainingResultsStore(TrainingResultsStore):
    def __init__(self, s3_client: S3Client, results_bucket: str, model_upload_path: Path) -> None:
        self.s3_client = s3_client
        self.results_bucket = results_bucket
        self.model_upload_path = model_upload_path

    def store_model(self, model: PPO, training_id: str) -> str:
        """Stores the model in the given s3 bucket and returns the path to the uploaded file."""

        file_path_dir = self.model_upload_path / training_id
        output_time = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        output_key = f"{training_id}/{output_time}/model.zip"

        os.makedirs(file_path_dir, exist_ok=True)
        file_path = file_path_dir / "model.zip"
        model.save(file_path)

        self.s3_client.upload_file(
            Bucket=self.results_bucket,
            Key=output_key,
            Filename=str(file_path),
        )

        return output_key

    def load_model(self, training_id: str, model_path: str) -> PPO:
        """Loads the model from the given path from the local file system."""
        file_dir_path = self.model_upload_path / training_id
        os.makedirs(file_dir_path, exist_ok=True)
        file_path = file_dir_path / "model.zip"

        self.s3_client.download_file(
            Bucket=self.results_bucket,
            Key=model_path,
            Filename=str(file_path),
        )

        return PPO.load(file_path)


class MockS3TrainingResultsStore(TrainingResultsStore):
    def __init__(self, model_dir: Path) -> None:
        self.model_dir = model_dir

    def store_model(self, model: PPO, training_id: str) -> str:
        """Stores the model in the given s3 bucket and returns the path to the uploaded file."""
        output_time = datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        output_path = str(self.model_dir / training_id / output_time)
        model.save(output_path)

        return output_path

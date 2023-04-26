import os
import pathlib
from typing import Dict
from urllib.parse import urlparse

from mypy_boto3_s3 import S3Client


class ModelLoader:
    def load(self, model_url: str, memory_id: str) -> str:
        """Loads the model from the given path."""
        raise NotImplementedError


class S3ModelLoader(ModelLoader):
    def __init__(
        self, s3_client: S3Client, models_bucket: str, model_download_path: pathlib.Path
    ) -> None:
        self.s3_client = s3_client
        self.models_bucket = models_bucket
        self.model_download_path = model_download_path

    def load(self, model_url: str, memory_id: str) -> str:
        """This assumes that the model path is stored in a pre-configured s3 bucket, avoid external
        internet access by directly downloading the model from the s3 bucket."""

        # take path from the url and remove the leading slash
        s3_key = urlparse(model_url).path.strip("/")
        file_dir_path = self.model_download_path / memory_id
        os.makedirs(file_dir_path, exist_ok=True)

        file_path = str(file_dir_path / "model.zip")
        self.s3_client.download_file(Bucket=self.models_bucket, Key=s3_key, Filename=file_path)

        return file_path


class MockS3ModelLoader(ModelLoader):
    def __init__(self, model_dir: pathlib.Path) -> None:
        self.model_dir = model_dir

    def load(self, model_url: str, memory_id: str) -> str:
        """Loads the model from the given path from the local file system."""
        return str(self.model_dir / model_url)


class CachedModelLoader(ModelLoader):
    cache: Dict[str, str]

    def __init__(self, model_loader: ModelLoader) -> None:
        self.model_loader = model_loader
        self.cache = {}

    def load(self, model_url: str, memory_id: str) -> str:
        """Loads the model from the given path from the local file system."""
        if memory_id in self.cache:
            return self.cache[memory_id]

        loaded_path = self.model_loader.load(model_url, memory_id)
        self.cache[memory_id] = loaded_path

        return loaded_path

import gzip

from mypy_boto3_s3 import S3Client


class S3ReplayWriterService:
    def __init__(self, s3_client: S3Client, results_bucket: str):
        self.s3_client = s3_client
        self.results_bucket = results_bucket

    def upload_gzipped(self, file_path: str, replay_prefix: str) -> None:
        gzip_file_path = file_path + ".gz"

        with open(file_path, "rb") as f_in:
            with gzip.open(gzip_file_path, "wb") as f_out:
                f_out.write(f_in.read())

        self.s3_client.upload_file(
            Bucket=self.results_bucket,
            Key=replay_prefix,
            Filename=gzip_file_path,
            ExtraArgs={
                "ContentType": "text/plain",
                "ContentEncoding": "gzip"
            }
        )

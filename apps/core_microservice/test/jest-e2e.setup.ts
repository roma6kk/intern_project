// Ensure required AWS* config exists for tests that instantiate FilesService.
process.env.AWS_BUCKET_NAME ??= 'innogram-bucket';
process.env.AWS_REGION ??= 'us-east-1';
process.env.AWS_ENDPOINT ??= 'http://localhost:9000';
process.env.AWS_ACCESS_KEY_ID ??= 'minioadmin';
process.env.AWS_SECRET_ACCESS_KEY ??= 'minioadmin';


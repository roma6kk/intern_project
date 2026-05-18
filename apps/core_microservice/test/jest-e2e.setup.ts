process.env.AWS_BUCKET_NAME ??= 'innogram-bucket';
process.env.AWS_REGION ??= 'us-east-1';
process.env.AWS_ENDPOINT ??= 'http://127.0.0.1:9000';
process.env.AWS_ACCESS_KEY_ID ??= 'minioadmin';
process.env.AWS_SECRET_ACCESS_KEY ??= 'minioadmin';

const rewriteLocalhostEnv = (key: keyof NodeJS.ProcessEnv) => {
  const value = process.env[key];
  if (typeof value === 'string' && value.includes('localhost')) {
    process.env[key] = value.replaceAll('localhost', '127.0.0.1');
  }
};

rewriteLocalhostEnv('DATABASE_URL');
rewriteLocalhostEnv('REDIS_URL');
rewriteLocalhostEnv('RABBITMQ_URL');

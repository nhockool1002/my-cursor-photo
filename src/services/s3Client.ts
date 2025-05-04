import { S3Client, ListObjectsV2Command, ListObjectsV2CommandOutput } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const listObjectsV2 = async (params: {
  Bucket: string;
  Prefix?: string;
  Delimiter?: string;
}): Promise<ListObjectsV2CommandOutput> => {
  const command = new ListObjectsV2Command(params);
  return s3Client.send(command);
};

export { s3Client };
export type { ListObjectsV2CommandOutput }; 
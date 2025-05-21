import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: import.meta.env.VITE_AWS_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

export const listFolders = async (): Promise<string[]> => {
  const command = new ListObjectsV2Command({
    Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
    Delimiter: '/',
  });

  const response = await s3Client.send(command);
  return response.CommonPrefixes?.map(prefix => prefix.Prefix?.replace('/', '') || '') || [];
};

export const listObjectsInFolder = async (folderName: string): Promise<string[]> => {
  const command = new ListObjectsV2Command({
    Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
    Prefix: `${folderName}/`,
  });

  const response = await s3Client.send(command);
  return response.Contents?.map(object => object.Key || '') || [];
};

export const getSignedUrlForObject = async (key: string): Promise<string> => {
  const command = new GetObjectCommand({
    Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
};

export const listAllObjectsInFolder = async (folderName: string): Promise<string[]> => {
  let isTruncated = true;
  let continuationToken: string | undefined = undefined;
  const allKeys: string[] = [];

  while (isTruncated) {
    const command = new ListObjectsV2Command({
      Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
      Prefix: `${folderName}/`,
      ContinuationToken: continuationToken,
    });
    const response = await s3Client.send(command) as import('@aws-sdk/client-s3').ListObjectsV2CommandOutput;
    allKeys.push(...(response.Contents?.map((object: { Key?: string }) => object.Key || "") || []));
    isTruncated = response.IsTruncated ?? false;
    continuationToken = response.NextContinuationToken;
  }

  return allKeys;
}; 
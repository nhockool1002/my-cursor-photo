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

export const listAllObjectsV2 = async (params: {
  Bucket: string;
  Prefix?: string;
  Delimiter?: string;
}): Promise<string[]> => {
  let isTruncated = true;
  let continuationToken: string | undefined = undefined;
  const allKeys: string[] = [];

  while (isTruncated) {
    const { Delimiter, ...restParams } = params;
    const commandParams: {
      Bucket: string;
      Prefix?: string;
      ContinuationToken?: string;
    } = {
      ...restParams,
      ContinuationToken: continuationToken,
    };
    const command = new ListObjectsV2Command(commandParams);
    const response = await s3Client.send(command) as ListObjectsV2CommandOutput;
    allKeys.push(...(response.Contents?.map((obj: { Key?: string }) => obj.Key || "") || []));
    isTruncated = response.IsTruncated ?? false;
    continuationToken = response.NextContinuationToken;
  }

  console.log('Total keys:', allKeys.length);
  return allKeys;
};

export { s3Client };
export type { ListObjectsV2CommandOutput }; 
import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import FolderGrid from '@/components/FolderGrid';
import { listObjectsV2, ListObjectsV2CommandOutput } from '@/services/s3Client';
import { Folder } from '@/types';
import folderMapping from '@/data/folderMapping.json';

const HomePage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await listObjectsV2({
          Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
          Delimiter: '/',
        });

        if (response.CommonPrefixes) {
          const folderList = response.CommonPrefixes.map((prefix: { Prefix?: string }) => {
            const folderName = prefix.Prefix?.replace('/', '') || '';
            return {
              name: folderName,
              displayName: folderMapping[folderName] || folderName,
              thumbnailUrl: `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${folderName}/thumbnail.jpg`,
            };
          });

          setFolders(folderList);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Photo Cursor
      </Typography>
      <FolderGrid folders={folders} isLoading={isLoading} />
    </Container>
  );
};

export default HomePage; 
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MediaGrid from '@/components/MediaGrid';
import { listObjectsV2, ListObjectsV2CommandOutput } from '@/services/s3Client';
import { MediaItem } from '@/types';
import folderMapping from '@/data/folderMapping.json';

const FolderDetailPage = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (!folderName) return;

      try {
        const response = await listObjectsV2({
          Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
          Prefix: `${folderName}/`,
        });

        if (response.Contents) {
          const mediaItems = response.Contents
            .filter((item: { Key?: string }) => {
              const key = item.Key?.toLowerCase() || '';
              return (
                key.endsWith('.jpg') ||
                key.endsWith('.jpeg') ||
                key.endsWith('.png') ||
                key.endsWith('.heic') ||
                key.endsWith('.heif') ||
                key.endsWith('.mov') ||
                key.endsWith('.mp4')
              );
            })
            .map((item: { Key?: string }) => ({
              key: item.Key || '',
              url: `https://${import.meta.env.VITE_S3_BUCKET_NAME}.s3.${import.meta.env.VITE_AWS_REGION}.amazonaws.com/${item.Key}`,
            }));

          setItems(mediaItems);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [folderName]);

  const displayName = folderName ? folderMapping[folderName] || folderName : '';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        flexWrap: 'wrap',
        gap: 1,
        '@media (max-width:600px)': {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
        }
      }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ 
            mr: 2,
            '@media (max-width:600px)': {
              mr: 0,
              minWidth: 'auto',
              padding: '6px 8px',
            }
          }}
        >
          <Box component="span" sx={{ '@media (max-width:600px)': { display: 'none' } }}>
            Trở về
          </Box>
        </Button>
        <Typography 
          variant="h4" 
          component="h1"
          sx={{
            flex: 1,
            '@media (max-width:600px)': {
              textAlign: 'center',
              flex: 'none',
              maxWidth: 'calc(100% - 100px)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }
          }}
        >
          {displayName}
        </Typography>
      </Box>
      <MediaGrid items={items} isLoading={isLoading} />
    </Container>
  );
};

export default FolderDetailPage; 
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MediaGrid from '@/components/MediaGrid';
import { listObjectsV2 } from '@/services/s3Client';
import { MediaItem } from '@/types';
import folderMapping from '@/data/folderMapping.json';
import { getSignedUrlForObject } from '@/utils/s3Client';

const CACHE_EXPIRY_MS = 3000 * 1000; // 3000 giây

const FolderDetailPage = () => {
  const { folderName } = useParams<{ folderName: string }>();
  const navigate = useNavigate();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (!folderName) return;

      try {
        const cacheKey = `folderItems_${folderName}`;
        const cachedData = sessionStorage.getItem(cacheKey);

        if (cachedData) {
          const parsed = JSON.parse(cachedData);
          const isExpired = Date.now() - parsed.timestamp > CACHE_EXPIRY_MS;

          if (!isExpired) {
            setItems(parsed.data);
            setIsLoading(false);
            return;
          } else {
            sessionStorage.removeItem(cacheKey); // xóa cache hết hạn
          }
        }

        const response = await listObjectsV2({
          Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
          Prefix: `${folderName}/`,
        });

        const mediaItems: MediaItem[] = [];

        if (response.Contents) {
          for (const item of response.Contents) {
            const key = item.Key?.toLowerCase() || '';
            const isMedia = (
              key.endsWith('.jpg') ||
              key.endsWith('.jpeg') ||
              key.endsWith('.png') ||
              key.endsWith('.heic') ||
              key.endsWith('.heif') ||
              key.endsWith('.mov') ||
              key.endsWith('.mp4')
            );

            if (isMedia && item.Key) {
              const signedUrl = await getSignedUrlForObject(item.Key);
              mediaItems.push({
                key: item.Key,
                url: signedUrl,
              });
            }
          }
        }

        setItems(mediaItems);
        sessionStorage.setItem(cacheKey, JSON.stringify({
          data: mediaItems,
          timestamp: Date.now(),
        }));
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
      <Box
        sx={{
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
          },
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{
            mr: 2,
            '@media (max-width:600px)': {
              mr: 0,
              minWidth: 'auto',
              padding: '6px 8px',
            },
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
            },
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

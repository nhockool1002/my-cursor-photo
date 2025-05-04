import { useState, useEffect } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { listObjectsV2 } from '@/services/s3Client';
import { Folder } from '@/types';
import FolderSkeleton from './FolderSkeleton';
import { getSignedUrlForObject } from '@/utils/s3Client';

interface FolderGridProps {
  folders: Folder[];
  isLoading?: boolean;
}

const FolderGrid = ({ folders, isLoading = false }: FolderGridProps) => {
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchThumbnails = async () => {
      const cached = sessionStorage.getItem('folderThumbnails');
      let cachedThumbnails: Record<string, string> = {};

      if (cached) {
        cachedThumbnails = JSON.parse(cached);
      }

      const updatedThumbnails = { ...cachedThumbnails };

      for (const folder of folders) {
        if (!updatedThumbnails[folder.name]) {
          try {
            const response = await listObjectsV2({
              Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
              Prefix: `${folder.name}/`
            });

            if (response.Contents && response.Contents.length > 0) {
              const imageItem = response.Contents.find(item => {
                const key = item.Key?.toLowerCase() || '';
                return (
                  key.endsWith('.jpg') ||
                  key.endsWith('.jpeg') ||
                  key.endsWith('.png') ||
                  key.endsWith('.heic') ||
                  key.endsWith('.heif')
                );
              });

              if (imageItem?.Key) {
                const signedUrl = await getSignedUrlForObject(imageItem.Key);
                updatedThumbnails[folder.name] = signedUrl;
              }
            }
          } catch (error) {
            console.error(`Error fetching thumbnail for ${folder.name}:`, error);
          }
        }
      }

      setThumbnails(updatedThumbnails);
      sessionStorage.setItem('folderThumbnails', JSON.stringify(updatedThumbnails));
    };

    if (folders.length > 0) {
      fetchThumbnails();
    }
  }, [folders]);

  const handleImageLoad = (folderName: string) => {
    setLoadedImages(prev => ({ ...prev, [folderName]: true }));
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[...Array(6)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <FolderSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {folders.map((folder) => (
        <Grid item xs={12} sm={6} md={4} key={folder.name}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'scale(1.02)',
              },
            }}
            onClick={() => navigate(`/folder/${folder.name}`)}
          >
            <Box 
              sx={{ 
                position: 'relative', 
                width: '100%', 
                height: '300px',
                overflow: 'hidden'
              }}
            >
              {!loadedImages[folder.name] && <FolderSkeleton />}
              <CardMedia
                component="img"
                image={thumbnails[folder.name] || '/placeholder.jpg'}
                alt={folder.displayName}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: loadedImages[folder.name] ? 'block' : 'none'
                }}
                onLoad={() => handleImageLoad(folder.name)}
              />
            </Box>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {folder.displayName}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default FolderGrid;

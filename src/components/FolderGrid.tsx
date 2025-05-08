import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import { listObjectsV2 } from '@/services/s3Client';
import { Folder } from '@/types';
import FolderSkeleton from './FolderSkeleton';
import { getSignedUrlForObject } from '@/utils/s3Client';
import { rotationService } from '@/services/rotationService';

interface FolderGridProps {
  folders: Folder[];
  isLoading?: boolean;
}

const FolderGrid = ({ folders, isLoading = false }: FolderGridProps) => {
  const navigate = useNavigate();
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const [thumbnailKeys, setThumbnailKeys] = useState<Record<string, string>>({});
  const [rotations, setRotations] = useState<Record<string, number>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchThumbnails = async () => {
      const updatedThumbnails: Record<string, string> = {};
      const updatedThumbnailKeys: Record<string, string> = {};
      const updatedRotations: Record<string, number> = {};

      for (const folder of folders) {
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
              const key = imageItem.Key;
              const url = await getSignedUrlForObject(key);
              updatedThumbnails[folder.name] = url;
              updatedThumbnailKeys[folder.name] = key;
              updatedRotations[key] = rotationService.getRotation(key);
            }
          }
        } catch (error) {
          console.error(`Error fetching thumbnail for ${folder.name}:`, error);
        }
      }

      setThumbnails(updatedThumbnails);
      setThumbnailKeys(updatedThumbnailKeys);
      setRotations(updatedRotations);
    };

    if (folders.length > 0) {
      fetchThumbnails();
    }
  }, [folders]);

  const handleImageLoad = (folderName: string) => {
    setLoadedImages(prev => ({ ...prev, [folderName]: true }));
  };

  const handleRotate = (key: string) => {
    const newRotation = ((rotations[key] || 0) + 90) % 360;
    setRotations(prev => ({ ...prev, [key]: newRotation }));
    rotationService.setRotation(key, newRotation);
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
      {folders.map((folder) => {
        const key = thumbnailKeys[folder.name];
        const rotation = key ? rotations[key] || 0 : 0;

        return (
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
                {key && (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRotate(key);
                    }}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      zIndex: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.7)',
                      },
                    }}
                  >
                    <RotateRightIcon />
                  </IconButton>
                )}

                {!loadedImages[folder.name] && <FolderSkeleton />}

                <CardMedia
                  component="img"
                  image={thumbnails[folder.name] || '/placeholder.jpg'}
                  alt={folder.displayName}
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transform: `rotate(${rotation}deg) scale(1.5)`,
                    transformOrigin: 'center',
                    transition: 'transform 0.3s',
                    display: loadedImages[folder.name] ? 'block' : 'none',
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
        );
      })}
    </Grid>
  );
};

export default FolderGrid;

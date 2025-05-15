import { useState, useEffect, useRef } from 'react';
import { Card, CardMedia, Modal, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { MediaItem } from '@/types';
import { favoriteService } from '@/services/favoriteService';
import { rotationService } from '@/services/rotationService';
import { thumbnailService } from '@/services/thumbnailService';

interface MediaCardProps {
  item: MediaItem;
  onPrev?: () => void;
  onNext?: () => void;
  onOpen?: () => void;
  isCurrent?: boolean;
  onToggleFavorite?: (photoId: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({
  item,
  onPrev,
  onNext,
  onOpen,
  isCurrent = false,
  onToggleFavorite,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isThumbnail, setIsThumbnail] = useState(false);
  const [rotation, setRotation] = useState(rotationService.getRotation(item.key));
  const [modalRotation, setModalRotation] = useState(rotationService.getRotation(item.key));
  const isVideo = item.key.toLowerCase().endsWith('.mov') || item.key.toLowerCase().endsWith('.mp4');
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const folderName = item.key.split('/')[0]; // Extract folder name from key

  // Update isThumbnail state
  const updateThumbnailState = () => {
    const savedThumbnail = thumbnailService.getThumbnail(folderName);
    setIsThumbnail(savedThumbnail?.key === item.key);
  };

  useEffect(() => {
    // Initial check
    updateThumbnailState();
    // Subscribe to thumbnail changes
    const unsubscribe = thumbnailService.subscribe(folderName, updateThumbnailState);
    // Cleanup on unmount
    return () => unsubscribe();
  }, [item.key, folderName]);

  const handleRotateInModal = () => {
    const newRotation = (modalRotation + 90) % 360;
    setModalRotation(newRotation);
    setRotation(newRotation);
    rotationService.setRotation(item.key, newRotation);
  };

  useEffect(() => {
    setIsFavorite(favoriteService.isFavorite(item.key));
  }, [item.key]);

  const handleOpen = () => {
    if (onOpen) {
      onOpen();
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      favoriteService.removeFavorite(item.key);
      if (onToggleFavorite) {
        onToggleFavorite(item.key);
      }
    } else {
      favoriteService.addFavorite({
        id: item.key,
        url: item.url,
        title: item.key.split('/').pop() || '',
        createdAt: new Date().toISOString(),
      });
    }
    setIsFavorite(!isFavorite);
  };

  const handleToggleThumbnail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isThumbnail) {
      thumbnailService.removeThumbnail(folderName);
    } else {
      thumbnailService.setThumbnail(folderName, item.key);
    }
    // updateThumbnailState will be called via the subscriber
  };

  useEffect(() => {
    if (isVideo && videoRef.current) {
      videoRef.current.load();
    }
  }, [isVideo, item.url]);

  const handleImageLoad = () => {
    setIsThumbnailLoaded(true);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPrev) {
      handleClose();
      onPrev();
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onNext) {
      handleClose();
      onNext();
    }
  };

  const handleRotate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    setModalRotation(newRotation);
    rotationService.setRotation(item.key, newRotation);
  };

  useEffect(() => {
    if (isCurrent) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isCurrent]);

  return (
    <>
      <Card
        sx={{
          height: '100%',
          cursor: 'pointer',
          position: 'relative',
          '&:hover .media-overlay': {
            opacity: 1,
          },
        }}
        onClick={handleOpen}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '100%',
            overflow: 'hidden',
          }}
        >
          {!isThumbnailLoaded && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'loading 1.5s infinite',
                  '@keyframes loading': {
                    '0%': { backgroundPosition: '200% 0' },
                    '100%': { backgroundPosition: '-200% 0' },
                  },
                }}
              />
            </Box>
          )}

          {isVideo ? (
            <video
              ref={videoRef}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onLoadedData={handleImageLoad}
            >
              <source src={item.url} type="video/mp4" />
            </video>
          ) : (
            <CardMedia
              component="img"
              image={item.url}
              alt={item.key}
              ref={imgRef}
              onLoad={handleImageLoad}
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `rotate(${rotation}deg)`,
                transition: 'transform 0.3s',
              }}
            />
          )}

          {isVideo && (
            <IconButton
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                zIndex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }}
            >
              <PlayArrowIcon fontSize="large" />
            </IconButton>
          )}

          {!isVideo && (
            <>
              <IconButton
                onClick={handleRotate}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 98,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <RotateRightIcon />
              </IconButton>
              <IconButton
                onClick={handleToggleThumbnail}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 53,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: isThumbnail ? 'warning.main' : 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                {isThumbnail ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </>
          )}

          <IconButton
            onClick={handleToggleFavorite}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: isFavorite ? 'error.main' : 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Card>

      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: isMobile ? '95%' : '90%',
            maxWidth: '1200px',
            maxHeight: '90vh',
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 1,
            overflow: 'hidden',
          }}
        >
          {isVideo ? (
            <video
              controls
              autoPlay
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
              }}
            >
              <source src={item.url} type="video/mp4" />
            </video>
          ) : (
            <img
              src={item.url}
              alt={item.key}
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '90vh',
                objectFit: 'contain',
                transform: `rotate(${modalRotation}deg)`,
                transition: 'transform 0.3s',
              }}
            />
          )}

          <IconButton
            sx={{
              position: 'absolute',
              left: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
            onClick={handlePrev}
          >
            <NavigateBeforeIcon fontSize={isMobile ? 'medium' : 'large'} />
          </IconButton>

          <IconButton
            sx={{
              position: 'absolute',
              right: 16,
              top: '50%',
              transform: 'translateY(-50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
            onClick={handleNext}
          >
            <NavigateNextIcon fontSize={isMobile ? 'medium' : 'large'} />
          </IconButton>

          {!isVideo && (
            <>
              <IconButton
                onClick={handleRotateInModal}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 130,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                <RotateRightIcon />
              </IconButton>
              <IconButton
                onClick={handleToggleThumbnail}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 74,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: isThumbnail ? 'warning.main' : 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                  },
                }}
              >
                {isThumbnail ? <StarIcon /> : <StarBorderIcon />}
              </IconButton>
            </>
          )}

          <IconButton
            onClick={handleToggleFavorite}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: isFavorite ? 'error.main' : 'white',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
              },
            }}
          >
            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </Box>
      </Modal>
    </>
  );
};

export default MediaCard;
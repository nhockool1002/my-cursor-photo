import { useState, useEffect, useRef } from 'react';
import { Card, CardMedia, Modal, Box, IconButton, useTheme, useMediaQuery } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { MediaItem } from '@/types';
import { favoriteService } from '@/services/favoriteService';

interface MediaCardProps {
  item: MediaItem;
  onPrev?: () => void;
  onNext?: () => void;
  onOpen?: () => void;
  isCurrent?: boolean;
  onToggleFavorite?: (photoId: string) => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onPrev, onNext, onOpen, isCurrent = false, onToggleFavorite }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [open, setOpen] = useState(false);
  const [isThumbnailLoaded, setIsThumbnailLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const isVideo = item.key.toLowerCase().endsWith('.mov') || item.key.toLowerCase().endsWith('.mp4');
  const videoRef = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

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
        createdAt: new Date().toISOString()
      });
    }
    setIsFavorite(!isFavorite);
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
              }}
            />
          )}
          <Box
            className="media-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              opacity: 0,
              transition: 'opacity 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isVideo && (
              <PlayArrowIcon sx={{ fontSize: isMobile ? 32 : 48, color: 'white' }} />
            )}
          </Box>
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
            <NavigateBeforeIcon fontSize={isMobile ? "medium" : "large"} />
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
            <NavigateNextIcon fontSize={isMobile ? "medium" : "large"} />
          </IconButton>
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
import { useEffect, useState } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Photo } from '../types/photo';
import { loadImageWithOrientation } from '@/utils/loadImageWithCorrectOrientation';

interface PhotoCardProps {
  photo: Photo;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const PhotoCard = ({ photo, isFavorite, onToggleFavorite }: PhotoCardProps) => {
  const [displayUrl, setDisplayUrl] = useState(photo.url);

  useEffect(() => {
    loadImageWithOrientation(photo.url).then(setDisplayUrl);
  }, [photo.url]);

  
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={photo.url}
        alt={photo.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, position: 'relative' }}>
        <Typography gutterBottom variant="h6" component="div">
          {photo.title}
        </Typography>
        {photo.description && (
          <Typography variant="body2" color="text.secondary">
            {photo.description}
          </Typography>
        )}
        <IconButton
          onClick={onToggleFavorite}
          sx={{ position: 'absolute', top: 8, right: 8 }}
          color={isFavorite ? 'error' : 'default'}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardContent>
    </Card>
  );
}; 
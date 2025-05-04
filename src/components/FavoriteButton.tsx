import { IconButton, Tooltip } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useNavigate } from 'react-router-dom';

const FavoriteButton = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Ảnh yêu thích">
      <IconButton
        onClick={() => navigate('/favorite')}
        color="inherit"
        sx={{
          position: 'fixed',
          top: 16,
          right: 80,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
          '@media (max-width:600px)': {
            top: 12,
            right: 60,
            padding: '6px',
          }
        }}
      >
        <FavoriteIcon />
      </IconButton>
    </Tooltip>
  );
};

export default FavoriteButton; 
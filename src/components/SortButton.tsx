import { IconButton, Tooltip } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import { useNavigate } from 'react-router-dom';

const SortButton = () => {
  const navigate = useNavigate();

  return (
    <Tooltip title="Sắp xếp thư mục">
      <IconButton
        onClick={() => navigate('/sort')}
        color="inherit"
        sx={{
          position: 'fixed',
          top: 16,
          right: 140,
          zIndex: 1000,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
          },
          '@media (max-width:600px)': {
            top: 12,
            right: 120,
            padding: '6px',
          }
        }}
      >
        <SortIcon />
      </IconButton>
    </Tooltip>
  );
};

export default SortButton; 
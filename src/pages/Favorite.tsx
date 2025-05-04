import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import MediaGrid from '@/components/MediaGrid';
import { MediaItem } from '@/types';
import { favoriteService } from '@/services/favoriteService';

const Favorite: React.FC = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<MediaItem[]>([]);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);

  useEffect(() => {
    const favorites = favoriteService.getFavorites();
    setFavorites(favorites.map(photo => ({
      key: photo.id,
      url: photo.url,
      isFavorite: true
    })));
  }, []);

  const handleRemoveFavorite = (photoId: string) => {
    favoriteService.removeFavorite(photoId);
    setFavorites(prevItems => prevItems.filter(item => item.key !== photoId));
  };

  const handleOpenConfirmDialog = () => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };

  const handleDeleteAll = () => {
    favoriteService.clearFavorites();
    setFavorites([]);
    handleCloseConfirmDialog();
  };

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
          Ảnh yêu thích
        </Typography>
        {favorites.length > 0 && (
          <Button
            startIcon={<DeleteIcon />}
            onClick={handleOpenConfirmDialog}
            color="error"
            sx={{
              '@media (max-width:600px)': {
                minWidth: 'auto',
                padding: '6px 8px',
              }
            }}
          >
            Xoá tất cả
          </Button>
        )}
      </Box>
      {favorites.length === 0 ? (
        <Typography variant="h6" textAlign="center" color="text.secondary">
          Chưa có ảnh yêu thích nào
        </Typography>
      ) : (
        <MediaGrid 
          items={favorites} 
          onToggleFavorite={handleRemoveFavorite}
        />
      )}

      <Dialog
        open={openConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận xoá
        </DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xoá tất cả ảnh yêu thích? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog}>Huỷ</Button>
          <Button onClick={handleDeleteAll} color="error" autoFocus>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Favorite; 
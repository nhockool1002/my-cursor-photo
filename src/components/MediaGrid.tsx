import { useState, useEffect } from 'react';
import { Grid, Pagination, Box, useTheme, useMediaQuery, TextField } from '@mui/material';
import { MediaItem } from '@/types';
import MediaCard from '@/components/MediaCard';
import MediaSkeleton from './MediaSkeleton';

interface MediaGridProps {
  items: MediaItem[];
  isLoading?: boolean;
  onToggleFavorite?: (photoId: string) => void;
}

// Custom hook for debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const MediaGrid = ({ items, isLoading = false, onToggleFavorite }: MediaGridProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.down('lg'));

  const getItemsPerPage = () => {
    if (isMobile) return 12; // 1 column
    if (isTablet) return 24; // 2 columns
    if (isDesktop) return 24; // 3 columns
    return 48; // 4 columns
  };

  const ITEMS_PER_PAGE = getItemsPerPage();
  const [page, setPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = items.slice(startIndex, endIndex);
  const [inputPage, setInputPage] = useState('');
  const debouncedInputPage = useDebounce(inputPage, 500); // 500ms delay

  useEffect(() => {
    const pageNumber = parseInt(debouncedInputPage);
    if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
      setPage(pageNumber);
      setCurrentIndex(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [debouncedInputPage, totalPages]);

  const handlePrev = () => {
    if (currentIndex === null) return;
    
    const newIndex = currentIndex - 1;
    if (newIndex >= 0) {
      if (newIndex < startIndex) {
        // Chuyển về trang trước
        const newPage = page - 1;
        setPage(newPage);
        // Đặt currentIndex vào cuối trang trước
        const newStartIndex = (newPage - 1) * ITEMS_PER_PAGE;
        setCurrentIndex(newStartIndex + ITEMS_PER_PAGE - 1);
      } else {
        setCurrentIndex(newIndex);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex === null) return;
    
    const newIndex = currentIndex + 1;
    if (newIndex < items.length) {
      if (newIndex >= endIndex) {
        // Chuyển sang trang sau
        const newPage = page + 1;
        setPage(newPage);
        // Đặt currentIndex vào đầu trang sau
        const newStartIndex = (newPage - 1) * ITEMS_PER_PAGE;
        setCurrentIndex(newStartIndex);
      } else {
        setCurrentIndex(newIndex);
      }
    }
  };

  const handleOpen = (index: number) => {
    setCurrentIndex(startIndex + index);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    setInputPage(value.toString());
    setCurrentIndex(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputPageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInputPage(value);
  };

  if (isLoading) {
    return (
      <Box>
        <Grid container spacing={2}>
          {[...Array(ITEMS_PER_PAGE)].map((_, index) => (
            <Grid 
              component="div"
              sx={{ 
                width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
                padding: '8px'
              }} 
              key={index}
            >
              <MediaSkeleton variant="grid" />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {currentItems.map((item, index) => (
          <Grid 
            component="div"
            sx={{ 
              width: { xs: '100%', sm: '50%', md: '33.33%', lg: '25%' },
              padding: '8px'
            }} 
            key={item.key}
          >
            <MediaCard 
              item={item} 
              onPrev={handlePrev}
              onNext={handleNext}
              onOpen={() => handleOpen(index)}
              isCurrent={currentIndex === startIndex + index}
              onToggleFavorite={onToggleFavorite}
            />
          </Grid>
        ))}
      </Grid>
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 4, gap: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
          />
          <TextField
            size="small"
            value={inputPage}
            onChange={handleInputPageChange}
            placeholder={`1-${totalPages}`}
            sx={{ width: '80px' }}
            inputProps={{
              min: 1,
              max: totalPages,
              type: 'number'
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default MediaGrid; 
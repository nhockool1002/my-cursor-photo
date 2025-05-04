import { Skeleton, Box } from '@mui/material';

interface MediaSkeletonProps {
  variant?: 'card' | 'grid';
}

const MediaSkeleton = ({ variant = 'card' }: MediaSkeletonProps) => {
  if (variant === 'card') {
    return (
      <Box sx={{ width: '100%', height: 200 }}>
        <Skeleton variant="rectangular" width="100%" height={200} />
        <Skeleton width="60%" height={24} sx={{ mt: 1 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <Skeleton variant="rectangular" width="100%" height={200} />
    </Box>
  );
};

export default MediaSkeleton; 
import { Skeleton, Card, CardContent } from '@mui/material';

const FolderSkeleton = () => {
  return (
    <Card sx={{ height: '100%' }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height="300px"
      />
      <CardContent>
        <Skeleton variant="text" width="80%" height={40} />
      </CardContent>
    </Card>
  );
};

export default FolderSkeleton; 
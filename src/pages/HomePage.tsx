import { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import FolderGrid from '@/components/FolderGrid';
import { listObjectsV2 } from '@/services/s3Client';
import { Folder } from '@/types';
import { getSignedUrlForObject } from '@/utils/s3Client';
import folderMapping from '@/data/folderMapping.json';

const HomePage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await listObjectsV2({
          Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
          Delimiter: '/',
        });

        if (response.CommonPrefixes) {
          const folderList: Folder[] = [];

          for (const prefix of response.CommonPrefixes) {
            const folderName = prefix.Prefix?.replace('/', '') || '';
            const displayName = folderMapping[folderName] || folderName;

            let thumbnailUrl = '';
            try {
              // Tạo pre-signed URL cho thumbnail.jpg trong thư mục
              thumbnailUrl = await getSignedUrlForObject(`${folderName}/thumbnail.jpg`);
            } catch (e) {
              // Nếu thumbnail không tồn tại, giữ trống, sẽ fallback về placeholder.jpg
              console.warn(`Thumbnail not found for ${folderName}`);
            }

            folderList.push({
              name: folderName,
              displayName,
              thumbnailUrl,
            });
          }

          // Lấy thứ tự sắp xếp từ localStorage nếu có
          const savedOrder = localStorage.getItem('sortListFolder');
          if (savedOrder) {
            const orderArray = JSON.parse(savedOrder);
            // Sắp xếp folders theo thứ tự đã lưu
            folderList.sort((a: Folder, b: Folder) => {
              const indexA = orderArray.indexOf(a.name);
              const indexB = orderArray.indexOf(b.name);
              if (indexA === -1) return 1;
              if (indexB === -1) return -1;
              return indexA - indexB;
            });
          }

          setFolders(folderList);
        }
      } catch (error) {
        console.error('Error fetching folders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFolders();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        My Photo Cursor
      </Typography>
      <FolderGrid folders={folders} isLoading={isLoading} />
    </Container>
  );
};

export default HomePage;

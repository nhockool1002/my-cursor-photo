import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, List, ListItem, ListItemText, ButtonGroup } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import SortByAlphaIconOutlined from '@mui/icons-material/SortByAlphaOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { DragDropContext, Droppable, Draggable, DropResult, DroppableProvided, DraggableProvided } from '@hello-pangea/dnd';
import { listObjectsV2 } from '@/services/s3Client';
import { Folder } from '@/types';
import { getSignedUrlForObject } from '@/utils/s3Client';
import folderMapping from '@/data/folderMapping.json';

const SortPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [sortOrder, setSortOrder] = useState<'custom' | 'asc' | 'desc'>('custom');
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);

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
            setOriginalOrder(orderArray);
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
      }
    };

    fetchFolders();
  }, []);

  const handleSort = (order: 'asc' | 'desc') => {
    const sortedFolders = [...folders].sort((a, b) => {
      const nameA = a.displayName || a.name;
      const nameB = b.displayName || b.name;
      return order === 'asc' 
        ? nameA.localeCompare(nameB, 'vi')
        : nameB.localeCompare(nameA, 'vi');
    });
    setFolders(sortedFolders);
    setSortOrder(order);
    // Lưu thứ tự mới vào localStorage
    localStorage.setItem('sortListFolder', JSON.stringify(sortedFolders.map(folder => folder.name)));
  };

  const handleReset = () => {
    // Xóa sortListFolder khỏi localStorage
    localStorage.removeItem('sortListFolder');
    
    // Sắp xếp lại theo tên thư mục gốc
    const resetFolders = [...folders].sort((a, b) => {
      return a.name.localeCompare(b.name, 'vi');
    });
    
    setFolders(resetFolders);
    setSortOrder('custom');
    setOriginalOrder([]);
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(folders);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setFolders(items);
    setSortOrder('custom');
    // Lưu thứ tự mới vào localStorage
    localStorage.setItem('sortListFolder', JSON.stringify(items.map(folder => folder.name)));
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
          Sắp xếp thư mục
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button
            onClick={() => handleSort('asc')}
            startIcon={<SortByAlphaIcon />}
            sx={{
              minWidth: '100px',
              justifyContent: 'flex-start',
              '& .MuiButton-startIcon': {
                marginRight: 1
              },
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                transform: 'translateY(-1px)',
                boxShadow: 1
              }
            }}
          >
            A-Z
          </Button>
          <Button
            onClick={() => handleSort('desc')}
            startIcon={<SortByAlphaIconOutlined />}
            sx={{
              minWidth: '100px',
              justifyContent: 'flex-start',
              '& .MuiButton-startIcon': {
                marginRight: 1
              },
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                transform: 'translateY(-1px)',
                boxShadow: 1
              }
            }}
          >
            Z-A
          </Button>
          <Button
            onClick={handleReset}
            startIcon={<RestartAltIcon />}
            sx={{
              minWidth: '100px',
              justifyContent: 'flex-start',
              '& .MuiButton-startIcon': {
                marginRight: 1
              },
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                transform: 'translateY(-1px)',
                boxShadow: 1
              }
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
      </Box>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="folders">
          {(provided: DroppableProvided) => (
            <List
              {...provided.droppableProps}
              ref={provided.innerRef}
              sx={{
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1,
              }}
            >
              {folders.map((folder, index) => (
                <Draggable key={folder.name} draggableId={folder.name} index={index}>
                  {(provided: DraggableProvided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                      }}
                    >
                      <ListItemText primary={folder.displayName || folder.name} />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default SortPage; 
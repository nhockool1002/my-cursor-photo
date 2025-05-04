# My Photo Cursor

Ứng dụng web tĩnh để hiển thị ảnh và video từ Amazon S3 bucket.

## Tính năng

- Hiển thị danh sách thư mục từ S3 bucket
- Xem nội dung từng thư mục
- Hỗ trợ hiển thị ảnh và video
- Lightbox viewer cho ảnh
- Phân trang
- Responsive design
- Hỗ trợ định dạng HEIC/HEIF
- Mapping tên thư mục sang tên hiển thị thông qua JSON

## Cài đặt

### Yêu cầu

- Node.js (v18 trở lên)
- Yarn
- AWS credentials với quyền truy cập S3 bucket

### Các bước cài đặt

1. Clone repository:
```bash
git clone https://github.com/your-username/my-photo-cursor.git
cd my-photo-cursor
```

2. Cài đặt dependencies:
```bash
yarn install
```

3. Tạo file `.env` với nội dung sau:
```
VITE_AWS_ACCESS_KEY_ID=your_access_key_id
VITE_AWS_SECRET_ACCESS_KEY=your_secret_access_key
VITE_AWS_REGION=your_region
VITE_S3_BUCKET_NAME=your_bucket_name
```

4. Chạy ứng dụng:
```bash
yarn dev
```

5. Truy cập ứng dụng:
- Mở trình duyệt và truy cập `http://localhost:5173`
- Bạn sẽ thấy danh sách các thư mục từ S3 bucket
- Click vào một thư mục để xem nội dung bên trong
- Click vào ảnh/video để xem ở chế độ fullscreen

## Cấu trúc dự án

```
my-photo-cursor/
├── src/
│   ├── components/
│   │   ├── FolderGrid.tsx
│   │   ├── MediaCard.tsx
│   │   └── MediaGrid.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   └── FolderDetailPage.tsx
│   ├── services/
│   │   └── s3Client.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── heicConverter.ts
│   ├── App.tsx
│   └── main.tsx
├── public/
│   └── folderMapping.json
├── .env
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Công nghệ sử dụng

- React + TypeScript
- Vite
- Material-UI
- AWS SDK v3
- React Router
- Yarn

## Lưu ý

- Đảm bảo AWS credentials có quyền truy cập S3 bucket
- Các thư mục phải chứa ít nhất một ảnh để có thể hiển thị thumbnail
- File `folderMapping.json` phải được cập nhật khi thêm/xóa thư mục

## Bảo mật

- Không commit file `.env` vào repository
- Sử dụng AWS IAM roles với quyền tối thiểu cần thiết
- Đảm bảo S3 bucket có cấu hình CORS phù hợp

## Tối ưu hóa

- Sử dụng lazy loading cho ảnh
- Nén ảnh trước khi upload lên S3
- Sử dụng CDN cho nội dung tĩnh
- Implement caching ở client-side

## Đóng góp

1. Fork repository
2. Tạo branch mới (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add some amazing feature'`)
4. Push lên branch (`git push origin feature/amazing-feature`)
5. Tạo Pull Request

## Giấy phép

MIT

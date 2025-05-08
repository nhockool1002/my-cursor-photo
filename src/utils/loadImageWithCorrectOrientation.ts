import EXIF from 'exif-js';

/**
 * Load image from a URL and return a corrected data URL if EXIF orientation is set.
 * Works with JPEG images only.
 */
export const loadImageWithOrientation = (url: string): Promise<string> =>
  new Promise((resolve) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const reader = new FileReader();

        reader.onload = function (e) {
          const img = new Image();

          img.onload = function () {
            // @ts-ignore: exif-js lacks proper type definitions
            EXIF.getData(img, function (this: any) {
              const orientation = EXIF.getTag(this, 'Orientation') || 1;

              const canvas = document.createElement('canvas');
              const ctx = canvas.getContext('2d')!;
              const width = img.width;
              const height = img.height;

              // Set canvas dimensions depending on orientation
              if (orientation > 4) {
                canvas.width = height;
                canvas.height = width;
              } else {
                canvas.width = width;
                canvas.height = height;
              }

              // Apply the transform for each orientation value
              switch (orientation) {
                case 2: ctx.transform(-1, 0, 0, 1, width, 0); break; // flip horizontal
                case 3: ctx.transform(-1, 0, 0, -1, width, height); break; // rotate 180
                case 4: ctx.transform(1, 0, 0, -1, 0, height); break; // flip vertical
                case 5: ctx.transform(0, 1, 1, 0, 0, 0); break; // transpose
                case 6: ctx.transform(0, 1, -1, 0, height, 0); break; // rotate 90
                case 7: ctx.transform(0, -1, -1, 0, height, width); break; // transverse
                case 8: ctx.transform(0, -1, 1, 0, 0, width); break; // rotate -90
                default: break;
              }

              ctx.drawImage(img, 0, 0);
              resolve(canvas.toDataURL());
            });
          };

          img.src = reader.result as string;
        };

        reader.readAsDataURL(blob);
      });
  });

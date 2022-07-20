export const getUploadedFileDimensions = (url) =>
  new Promise((resolve, reject) => {
    try {
      let image = new Image();

      image.onload = () => {
        const width = image.naturalWidth,
          height = image.naturalHeight;
        return resolve({ width, height });
      };

      image.src = url;
    } catch (exception) {
      return reject(exception);
    }
  });

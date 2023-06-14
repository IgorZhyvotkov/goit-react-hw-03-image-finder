import { Component } from 'react';

import ImageGalleryItem from 'components/ImageGalleryItem';
import { ImageGallerySt } from './ImageGallery.styled';

class ImageGallery extends Component {
  render() {
    return (
      <ImageGallerySt>
        {this.props.findingImg.map(({ id, webformatURL, largeImageURL }) => {
          return (
            <ImageGalleryItem
              key={id}
              webformatURL={webformatURL}
              largeImageURL={largeImageURL}
            />
          );
        })}
      </ImageGallerySt>
    );
  }
}

export default ImageGallery;

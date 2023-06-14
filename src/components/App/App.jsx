import { Component } from 'react';
import { Container } from './App.styled';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ColorRing } from 'react-loader-spinner';
import { getImages } from 'api';

import Searchbar from 'components/Searchbar/Searchbar';
import ImageGallery from 'components/ImageGallery';
import Button from 'components/Button';

const STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

class App extends Component {
  state = {
    searchValue: '',
    findingImg: [],
    status: STATUS.IDLE,
    page: 1,
    error: null,
    totalPages: 0,
    per_page: 12,
  };

  async componentDidUpdate(_, prevState) {
    const { page, searchValue, findingImg, per_page } = this.state;

    if (prevState.searchValue !== searchValue || prevState.page !== page) {
      try {
        this.setState({ status: STATUS.PENDING });

        const images = await getImages({ searchValue, page, per_page });

        if (!images.hits.length) {
          throw new Error('No matches found');
        }
        this.setState({
          findingImg: [...findingImg, ...images.hits],
          totalPages: Math.ceil(images.totalHits / per_page),
          status: STATUS.RESOLVED,
          error: null,
        });
      } catch (error) {
        this.setState({ error: error.message, status: STATUS.REJECTED });
        toast.error(error.message);
      }
    }
  }

  onSearchSubmit = inputValue => {
    this.setState({ searchValue: inputValue, page: 1, findingImg: [] });
  };

  loadMore = () => {
    this.setState(prevState => ({ page: prevState.page + 1 }));
  };

  render() {
    const { findingImg, totalPages, status, page, searchValue } = this.state;
    const showBtn = findingImg.length !== 0 && page < totalPages;

    if (status === STATUS.IDLE) {
      return (
        <Container>
          <Searchbar onSubmit={this.onSearchSubmit} />
          <ToastContainer autoClose={1500} />
        </Container>
      );
    }

    if (status === STATUS.PENDING) {
      return (
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />
      );
    }

    if (status === STATUS.RESOLVED) {
      return (
        <Container>
          <Searchbar onSubmit={this.onSearchSubmit} />
          <ImageGallery searchValue={searchValue} findingImg={findingImg} />
          {showBtn && <Button onBtnClick={this.loadMore} />}
          <ToastContainer autoClose={1500} />
        </Container>
      );
    }

    if (status === STATUS.REJECTED) {
      return (
        <Container>
          <Searchbar onSubmit={this.onSearchSubmit} />
          <ToastContainer autoClose={1500} />
        </Container>
      );
    }
  }
}

export default App;

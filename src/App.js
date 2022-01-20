import { useEffect, useState, useRef} from 'react';
import './App.css';

function App() {
  const [ albums, setAlbums ] = useState([]);
  const [ playListId, setPlayListId] = useState(null);
  const [ carouselIndex, setCarouselIndex] = useState(0);
  const [ tracks, setTracks ] = useState([]);

  const baseURL = 'http://demo.subsonic.org/rest/';

  const generateUrl = (route, query) => {
    return `${baseURL}${route}?${query}`
  }
  const apiAuthQuery = 'u=guest&p=guest&v=1.16.1&c=myapp12&f=json';

  useEffect(async() => {
    let albumsResponse = [];
    await fetch(generateUrl('getAlbumList2', `${apiAuthQuery}&type=recent`))
      .then((res) => {
        return res.json()
      })
      .then(data => {
        albumsResponse = data["subsonic-response"].albumList2.album;
      });

    setAlbums(albumsResponse);
  }, []);

  useEffect(() => {
    if (albums.length > 0) {
      setPlayListId(albums[carouselIndex].id);
    }
  }, [playListId, albums, carouselIndex]);

  useEffect(async () => {
    let songsResponse;
    await fetch(generateUrl('getAlbum', `${apiAuthQuery}&type=recent&id=${playListId}`))
      .then(res => {
        return res.json();
      })
      .then(data => {
        if (data["subsonic-response"].album) {
          songsResponse = data["subsonic-response"].album.song
        }
      });
      if (songsResponse) {
        setTracks(songsResponse);
      }
  }, [playListId]);


  const handleCarousel = (isLeftArrow) => {
    if (isLeftArrow) {
      if (carouselIndex !== 0) {
        setCarouselIndex(carouselIndex - 1);
      }
    } else {
      if (albums.length > (carouselIndex + 1)) {
        setCarouselIndex(carouselIndex + 1)
      }
    }
  }
  
  const carouselRef = useRef(null);

  const handleCarouselPosition = () => {
    if (carouselRef.current) {
      return ((carouselRef.current.offsetWidth / 2) - ((carouselIndex + 1) * 100));
    }
  };

  return (
    <div className="App">
      <div className="carousel">
        <button onClick={() => handleCarousel(true)}>&lArr;</button>
        <div className="carousel-container">
          <div className="carousel-inner-container" ref={carouselRef} style={{left: handleCarouselPosition()}}>
            {albums.map((album, index)=> {
              return (
                <div
                  key={album.id}
                  style={{
                    borderColor: index === carouselIndex ? "black" : "grey",
                    backgroundImage: `url(${generateUrl('getCoverArt', `${apiAuthQuery}&type=recent&id=${album.id}`)})`
                  }}
                  className="album-cover"
                />
              )
            })}
          </div>
        </div>
        <button onClick={() => handleCarousel(false)}>&rArr;</button>
      </div>
      {/* <h1>{selectedAlbum && selectedAlbum.name}</h1> */}
      <table className="playList" border="1" cellSpacing="0">
        <tbody>
          <tr>
            <td width="20%">#</td>
            <td width="80%">track</td>
          </tr>
          {tracks.map((track, index) => {
            return(
              <tr key={track.id}>
                <td>{index + 1}</td>
                <td>{track.title}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  );
}

export default App;

import { useEffect, useState, useCallback, useRef} from 'react';
import './App.css';

function App() {
  const [ albums, setAlbums ] = useState([]);
  const [ playListId, setplayListId] = useState(null);
  const [ tracks, setTracks ] = useState([]);
  const [ carouselIndex, setCarouselIndex] = useState(0);
  const [ carouselWidth, setCarouselWidth ] = useState(0);

  const baseURL = 'http://demo.subsonic.org/rest/getAlbumList2?u=guest&p=guest&v=1.16.1&c=myapp12&f=json'

  useEffect(async() => {
    let albumsResponse = [];
    await fetch(`${baseURL}&type=recent`)
    .then((res) => {
      return res.json()
    })
    .then(data => {
      albumsResponse = data["subsonic-response"].albumList2.album;
    })
 
    if (albumsResponse.length > 0) {
      setAlbums(albumsResponse);
      if(!playListId) {
        setplayListId(albumsResponse[0].id);
      }
      let tracksResponse = [];
      await fetch(`http://demo.subsonic.org/rest/getAlbum?u=guest&p=guest&v=1.16.1&c=myapp12&type=recent&f=json&id=${playListId}`)
        .then(res => {
          return res.json();
        })
        .then(data => {
          if (data["subsonic-response"].album) {
            tracksResponse = data["subsonic-response"].album.song
          }
        })
      
      setTracks(tracksResponse);
    }
  }, [playListId, setAlbums]);

  

  const selectedAlbum = useCallback(albums.find(album => {
    return album.id === playListId
  }), [albums, playListId]);

  const carouselRef = useRef(null);

  useEffect(() => {
    if (carouselRef.current) {
      setCarouselWidth(carouselRef.current.offsetWidth);
    } 
  }, [carouselRef])

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

  const handleCarouselPosition = useCallback(() => {
    console.log(carouselWidth, 'carouselWidth');
    return ((900 / 2) - ((carouselIndex + 1) * 95));
  }, [carouselWidth, carouselIndex]);

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
                    borderColor: index === carouselIndex ? "black" : "grey"
                  }}
                  className="album-cover"
                >
                  <img
                    src={`http://demo.subsonic.org/rest/getCoverArt?u=guest&p=guest&v=1.16.1&c=myapp12&type=recent&f=json&id=${album.id}`}
                    onClick={() => setplayListId(album.id)}
                  />
                </div>
              )
            })}
          </div>
        </div>
        <button onClick={() => handleCarousel(false)}>&rArr;</button>
      </div>
      <h1>{selectedAlbum && selectedAlbum.name}</h1>
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

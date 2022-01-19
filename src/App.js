import { useEffect, useState } from 'react';
import md5 from 'md5';
import logo from './logo.svg';
import './App.css';

function App() {
  const [ albums, setAlbums ] = useState([]);
  const [ playListId, setplayListId] = useState(null);
  const [ album, setAlbum ] = useState([]);

  const baseURL = 'http://demo.subsonic.org/rest/getAlbumList2?u=guest&p=guest&v=1.16.1&c=myapp12&f=json'

  useEffect(async() => {
    let albumsResponse = [];
    await fetch(`${baseURL}&type=recent`)
    .then((res) => {
      return res.json()
    })
    .then(data => {
      albumsResponse =  data["subsonic-response"].albumList2.album;
    });
 
    if (albumsResponse.length > 0) {
      await setAlbums(albumsResponse);
      await setplayListId(albumsResponse[0].id);
      let albumResponse = [];
      await fetch(`http://demo.subsonic.org/rest/getAlbum?u=guest&p=guest&v=1.16.1&c=myapp12&type=recent&f=json&id=${playListId}`)
        .then(res => {
          console.log(res, 'ress')
          return res.json()
        })
        .then(data => {
          console.log(data, 'dara ')
          if (data["subsonic-response"]) {
            albumResponse = data["subsonic-response"].album
          }
        })
      
        setAlbum(albumsResponse);
    }
  }, []);

  console.log(album, 'asda')

  return (
    <div className="App">
      <div className="slider">
          {albums.map(album => {
            return (
              <img
                key={album.id}
                src={`http://demo.subsonic.org/rest/getCoverArt?u=guest&p=guest&v=1.16.1&c=myapp12&type=recent&f=json&id=${album.id}`}
                style={{width: 80, height: 80}}
              />
            )
          })}
      </div>
      <h1></h1>
      <table className="playList">
        <tbody>
          <td>
            {/* {tracks.map((track, index) => {
              return(
                <tr key={track.id}>
                  <td>{index + 1}</td>
                  <td>{track.title}</td>
                </tr>
              )
            })} */}
          </td>
        </tbody>
      </table>
    </div>
  );
}

export default App;

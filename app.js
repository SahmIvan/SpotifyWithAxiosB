
async function getAccessToken() {
  const clientId = "44fd1cde033b4b2eb274de6dbf00e8c1";
  const clientSecret = "597d74da319b431083f1bbea5b3b2cf2";
  const url = "https://accounts.spotify.com/api/token";
  const encodedData = btoa(`${clientId}:${clientSecret}`);

  try {
    const response = await axios.post(url, "grant_type=client_credentials", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${encodedData}`,
      },
    });

    return response.data.access_token;
  } catch (error) {
    console.error("Error obtaining access token:", error);
  }
}


    const searchAlbum = async () => {
        let artistTitle = document.getElementById("artistTitle");
        let albumTitle = document.getElementById("albumTitle");
        let albumPhoto = document.getElementById("albumPhoto");
        let artistPicture = document.getElementById("artistPicture");
        let trackList = document.getElementById("trackList");
        const artistName = document.getElementById("artist").value;
      
        const token = await getAccessToken(); //Obtiene el codigo de acceso del token por hora
        const headers = {
            Authorization: `Bearer ${token}`, //Tipo de token + token
            "Content-Type": "application/json",
        };
        try {
            const response = await axios.get(`https://api.spotify.com/v1/search?type=artist&q=${encodeURIComponent(artistName)}`,{ headers });
            const data = response.data;
            const artistId = data.artists.items[0].id;
            console.log(data);
            artistPicture.src = data.artists.items[0].images[0].url;
        
            const albumsResponse = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/albums`,{ headers });
            const albumsData = albumsResponse.data;
            const firstAlbumId = albumsData.items[0].id;
        
            const albumResponse = await axios.get(`https://api.spotify.com/v1/albums/${firstAlbumId}`,{ headers });
            const albumData = albumResponse.data;
            console.log(albumData);
            
            artistTitle.innerHTML = albumData.artists[0].name;
            albumTitle.innerHTML = albumData.name;
            albumPhoto.src = albumData.images[0].url;
        
            let songs = albumData.tracks.items;
            console.log(songs);
        
            let albumTracks = "";
            songs.forEach((track, index) => {
                let nombretrack = track.name;
                let trackUrl = track.preview_url;
                albumTracks += `
                      <div class="col-12 col-md-4 text-center mt-5 " >
                      <img src="${albumData.images[0].url}" alt="" class="w-50 rounded-pill">
                          <p>${nombretrack}</p>
                          <audio controls>
                              <source src="${trackUrl}" type="audio/mpeg" >
                              Your browser does not support the audio element.
                          </audio>
                      </div>`;
                console.log(nombretrack);
                console.log(track.preview_url);
            });
            trackList.innerHTML = albumTracks;
        } catch (err) {
            console.error(err);
        }
    };

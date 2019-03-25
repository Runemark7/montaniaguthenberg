const date = (new Date()).toISOString();
const origin = window.location.origin;

const axios = require('axios');

// List of images
export const mediaList = [];

export function getMedia (id, params = {}) {
  const sizes = {};
  if (params.thumbnail) {
    sizes.thumbnail = {
      source_url: params.thumbnail,
    };
  }

  return {
    id,
    title: { raw: '', rendered: '' },
    caption: { raw: '', rendered: '' },
    date_gmt: date,
    date,
    media_type: params.media_type,
    mime_type: params.mime_type,
    source_url: params.source_url,
    // link: params.source_url,
    media_details: {
      file: '',
      width: 0,
      height: 0,
      image_meta: {},
      sizes,
    },
  };
}

export function createMedia (file) {
  return new Promise(resolve => {
    const reader = new window.FileReader();
    reader.onload = () => {
      // Create media and add to list
      const img = getMedia(mediaList.length + 1, {
        media_type: file.type.split('/')[0],
        mime_type: file.type,
        source_url: reader.result,
      });
      mediaList.push(img);
      resolve(img);
    };
    reader.readAsDataURL(file);
  });
}

// Hämtar datan från databasen och hämtar mallen från getMedia
// Sedan lägger man det i mediaList med push och lägger till ett id med mediaList.length+1 så att id alltid blir den senaste + 1
export async function dataFromDb(){
  const dbData = await axios.get('http://localhost:5000/wp/v2/media'); //dbData är ett objekt med config, data (som är en array av datan i databasen), header, status osv...
  const realData = dbData.data; // går in i arrayn för att det ska vara smidigare att göra loopen
  for(let i = 0; i < realData.length;i++){ // jag använder mig av en for loop för att få fram ett id till bilden
    // Här tar för varje objekt i arrayn och pushar in det i komponentens array mediaList.
      mediaList.push(getMedia( /* kallar på mall funktionen */ mediaList.length+1 /* här ger jag bilden/videon ett unikt id */, { media_type: realData[i].media_type, mime_type: realData[i].mime_type, source_url: realData[i].source_url }));
  }
}

// Load media (images)
mediaList.push(getMedia(1, { media_type: 'image', mime_type: 'image/jpeg', source_url: `${ origin }/img1.jpg`, }));
mediaList.push(getMedia(2, { media_type: 'image', mime_type: 'image/jpeg', source_url: `${ origin }/img2.jpeg`, }));
mediaList.push(getMedia(3, { media_type: 'image', mime_type: 'image/png', source_url: `${ origin }/img3.png`, }));


// Load media (videos)
mediaList.push(getMedia(4, {
  media_type: 'video',
  mime_type: 'video/mp4',
  source_url: `${origin}/video1.mp4`,
  thumbnail: `${origin}/video1-thumb.jpg`,
}));

mediaList.push(getMedia(5, {
  media_type: 'video',
  mime_type: 'video/mp4',
  source_url: `${origin}/video2.mp4`,
  thumbnail: `${origin}/video2-thumb.jpg`,
}));


// Load media (audios)
mediaList.push(getMedia(6, {
  media_type: 'audio',
  mime_type: 'audio/mp3',
  source_url: `${origin}/audio1.mp3`,
  thumbnail: `${origin}/audio1-thumb.png`,
}));

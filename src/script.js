// ANCHOR Setup DOM selector 
const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

// ANCHOR creating a route URL
const apiURL = 'https://api.lyrics.ovh';

// Search by song or artist
async function searchSongs(term) { // async will deal with fetching data from an api or any backend. cleaner and shorthand from (.then)
  const res = await fetch(`${apiURL}/suggest/${term}`); // term is param for our input data and we are holding the fetch by using await
  const data = await res.json(); // store the return data in formatted json and this return a promise as well 

  showData(data); // display the data in DOM
}

// Show song and artist in DOM
function showData(data) {
  result.innerHTML = `
    <ul class="songs">
      ${data.data // We can map with join to map through our list with data array 
        .map(
          song => `<li>
      <span><strong>${song.artist.name}</strong> - ${song.title}</span> 
      <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
    </li>`
        )
        .join('')} 
    </ul>
  `;
// join will turn it to string so we need put items together 
  if (data.prev || data.next) { // check the there is data in the next ul or prev then trigger next or prev button 
    more.innerHTML = `
      ${
        data.prev
          ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>` // onclick in an inline event listener 
          : ''
      }
      ${
        data.next
          ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
          : ''
      }
    `;
  } else {
    more.innerHTML = '';
  }
}

// Get prev and next songs for our ul 
async function getMoreSongs(url) { // url is either the prev or next  and it's going to be async 
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`); // using cors anywhere from herokuapp to use cross domain 
  const data = await res.json();

  showData(data);
}

// Get lyrics for song
async function getLyrics(artist, songTitle) {
  const res = await fetch(`${apiURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>'); // replace reg check the lyrics global and replaced with line break with lines break//

  result.innerHTML = `<h2><strong>${artist}</strong> - ${songTitle}</h2>
  <span>${lyrics}</span>`;

  more.innerHTML = '';
}

// Event listeners
form.addEventListener('submit', e => {
  e.preventDefault(); // So doesn't try to submit to file and refresh every time an input is passed 

  const searchTerm = search.value.trim(); // Assign the value of the input to var 

  if (!searchTerm) { // Check if nothing is typed in
    alert('Please type in a search term'); 
  } else {
    searchSongs(searchTerm); // call a function 
  }
});

// Get lyrics button click
result.addEventListener('click', e => {
  const clickedEl = e.target;

  if (clickedEl.tagName === 'BUTTON') {
    const artist = clickedEl.getAttribute('data-artist');
    const songTitle = clickedEl.getAttribute('data-songtitle');

    getLyrics(artist, songTitle);
  }
});
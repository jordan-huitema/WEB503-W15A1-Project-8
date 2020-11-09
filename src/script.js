// DOM selectors
const form = document.getElementById('form')
const search = document.getElementById('search')
const result = document.getElementById('result')
const more = document.getElementById('more')

const apiURL = 'https://api.lyrics.ovh'

async function searchSongs(term) {
    const res = await fetch(`${apiURL}/suggest/${term}`)
    const data = await res.json()

    showData(data)
}

function showData(data) {
    result.innerHTML = `
    <ul class="songs">
    ${data.data
            .map(
                song => `<li>
            <span><strong>${song.artist.name}</strong>- ${song.title}</span>
            <button class="btn" data-artist="${song.artist}" data-title="${song.title}">Get Lyrics</button>
            </li>`)
            .join('')
        }
        </ul>
    `
    if(data.prev || data.next) {
        more.innerHTML = `
        ${
            data.prev ? `<button class="btn" onClick="getMoreSongs('${data.perv}')">Prev</button>` : ''
        }
        ${
            data.prev ? `<button class="btn" onClick="getMoreSongs('${data.next}')">Next</button>` : ''
        }
        `
    } else {
        more.innerHTML = ''
    }
}

async function getLyrics(artist, title) {
    const res = await fetch(`${apiURL}/vl/${artist}/${title}`)
    const data = await res.json()

    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, '<br>')

    result.innerHTML = `
    <h2><strong>${artist}</strong> - ${title} </h2>
    <span>${lyrics}</span>`

    more.innerHTML = ''
}

async function getMoreSongs(url) {
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`)
    const data = await res.json(
        showData(data)
    )
}

// Event listeners
// Submit form
form.addEventListener('submit', e => {
    e.preventDefault()

    const searchTerm = search.value.trim()

    if(!searchTerm) {
        alert('Please type in a seach term')
    } else {
        searchSongs(searchTerm)
    }
})
// Click lyrics button
result.addEventListener('click', e => {
    const clickEL = e.target

    if(clickEL.tagName === "BUTTON") {
        const artist = clickEL.getAttribute('data-artist')
        const songTitle = clickEL.getAttribute('data.songTitle')

        getLyrics(artist, songTitle)
    }
})
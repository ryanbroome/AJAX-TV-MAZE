'use strict';

const $showsList = $('#showsList');
const $episodesArea = $('#episodesArea');
const $episodesList = $('#episodesList');
const $searchForm = $('#searchForm');

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  // DONE LINES ?????????
  const url = `http://api.tvmaze.com/search/shows?q=${term}`;
  const res = await axios.get(url, { name: term });
  for (let show of res.data) {
    const { id, name, summary, image = 'https://www.tvmaze.com/shows/13417/ozark' } = show.show;
    return [
      {
        id,
        name,
        summary,
        image,
      },
    ];
  }
  //  [
  //   {
  //     id: 1767,
  //     name: 'The Bletchley Circle',
  //     summary: `<p><b>The Bletchley Circle</b> follows the journey of four ordinary
  //          women with extraordinary skills that helped to end World War II.</p>
  //        <p>Set in 1952, Susan, Millie, Lucy and Jean have returned to their
  //          normal lives, modestly setting aside the part they played in
  //          producing crucial intelligence, which helped the Allies to victory
  //          and shortened the war. When Susan discovers a hidden code behind an
  //          unsolved murder she is met by skepticism from the police. She
  //          quickly realises she can only begin to crack the murders and bring
  //          the culprit to justice with her former friends.</p>`,
  //     image: 'http://static.tvmaze.com/uploads/images/medium_portrait/147/369403.jpg',
  //   },
  // ];
}
/** Given list of shows, create markup for each and to DOM */
// TODO TRY CATCH OR ERROR PROTECT IF SHOW DOES NOT HAVE IMAGE.
// WAS THINKING TO DO A VARIABLE AND MAYBE  if(show.image.original){ if no image then set it to https://tinyurl.com/tv-missing

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
      `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src="${show.image.original}"
              alt="${show.name}"
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button id="episodes" class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `
    );

    $showsList.append($show);
  }
}

/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $('#searchForm-term').val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  populateShows(shows);
}

$searchForm.on('submit', async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});

/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const res = await axios.get(`https://api.tvmaze.com/shows/${id}?embed=episodes`);
  const episodes = res.data._embedded.episodes;
  return episodes;
}

/** Write a clear docstring for this function... */

async function populateEpisodes(episodes) {
  for (let episode of episodes) {
    $episodesList.append(`<li><b>${episode.name}</b> -  air ${episode.airdate}</li>`);
  }
}

$('body').on('click', '#episodes', async function (event) {
  $('#episodesArea').toggle();
  // NEEDS MORE SPECIFIC OR TO GET CORRECT show-id
  const id = $('.media').parent().data('show-id');
  const episodes = await getEpisodesOfShow(id);
  populateEpisodes(episodes);
});

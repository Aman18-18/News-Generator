const fetchBtn = document.getElementById('fetch-btn');
const newsGrid = document.getElementById('news-grid');
const skeletonGrid = document.getElementById('skeleton-grid');
const errorBox = document.getElementById('error-box');
const errorMsg = document.getElementById('error-message');
const statusText = document.getElementById('status-text');
const statusBar = document.getElementById('status-bar');
const retryBtn = document.getElementById('retry-btn');
const todayDate = document.getElementById('today-date');

function displayDate(){
    const today  =  new Date();

    const options = {
        weekday : 'long',
        month : 'long',
        day : 'numeric',
        year : 'numeric'

        

    };
    todayDate.textContent = today.toLocaleDateString('en-IN', options);
}

displayDate();


async function fetchHeadlines() {
    const API_KEY = "pub_40389008f69041079f79e1f88f301581"; // paste your key here

    const url = `https://newsdata.io/api/1/news?apikey=${API_KEY}&country=in&language=en`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch news");
    }

    const data = await response.json();

    console.log(data); // keep this for debugging

    return data.results.slice(0, 5).map(item => ({
        category: item.category?.[0] || "General",
        headline: item.title || "No title",
        source: item.source_id || "Unknown"
    }));
}


async function loadNews() {

  fetchBtn.disabled = true;
  fetchBtn.textContent = 'Loading...';

  skeletonGrid.classList.add('visible');
  errorBox.classList.remove('visible');

  statusBar.className = 'status-bar loading';
  statusText.textContent = 'Fetching headlines...';

  try {
    const data = await fetchHeadlines();

    skeletonGrid.classList.remove('visible');

    statusBar.className = 'status-bar success';
    statusText.textContent = 'Headlines loaded!';

    newsGrid.innerHTML = data.map(item => `
      <div class="news-card">
        <span class="card-category">${item.category}</span>
        <h2 class="card-headline">${item.headline}</h2>
        <div class="card-source">${item.source}</div>
      </div>
    `).join('');

  } catch (err) {

    skeletonGrid.classList.remove('visible');

    errorBox.classList.add('visible');
    errorMsg.textContent = err.message;

    statusBar.className = 'status-bar error';
    statusText.textContent = 'Failed to load headlines.';

  } finally {

    fetchBtn.disabled = false;
    fetchBtn.textContent = 'Fetch Today\'s News';
  }
}

fetchBtn.addEventListener('click', loadNews);
retryBtn.addEventListener('click', loadNews);
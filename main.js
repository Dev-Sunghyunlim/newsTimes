const API_KEY = `81753324efdb466dab287de9ad4c70ac`;
let newsList = [];

const menus = document.querySelectorAll(".menus button");

menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByCategory(event))
);

let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5;

const getNews = async () => {
  try {
    url.searchParams.set("page", page);
    url.searchParams.set("pageSize", pageSize);
    const response = await fetch(url);
    const data = await response.json();
    console.log("ddd", data);
    if (response.status === 200 && data.totalResults !== 0) {
      newsList = data.articles;
      totalResults = data.totalResults;
      render();
      paginationRender();
    } else if (data.totalResults === 0) {
      throw new Error(
        "There are no news articles matching the searched keyword."
      );
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.log(error.message);
    errorRender(error.message);
  }
};

const getLatestNews = async () => {
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );
  getNews();
};

const getNewsByCategory = async (event) => {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
  );
  getNews();
};

const getNewsByKeyword = async () => {
  const Keyword = document.getElementById("search-input").value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&q=${Keyword}&apiKey=${API_KEY}`
  );
  getNews();
};

const render = () => {
  const newsHTML = newsList
    .map(
      (news) => `<div class="row news">
          <div class="col-lg-4">
            <img
              class="news-image-size"
              src="${news.urlToImage}"
            />
          </div>
          <div class="col-lg-8">
            <h2><a href="${news.url}" class="link-body-emphasis text-decoration-none" target="_blank">${news.title}</a></h2>
            <p>
              ${news.description}
            </p>
            <div>${news.source.name}*${news.publishedAt}</div>
          </div>
        </div>`
    )
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-danger" role="alert">
  ${errorMessage}
</div>`;

  document.getElementById("news-board").innerHTML = errorHTML;
};

const paginationRender = () => {
  const pageGroup = Math.ceil(page / groupSize);
  let lastPage = pageGroup * groupSize;
  const totalPages = Math.ceil(totalResults / pageSize);
  if (lastPage > totalPages) {
    lastPage = totalPages;
  }

  const firstPage =
    lastPage - (groupSize - 1) <= 0 ? 1 : lastPage - (groupSize - 1);

  let paginationHTML = ``;

  if (page <= 1) {
    paginationHTML += `<li class="page-item disabled"><a href="#" class="page-link"><span aria-hidden="true">&laquo;</span></a></li>`;
  } else {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${1})"><a href="#" class="page-link"><span aria-hidden="true">&laquo;</span></a></li>`;
  }

  if (page <= 1) {
    paginationHTML += `<li class="page-item disabled"><a href="#" class="page-link">Previous</a></li>`;
  } else {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${
      page - 1
    })"><a href="#" class="page-link">Previous</a></li>`;
  }

  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${
      i === page ? "active" : ""
    }" onclick="moveToPage(${i})"><a class="page-link">${i}</a></li>`;
  }
  if (page === lastPage) {
    paginationHTML += `<li class="page-item disabled"}><a class="page-link" href="#">Next</a></li>`;
  } else {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})"
  }><a class="page-link" href="#">Next</a></li>`;
  }
  if (page === lastPage) {
    paginationHTML += `<li class="page-item disabled"}><a class="page-link" href="#"><span aria-hidden="true">&raquo;</span></a></li>`;
  } else {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${lastPage})"
  }><a class="page-link" href="#"><span aria-hidden="true">&raquo;</span></a></li>`;
  }
  document.querySelector(".pagination").innerHTML = paginationHTML;
};

const moveToPage = (pageNum) => {
  page = pageNum;
  getNews();
};

getLatestNews();

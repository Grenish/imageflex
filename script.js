const imagesWrapper = document.querySelector(".images");
const loadMoreBtn = document.getElementById("load-more");
const query = document.querySelector(".searchbox");
const lightBox = document.querySelector(".pop-box");
const closeBtn = document.getElementById("close-btn");
const downloadImgBtn = document.querySelector(".download-btn");
const expand = document.getElementById("expand-btn");

const apiKey = "3IYyltpevUncnupkGmahEOupMoVXBiHvsW4Ei9BnRA8E6suAQ1tV8Sfe";
const perPage = 15;
let currentPage = 1;
let queryInput = null;

const downloadImg = (imgURL) => {
  fetch(imgURL)
    .then((res) => res.blob())
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file);
      a.download = new Date().getTime();
      a.click();
    })
    .catch(() => alert("Failed to download this image for you."));
};

const showLightBox = (img, name) => {
  lightBox.querySelector("span").innerText = name;
  lightBox.querySelector("img").src = img;
  downloadImgBtn.setAttribute("data-img", img);
  lightBox.classList.add("show");
  document.body.style.overflow = "hidden";
};

const generateHTML = (images) => {
  imagesWrapper.innerHTML += images
    .map(
      (img) =>
        `
        <li class="card" >
          <img src="${img.src.large2x}" alt="Something great" />
          <div class="rel-box">
            <div class="detail-main">
              <div class="details">
                <div class="profile">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    class="bi bi-camera2" viewBox="0 0 16 16">
                    <path d="M5 8c0-1.657 2.343-3 4-3V4a4 4 0 0 0-4 4z" />
                    <path
                      d="M12.318 3h2.015C15.253 3 16 3.746 16 4.667v6.666c0 .92-.746 1.667-1.667 1.667h-2.015A5.97 5.97 0 0 1 9 14a5.972 5.972 0 0 1-3.318-1H1.667C.747 13 0 12.254 0 11.333V4.667C0 3.747.746 3 1.667 3H2a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1h.682A5.97 5.97 0 0 1 9 2c1.227 0 2.367.368 3.318 1zM2 4.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0zM14 8A5 5 0 1 0 4 8a5 5 0 0 0 10 0z" />
                  </svg>
                  <span>${img.photographer}</span>
                </div>
                <div class="download">
                  <button onclick="downloadImg('${img.src.large2x}')" class="download-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                      class="bi bi-download" viewBox="0 0 16 16">
                      <path
                        d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z" />
                      <path
                        d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z" />
                    </svg>
                  </button>
                </div>
                <div class="expand">
                <button class="expand-btn" id="expand-btn" onclick="showLightBox('${img.src.large2x}', '${img.photographer}')">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor"
                    class="bi bi-arrows-angle-expand" viewBox="0 0 16 16">
                    <path fill-rule="evenodd"
                      d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z" />
                  </svg>
                </button>
              </div>
              </div>
              
            </div>
          </div>
        </li>
        `
    )
    .join("");
};

const getImages = (apiURL) => {
  // fetching api
  loadMoreBtn.innerHTML = "Loading...";
  loadMoreBtn.classList.add("disabled");
  fetch(apiURL, {
    headers: { Authorization: apiKey },
  })
    .then((res) => res.json())
    .then((data) => {
      generateHTML(data.photos);
      loadMoreBtn.innerHTML = "Load more";
      loadMoreBtn.classList.remove("disabled");
    })
    .catch(() => alert("Failed to load images!!"));
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

const loadMoreImages = () => {
  currentPage++;
  let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  apiURL = queryInput
    ? `https://api.pexels.com/v1/search?query=${queryInput}&page=${currentPage}&per_page=${perPage}`
    : apiURL;
  getImages(apiURL);
};

const searchResult = (e) => {
  if (e.target.value === "") return (queryInput = null);

  if (e.key === "Enter") {
    currentPage = 1;
    queryInput = e.target.value;
    imagesWrapper.innerHTML = "";
    getImages(
      `https://api.pexels.com/v1/search?query=${queryInput}&page=${currentPage}&per_page=${perPage}`
    );
  }
};

closeBtn.addEventListener("click", () => {
  lightBox.classList.remove("show");
  document.body.style.overflow = "auto";
});

loadMoreBtn.addEventListener("click", loadMoreImages);
query.addEventListener("keyup", searchResult);
downloadImgBtn.addEventListener("click", (e) =>
  downloadImg(e.target.dataset.img)
);

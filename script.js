const songs = [
  { name: "Aleemrk - Cold Hours", file: "songs/1.mp3" },
  { name: "Kaifi Khalil - Kahani Suno 2.0", file: "songs/2.mp3" },
  { name: "The Weeknd - Starboy", file: "songs/3.mp3" },
  { name: "Arjan Vailly", file: "songs/4.mp3" },
  { name: "Shubh - MVP", file: "songs/5.mp3" },
  { name: "CANTO DE LUNA", file: "songs/6.mp3" },
  { name: "Wakhra Swag", file: "songs/7.mp3" },
  { name: "Shubh - Cheques", file: "songs/8.mp3" },
  { name: "Shubh - Still Rollin", file: "songs/9.mp3" },
  { name: "We Rollin", file: "songs/10.mp3" },
  { name: "Kaley Sheshe – Addy Nagar", file: "songs/11.mp3" },
{ name: "Kaley Sheshe – Addy Nagar", file: "songs/12.mp3" }
];
let currentSong = 0;
let audio = new Audio();

const masterPlay = document.querySelector(".masterPlay");
const nextBtn = document.querySelector(".fa-forward");
const prevBtn = document.querySelector(".fa-backward");
const progressBar = document.getElementById("my-progress-bar");

const footerSongName = document.querySelector(".footer-song-name");
const footerGif = document.querySelector(".footer-gif");

const currentTimeEl = document.querySelector(".current-time");
const durationEl = document.querySelector(".song-duration");

const searchInput = document.getElementById("searchInput");

function formatTime(seconds) {
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);

  if (secs < 10) secs = "0" + secs;

  return mins + ":" + secs;
}

function playSong(index) {
  currentSong = index;

  audio.src = songs[index].file;
  audio.play();

  footerSongName.textContent = songs[index].name;
  footerGif.style.opacity = "1";

  masterPlay.classList.remove("fa-circle-play");
  masterPlay.classList.add("fa-circle-pause");
}

function pauseSong() {
  audio.pause();

  footerGif.style.opacity = "0";

  masterPlay.classList.remove("fa-circle-pause");
  masterPlay.classList.add("fa-circle-play");
}

// Footer Play / Pause
masterPlay.addEventListener("click", () => {

  if (!audio.src) {
    playSong(0);
    return;
  }

  if (audio.paused) {
    audio.play();

    footerGif.style.opacity = "1";

    masterPlay.classList.remove("fa-circle-play");
    masterPlay.classList.add("fa-circle-pause");

  } else {
    pauseSong();
  }

});

// Song Row Click
document.querySelectorAll(".songbanner").forEach(song => {

  song.addEventListener("click", () => {

    const index = parseInt(song.dataset.index);

    playSong(index);

  });

});

// Play Icon Click
document.querySelectorAll(".song-play").forEach(btn => {

  btn.addEventListener("click", (e) => {

    e.stopPropagation();

    const index = parseInt(btn.dataset.index);

    playSong(index);

  });

});

// Next
nextBtn.addEventListener("click", () => {

  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  playSong(currentSong);

});

// Previous
prevBtn.addEventListener("click", () => {

  currentSong--;

  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }

  playSong(currentSong);

});

// Progress Update
audio.addEventListener("timeupdate", () => {

  if (audio.duration) {

    let progress =
      (audio.currentTime / audio.duration) * 100;

    progressBar.value = progress;

    currentTimeEl.textContent =
      formatTime(audio.currentTime);

    durationEl.textContent =
      formatTime(audio.duration);

  }

});

// Seek
progressBar.addEventListener("input", () => {

  if (audio.duration) {

    audio.currentTime =
      (progressBar.value / 100) * audio.duration;

  }

});

// Auto Next Song
audio.addEventListener("ended", () => {

  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  playSong(currentSong);

});

// Search Songs
if (searchInput) {

  searchInput.addEventListener("keyup", () => {

    let value = searchInput.value.toLowerCase();

    document.querySelectorAll(".songbanner")
      .forEach(song => {

        let text =
          song.innerText.toLowerCase();

        if (text.includes(value)) {
          song.style.display = "flex";
        } else {
          song.style.display = "none";
        }

      });

  });

}
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
  { name: "Sidhu Moose Wala - 295", file: "songs/12.mp3" }
];

let currentSong = 0;
let audio = new Audio();

// Elements Selector
const masterPlay = document.querySelector(".masterPlay");
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const progressBar = document.getElementById("my-progress-bar");

const footerSongName = document.querySelector(".footer-song-name");
const footerGif = document.querySelector(".footer-gif");

const currentTimeEl = document.querySelector(".current-time");
const durationEl = document.querySelector(".song-duration");
const searchInput = document.getElementById("searchInput");

// Helper function to format seconds into MM:SS format
function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";
  let mins = Math.floor(seconds / 60);
  let secs = Math.floor(seconds % 60);
  if (secs < 10) secs = "0" + secs;
  return mins + ":" + secs;
}

// Reset all individual playlist item icons back to standard play arrows
function resetRowIcons() {
  document.querySelectorAll(".song-play").forEach(btn => {
    btn.classList.remove("fa-pause");
    btn.classList.add("fa-play");
  });
}

// Global Core Play Function
function playSong(index) {
  currentSong = index;
  audio.src = songs[index].file;
  
  audio.play().catch(err => {
    console.log("Audio target asset load error or user interaction missing:", err);
  });

  footerSongName.textContent = songs[index].name;
  footerGif.style.opacity = "1";

  // Update Main Footer Control Switch Graphic
  masterPlay.classList.remove("fa-circle-play");
  masterPlay.classList.add("fa-circle-pause");

  // Sync internal inline list items dynamically
  resetRowIcons();
  const activeRowIcon = document.querySelector(`.song-play[data-index="${index}"]`);
  if (activeRowIcon) {
    activeRowIcon.classList.remove("fa-play");
    activeRowIcon.classList.add("fa-pause");
  }
}

// Global Core Pause Function
function pauseSong() {
  audio.pause();
  footerGif.style.opacity = "0";

  masterPlay.classList.remove("fa-circle-pause");
  masterPlay.classList.add("fa-circle-play");

  resetRowIcons();
}

// Bottom Bar Central Core Toggle Trigger
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
    
    const activeRowIcon = document.querySelector(`.song-play[data-index="${currentSong}"]`);
    if (activeRowIcon) {
      activeRowIcon.classList.remove("fa-play");
      activeRowIcon.classList.add("fa-pause");
    }
  } else {
    pauseSong();
  }
});

// Row selection event bindings
document.querySelectorAll(".songbanner").forEach(song => {
  song.addEventListener("click", () => {
    const index = parseInt(song.dataset.index);
    if (currentSong === index && !audio.paused) {
      pauseSong();
    } else {
      playSong(index);
    }
  });
});

// Explicit playlist vector icon trigger logic
document.querySelectorAll(".song-play").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Stops immediate row background double click firing execution loops
    const index = parseInt(btn.dataset.index);
    if (currentSong === index && !audio.paused) {
      pauseSong();
    } else {
      playSong(index);
    }
  });
});

// Sequential Playlist Iteration Trigger (Forward Loop)
nextBtn.addEventListener("click", () => {
  currentSong = (currentSong + 1) % songs.length;
  playSong(currentSong);
});

// Sequential Playlist Iteration Trigger (Backward Loop)
prevBtn.addEventListener("click", () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;
  playSong(currentSong);
});

// Continuous Runtime calculations mapping directly into tracking progress bars
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    let progress = (audio.currentTime / audio.duration) * 100;
    progressBar.value = progress;

    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});

// Track Scrub/Manual Seek update listeners
progressBar.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progressBar.value / 100) * audio.duration;
  }
});

// Automatic Track Advancement configuration hook
audio.addEventListener("ended", () => {
  currentSong = (currentSong + 1) % songs.length;
  playSong(currentSong);
});

// Functional Dynamic Real-Time Text Parsing / Search filter interface hook
if (searchInput) {
  searchInput.addEventListener("input", () => {
    let value = searchInput.value.toLowerCase().trim();
    document.querySelectorAll(".songbanner").forEach(song => {
      let text = song.innerText.toLowerCase();
      if (text.includes(value)) {
        song.style.display = "flex";
      } else {
        song.style.display = "none";
      }
    });
  });
}
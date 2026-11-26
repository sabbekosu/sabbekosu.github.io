const device = document.querySelector(".device");
const lcd = device.querySelector(".lcd");
const screens = new Map([...device.querySelectorAll("[data-screen]")].map(screen => [screen.id, screen]));
const appKeys = [...device.querySelectorAll(".keys a")];
const parentCommand = document.querySelector("#parent-command");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const aliases = {top: "profile", "profile-name": "profile", skills: "education", "project-index": "projects"};

function screenFor(hash) {
  const id = hash.slice(1);
  return screens.get(aliases[id] || id || "profile");
}

let currentScreen;
function openScreen(screen, { focus = false, animate = false } = {}) {
  if (!screen) return;
  const changed = screen !== currentScreen;
  const app = screen.dataset.app;
  for (const panel of screens.values()) panel.hidden = panel !== screen;
  for (const key of appKeys) {
    if (key.hash === "#" + app) {
      key.setAttribute("aria-current", "page");
      lcd.querySelector(".status use").setAttribute("href", key.querySelector("use").getAttribute("href"));
    } else {
      key.removeAttribute("aria-current");
    }
  }
  document.querySelector("#status-title").textContent = screen.dataset.title;
  document.title = screen.id === "profile" ? "Kevin Sabbe | Human–Robot Interaction" : screen.dataset.title + " | Kevin Sabbe";

  const projectFile = screen.id !== app;
  const toDirectory = projectFile || app === "profile";
  parentCommand.href = toDirectory ? "#projects" : "#profile";
  parentCommand.querySelector("use").setAttribute("href", "assets/icons.svg#" + (toDirectory ? "folder" : "card"));
  parentCommand.querySelector("span").textContent = projectFile ? "Project directory" : toDirectory ? "Open research" : "Return to profile";

  if (changed && animate && !reducedMotion.matches) {
    screen.classList.add("enter");
    lcd.classList.remove("redraw");
    // Restart the single LCD sweep even when a second key is pressed mid-transition.
    void lcd.offsetWidth;
    lcd.classList.add("redraw");
  }
  if (focus) screen.querySelector("h1,h2").focus({preventScroll: true});
  currentScreen = screen;
}

device.addEventListener("animationend", event => {
  if (event.animationName === "lcd-redraw") event.target.classList.remove("enter");
  if (event.animationName === "lcd-sweep") lcd.classList.remove("redraw");
});
device.classList.add("ready");
openScreen(screenFor(location.hash) || screens.get("profile"));

document.addEventListener("click", event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || event.defaultPrevented || event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const screen = screenFor(link.hash);
  if (!screen) return;
  event.preventDefault();
  if (location.hash !== link.hash) history.pushState(null, "", link.hash);
  openScreen(screen, {focus: true, animate: true});
  // Only reposition the page when the display is outside the visitor's view.
  if (device.getBoundingClientRect().top < -60 || device.getBoundingClientRect().top >= innerHeight) {
    device.scrollIntoView({block: "start"});
  }
});
window.addEventListener("hashchange", () => {
  const screen = screenFor(location.hash);
  if (screen) openScreen(screen, {focus: true, animate: true});
});

const player = document.querySelector("#player");
const clips = [...document.querySelectorAll(".clips a")];
const poses = document.querySelector("#poses");
let selectedClip;
let pendingSeek = null;

function applySeek() {
  if (pendingSeek === null || player.readyState < HTMLMediaElement.HAVE_METADATA) return;
  player.currentTime = pendingSeek;
  pendingSeek = null;
}
player.addEventListener("loadedmetadata", applySeek);
player.addEventListener("play", () => {
  pendingSeek = null;
  for (const button of poses.children) button.setAttribute("aria-pressed", "false");
});
player.addEventListener("timeupdate", () => {
  for (const button of poses.children) {
    button.setAttribute("aria-pressed", String(player.paused && Math.abs(player.currentTime - Number(button.dataset.time)) < 0.06));
  }
});

function selectClip(clip) {
  const id = clip.dataset.clip;
  const label = clip.dataset.label;
  if (selectedClip && selectedClip !== clip) {
    player.pause();
    pendingSeek = null;
    player.poster = "assets/nao-" + id + ".webp";
    player.src = clip.href;
    player.preload = "metadata";
    player.load();
  }
  selectedClip = clip;
  for (const item of clips) {
    if (item === clip) item.setAttribute("aria-current", "true");
    else item.removeAttribute("aria-current");
  }
  document.querySelector("#clip-name").textContent = label;
  player.setAttribute("aria-label", label + ", silent Webots simulation");
  const frames = clip.dataset.times.split(",").map((time, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.time = time;
    button.setAttribute("aria-label", "Inspect " + label + " at " + time + " seconds");
    button.setAttribute("aria-pressed", "false");
    const thumbnail = new Image(160, 90);
    thumbnail.src = "assets/" + id + "-pose-" + (index + 1) + ".webp";
    thumbnail.alt = "";
    button.append(thumbnail, time + "s");
    return button;
  });
  poses.replaceChildren(...frames);
}
for (const clip of clips) {
  clip.addEventListener("click", event => {
    if (event.button || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    event.preventDefault();
    if (clip !== selectedClip) selectClip(clip);
  });
}
poses.addEventListener("click", event => {
  const button = event.target.closest("button");
  if (!button) return;
  player.pause();
  pendingSeek = Number(button.dataset.time);
  if (player.readyState < HTMLMediaElement.HAVE_METADATA) {
    player.preload = "metadata";
    if (player.networkState !== HTMLMediaElement.NETWORK_LOADING) player.load();
  } else {
    applySeek();
  }
});
selectClip(clips[0]);
document.querySelector(".pose-strip").hidden = false;

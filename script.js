// Every record is readable as an ordinary document section without JavaScript.
const directory = document.querySelector(".directory");
const recordLinks = [...directory.querySelectorAll(".index a")];
const records = [...directory.querySelectorAll(".record")];
const narrowScreen = window.matchMedia("(max-width: 600px)");

function selectRecord(hash) {
  const selected = records.find(record => "#" + record.id === hash);
  if (!selected) return;
  for (const record of records) record.hidden = record !== selected;
  for (const link of recordLinks) {
    if (link.hash === hash) link.setAttribute("aria-current", "true");
    else link.removeAttribute("aria-current");
  }
}

directory.classList.add("ready");
selectRecord(recordLinks[0].hash);
selectRecord(location.hash);

for (const link of recordLinks) {
  link.addEventListener("click", event => {
    if (event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    selectRecord(link.hash);
    // Keep the desktop file list in place. On phones follow the link to the record.
    if (!narrowScreen.matches) {
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, "", link.hash);
    }
  });
}
window.addEventListener("hashchange", () => {
  selectRecord(location.hash || recordLinks[0].hash);
});

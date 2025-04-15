let data;
const aug8Cluster = [
  "Riley",
  "Will",
  "Wolfgang",
  "Kala",
  "Capheus",
  "Sun",
  "Nomi",
  "Lito",
];

const width = window.innerWidth;

function drawChart() {

}

async function loadData() {
  const dataJson = await d3.json("./data/sense8-list-of-connections.json");
  // const sensates = dataJson.data.reduce((previousList, currentVisit) => {
  //   for (const sensate of currentVisit.sensates) {
  //     previousList.add(sensate);
  //   }
  //   return previousList;
  // }, new Set());
  // console.log(sensates); data = dataJson.data;
  // Full list of sensates in dataset: "Jonas", "Angelica", "Whispers", "Riley", "Will", "Wolfgang", "Kala", "Capheus", "Sun", "Nomi", "Lito", "Yrsa"

  const visits = dataJson.data;

  const visitsForAug8Cluster = visits.filter((visit) =>
    visit.sensates.every((sensate) => aug8Cluster.includes(sensate))
  );

  const exclusionByDetails = "everyone hears the song";

  data = visitsForAug8Cluster.filter((visit) => {
    return !visit.details.includes(exclusionByDetails);
  });
  // console.log(data[0]); // {"sensates": ["Riley", "Will"], "visitor": "Riley", "details": "Will hears the music Riley is playing in the club.", "episodeNumber": 1, "episodeName": "Limbic Resonance"},

  drawChart();
}

function updateCopyright() {
  const copy = d3.select("#copyright");
  const currentYear = new Date().getFullYear();
  copy.text(currentYear > 2025 ? `–${currentYear}` : "");
}

updateCopyright();
loadData();

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
  // Sense checks:
  // const sensates = dataJson.data.reduce((previousList, currentVisit) => {
  //   for (const sensate of currentVisit.sensates) {
  //     previousList.add(sensate);
  //   }
  //   return previousList;
  // }, new Set());
  // console.log(sensates);
  // Full list of sensates in dataset: "Jonas", "Angelica", "Whispers", "Riley", "Will", "Wolfgang", "Kala", "Capheus", "Sun", "Nomi", "Lito", "Yrsa"
  // "Niles" as well, after data additions
  
  const visits = dataJson.data;
  console.log({visits});
  // Sense checks:
  // const allEntriesWithVisitedFields = visits.filter(visit => visit.visited === null || visit.visited.length > 0)
  // console.log({allEntriesWithVisitedFields});
  // const allEntriesWithVisitorsFields = visits.filter(visit => visit.visitors === null || visit.visitors.length > 0)
  // console.log({allEntriesWithVisitorsFields});

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

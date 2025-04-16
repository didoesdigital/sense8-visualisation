import { drawChordDiagram } from "./drawChordDiagram.js";

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

function drawDataTable() {
  const tableContainer = d3
    .select("#table")
    .attr("class", "table-container")
    .attr("role", "group")
    .attr("aria-labelledby", "caption");

  const table = tableContainer.append("table");

  const caption = table
    .append("caption")
    .attr("id", "caption")
    .text(
      "Visits by sensates within the August 8 cluster to other sensates within the cluster"
    );

  const tableHead = table.append("thead");
  const tableHeadRow = tableHead.append("tr");
  tableHeadRow.append("th").attr("scope", "col").text("Visitor");
  tableHeadRow.append("th").attr("scope", "col").text("Visited");
  tableHeadRow.append("th").attr("scope", "col").text("Visits");

  const tableBody = table.append("tbody");
  data.forEach((row, rowId) => {
    row.forEach((col, colId) => {
      const visitorRow = tableBody.append("tr");
      const visitor = aug8Cluster[rowId];
      const visited = aug8Cluster[colId];
      visitorRow.append("td").text(visitor);
      visitorRow.append("td").text(visited);
      visitorRow.append("td").text(data[rowId][colId]);
    });
  });
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
  // console.log({ visits });
  // Sense checks:
  // const allEntriesWithOnlyOneSensate = visits.filter(visit => visit.sensates.length < 2)
  // console.log({allEntriesWithOnlyOneSensate});
  // const allEntriesWithVisitedFields = visits.filter(visit => visit.visited === null || visit.visited.length > 0)
  // console.log({allEntriesWithVisitedFields});
  // const allEntriesWithVisitorsFields = visits.filter(visit => visit.visitors === null || visit.visitors.length > 0)
  // console.log({allEntriesWithVisitorsFields});
  // const allEntriesWithOneNull = visits.filter(visit => (visit.visitors !== null && visit.visited === null) || (visit.visitors === null && visit.visited !== null))
  // console.log({allEntriesWithOneNull});
  // const allEntriesWithTwoNullsAndMoreThan2Sensates = visits.filter(
  //   (visit) =>
  //     visit.visitors === null &&
  //     visit.visited === null &&
  //     visit.sensates.length > 2
  // );
  // console.log({ allEntriesWithTwoNullsAndMoreThan2Sensates });

  const exclusionByDetails = ["everyone hears the song", "WTF"];

  const visitsForAug8Cluster = visits
    .filter((visit) => {
      const visitSensatesFromAug8Cluster = visit.sensates.filter((sensate) =>
        aug8Cluster.includes(sensate)
      );
      return visitSensatesFromAug8Cluster.length > 1;
    })
    // replace nulls with all sensates
    .map((visit) => {
      if (visit.visitors === null) {
        return {
          ...visit,
          visitors: visit.sensates.slice(),
          visited: visit.sensates.slice(),
        };
      } else {
        return visit;
      }
    })
    // removes non-cluster sensates
    .map((visit) => {
      return {
        ...visit,
        sensates: visit.sensates.filter((sensate) =>
          aug8Cluster.includes(sensate)
        ),
        visitors: visit.visitors.filter((sensate) =>
          aug8Cluster.includes(sensate)
        ),
        visited: visit.visited.filter((sensate) =>
          aug8Cluster.includes(sensate)
        ),
      };
    })
    // removes specific entries where visitation is fuzzy
    .filter((visit) => {
      const matchesAnExclusion = exclusionByDetails.find((exclusion) =>
        visit.details.includes(exclusion)
      );
      return matchesAnExclusion ? false : true;
    });

  const visitMatrix = [
    [0, 0, 0, 0, 0, 0, 0, 0], // Riley
    [0, 0, 0, 0, 0, 0, 0, 0], // Will
    [0, 0, 0, 0, 0, 0, 0, 0], // ⋮
    [0, 0, 0, 0, 0, 0, 0, 0], //
    [0, 0, 0, 0, 0, 0, 0, 0], //
    [0, 0, 0, 0, 0, 0, 0, 0], //
    [0, 0, 0, 0, 0, 0, 0, 0], //
    [0, 0, 0, 0, 0, 0, 0, 0], //
    // Riley, Will, …
  ];
  // console.log(visitMatrix);

  visitsForAug8Cluster.forEach((visit) => {
    visit.visitors.forEach((visitor) => {
      visit.visited.forEach((visited) => {
        const row = aug8Cluster.findIndex((sensate) => sensate === visitor);
        const col = aug8Cluster.findIndex((sensate) => sensate === visited);
        if (row !== col) {
          const existingValue = visitMatrix[row][col];
          visitMatrix[row][col] = existingValue + 1;
        }
      });
    });
  });

  data = Object.assign(visitMatrix, {
    names: aug8Cluster.slice(),
    colors: [
      "#ECB255",
      "#9885D5",
      "#5396CF",
      "#BD74CB",
      "#6E8FEA",
      "#DD6876",
      "#F9E89D",
      "#E26F99",
    ],
  });

  // console.log(visitsForAug8Cluster[0]); // {"sensates": ["Riley", "Will"], "visitors": ["Riley"], "visited": ["Will"], "details": "Will hears the music Riley is playing in the club.", "episodeNumber": 1, "episodeName": "Limbic Resonance"},

  drawChordDiagram(data);
  drawDataTable(data);
}

loadData();

let data;

const width = window.innerWidth;

function drawChart() {
}

async function loadData() {
  // const rowConversionFunction = ({
  // }) => ({
  // });
  // data = await d3.csv("./data/TODO.csv", rowConversionFunction)
  // drawChart();
}

function updateCopyright() {
  const copy = d3.select("#copyright");
  const currentYear = new Date().getFullYear();
  copy.text(currentYear > 2025 ? `–${currentYear}` : "");
}

updateCopyright();
loadData();


// Copyright 2018–2020 Observable, Inc.
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
// ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
// ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
// OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

// The drawChordDiagram function is derived from this ISC-licensed example:
// <https://observablehq.com/@d3/chord-diagram>
export function drawChordDiagram(data) {
  const textColor = "#504C57";
  const fontFamily = `'Source Sans 3', 'Source Sans Pro', 'Quicksand', 'Work Sans', 'Lato', 'Noto Sans', 'Assistant', 'Libre Franklin', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif`;
  const fontSize = 14;
  const fontWeight = "400";
  const margin = 60 * 2;
  const padding = 32 * 2;

  const width = 960;
  const height = width;
  const { names, colors } = data;
  const outerRadius = Math.min(width, height) * 0.5 - margin - padding;
  const innerRadius = outerRadius - 10;
  const tickStep = d3.tickStep(0, d3.sum(data.flat()), 100);
  const formatValue = (d) => d; //d3.format(".1~%");

  const chord = d3
    .chord()
    .padAngle(10 / innerRadius)
    .sortSubgroups(d3.descending)
    .sortChords(d3.descending);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);

  const ribbon = d3
    .ribbon()
    .radius(innerRadius - 1)
    .padAngle(1 / innerRadius);

  const color = d3.scaleOrdinal(names, colors);

  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("aria-labelledby", "title")
    .attr("aria-describedby", "chart-desc")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [-width / 2, -height / 2, width, height])
    .attr("style", "width: 100%; height: auto; font: 10px sans-serif;");

  svg
    .append("desc")
    .attr("id", "chart-desc")
    .text(
      "This complicated chord diagram shows Will made the most visits to other sensates at 39 visits."
    );

  const chords = chord(data);

  const group = svg
    .append("g")
    .attr("role", "presentation")
    .selectAll()
    .data(chords.groups)
    .join("g")
    .attr("role", "presentation");

  group
    .append("path")
    .attr("fill", (d) => color(names[d.index]))
    .attr("d", arc)
    .append("title")
    .text((d) => `${names[d.index]}\n${formatValue(d.value)} total visits`);

  const groupTick = group
    .append("g")
    .attr("role", "presentation")
    .attr("aria-hidden", true)
    .selectAll()
    .data((d) => groupTicks(d, tickStep))
    .join("g")
    .attr("role", "presentation")
    .attr("aria-hidden", true)
    .attr(
      "transform",
      (d) =>
        `rotate(${(d.angle * 180) / Math.PI - 90}) translate(${outerRadius},0)`
    );

  // groupTick.append("line")
  //     .attr("stroke", "currentColor")
  //     .attr("x2", 6);

  groupTick
    .append("text")
    .attr("aria-hidden", true)
    .attr("x", 8)
    .attr("dy", "0.35em")
    .attr("transform", (d) =>
      d.angle > Math.PI ? "rotate(180) translate(-16)" : null
    )
    .attr("text-anchor", (d) => (d.angle > Math.PI ? "end" : null))
    .attr("font-family", fontFamily)
    .attr("font-size", fontSize)
    .attr("font-weight", fontWeight)
    .attr("fill", textColor)
    .attr("class", "labels")
    .attr("aria-hidden", "true")
    .text((d) => formatValue(d.value));

  group
    .select("text")
    .attr("font-weight", "bold")
    .attr("aria-hidden", true)
    .text(function (d) {
      return this.getAttribute("text-anchor") === "end"
        ? `↑ ${names[d.index]}`
        : `${names[d.index]} ↓`;
      // ? `↑ ${names[d.index]}'s visits`
      // : `${names[d.index]}'s visits ↓`;
    });

  svg
    .append("g")
    .attr("role", "presentation")
    .selectAll("path")
    .data(chords)
    .join("path")
    .style("mix-blend-mode", "screen")
    .attr("fill", (d) => color(names[d.source.index]))
    .attr("d", ribbon)
    .append("title")
    .text(
      (d) =>
        `${names[d.target.index]} visits ${names[d.source.index]} ${formatValue(
          d.source.value
        )} times${
          d.source.index === d.target.index
            ? ""
            : `\n${names[d.source.index]} visits ${
                names[d.target.index]
              } ${formatValue(d.target.value)} times`
        }`
    );
}

function groupTicks(d, step) {
  const k = (d.endAngle - d.startAngle) / d.value;
  return d3.range(0, d.value, step).map((value) => {
    return { value: value, angle: value * k + d.startAngle };
  });
}

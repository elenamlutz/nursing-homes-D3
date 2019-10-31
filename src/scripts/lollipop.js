import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 120, left: 100, right: 100, bottom: 30 }

const height = 450 - margin.top - margin.bottom

const width = 700 - margin.left - margin.right

const svg = d3
  .select('#lollipop-chart')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

// Create our scales
const xPositionScale = d3
  .scaleLinear()
  .domain([0, 100])
  .range([0, width])

const yPositionScale = d3
  .scalePoint()
  .range([0, height])
  .padding(0.5)

// Read in files
d3.csv(require('../data/lollipop.csv'))
  .then(ready)
  .catch(err => {
    console.log(err)
  })

function ready(datapoints) {
  const nested = d3
    .nest()
    .key(function(d) {
      return d.state
    })
    .entries(datapoints)

  // Go through each group, pull out the name of that group
  const states = nested.map(d => d.key)
  // Teach it to the y position scale
  yPositionScale.domain(states)

  // Add a g element for every single city
  // and then let's do something with each of you
  svg
    .append('text')
    .attr('class', 'title')
    .attr('text-anchor', 'left')
    .attr('x', -30)
    .attr('y', -100)
    .text('Complaints Per Capita Against Nursing Homes')
  svg
    .append('text')
    .attr('class', 'subtitle')
    .attr('text-anchor', 'left')
    .attr('x', -30)
    .attr('y', -70)
    .text(
      'These are the top 10 states with the worst staffing ratings in the country. Elderly'
    )
  svg
    .append('text')
    .attr('class', 'subtitle')
    .attr('text-anchor', 'left')
    .attr('x', -30)
    .attr('y', -50)
    .text(
      'residents and family members have filed the majority of complaints against for-'
    )
  svg
    .append('text')
    .attr('class', 'subtitle')
    .attr('text-anchor', 'left')
    .attr('x', -30)
    .attr('y', -30)
    .text('profit-owned facilities.')

  svg
    .selectAll('g')
    .data(nested)
    .enter()
    .append('g')
    .attr('transform', function(d) {
      return `translate(0,${yPositionScale(d.key)})`
    })
    .each(function(d) {
      const g = d3.select(this)
      const datapoints = d.values

      const maxHigh = d3.max(datapoints, d => d.value)
      const minHigh = d3.min(datapoints, d => d.value)
      const tip = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return (
            "<span style='color:white'>" +
            'Non-Profit: ' +
            minHigh +
            '%' +
            '</span>'
          )
        })

      svg.call(tip)
      const tip1 = d3
        .tip()
        .attr('class', 'd3-tip')
        .offset([-10, 0])
        .html(function(d) {
          return (
            "<span style='color:white'>" +
            'For-Profit: ' +
            maxHigh +
            '%' +
            '</span>'
          )
        })

      svg.call(tip1)

      g.append('line')
        .attr('y1', 0)
        .attr('y2', 0)
        .attr('x1', xPositionScale(maxHigh))
        .attr('x2', xPositionScale(minHigh))
        .attr('stroke', 'black')

      g.append('circle')
        .attr('r', 7)
        .attr('fill', '#FFB38A')
        .attr('cy', 0)
        .attr('cx', xPositionScale(maxHigh))
        .on('mouseover', tip1.show)
        .on('mouseout', tip1.hide)

      g.append('circle')
        .attr('r', 7)
        .attr('fill', 'lightblue')
        .attr('cy', 0)
        .attr('cx', xPositionScale(minHigh))
        .on('mouseover', tip.show)
        .on('mouseout', tip.hide)
    })

  const xAxis = d3
    .axisBottom(xPositionScale)
    .tickSize(-height)
    .ticks(14)
  svg
    .append('g')
    .attr('class', 'axis x-axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)

  svg.selectAll('.x-axis line').attr('stroke-dasharray', '1 3')
  svg.selectAll('.x-axis path').remove()

  const yAxis = d3.axisLeft(yPositionScale)
  svg
    .append('g')
    .attr('class', 'axis y-axis')
    .call(yAxis)

  svg.selectAll('.y-axis path, .y-axis line').remove()
}

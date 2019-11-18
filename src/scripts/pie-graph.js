import * as d3 from 'd3'
import d3Tip from 'd3-tip'
import d3Annotation from 'd3-svg-annotation'
d3.tip = d3Tip

const margin = { top: 70, left: 70, right: 70, bottom: 70 }
const height = 150 - margin.top - margin.bottom
const width = 120 - margin.left - margin.right
const svg = d3.select('#pie-graph')
// .append('svg')
// .attr('height', height + margin.top + margin.bottom)
// .attr('width', width + margin.left + margin.right)
// .append('g')
// .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const radius = 48

const xPositionScale = d3.scaleLinear().range([0, width])

const arc = d3
  .arc()
  .innerRadius(0)
  .outerRadius(radius)

const colorScale = d3.scaleOrdinal().range(['#FFB38A', 'lightblue'])

const pie = d3.pie().value(function(d) {
  return d.value
})

d3.csv(require('../data/multiples.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))
function ready(datapoints) {
  const states = datapoints.map(d => d.state)
  xPositionScale.domain(states)
  console.log(states)
  const container = svg.append('g')

  const nested = d3
    .nest()
    .key(d => d.state)
    .entries(datapoints)
  container
    .append('text')
    .text('Deficiencies Per 1000 Residents Against Nursing Homes')
    .attr('class', 'title')
    .attr('font-size', 12)
    .attr('fill', 'black')
    .style('text-anchor', 'left')
  container
    .append('text')
    .text(
      'The majority of deficiencies per 1000 residents due to Medicare non-compliance are filed mostly against for-profit owned facilities.'
    )
    .attr('class', 'subtitle')
    .attr('x', -20)
    .attr('font-size', 12)
    .attr('fill', 'black')
    .attr('text-anchor', 'middle')

  container
    .selectAll('svg')
    .data(nested)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
    .each(function(d) {
      console.log(d)
      const v = d3.select(this)
      const datapoints = d.values
      const maxHigh = d3.max(datapoints, d => d.value)
      const minHigh = d3.min(datapoints, d => d.value)

      // const tip = d3
      //   .tip()
      //   .attr('class', 'd3-tip')
      //   .offset(-10, 0)
      //   .html(function(d) {
      //     return "<span style='color:white'>" + minHigh + '</span>'
      //   })

      // v.call(tip)
      // const tip1 = d3
      //   .tip()
      //   .attr('class', 'd3-tip')
      //   .offset([-10, 0])
      //   .html(function(d) {
      //     return "<span style='color:white'>" + maxHigh + '</span>'
      //   })

      // v.call(tip1)
      v.selectAll('.pie')
        .data(pie(datapoints))
        .enter()
        .append('path')
        .attr('class', 'pie')
        .attr('d', d => arc(d))
        .style('fill', d => colorScale(d.data.variable))
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('mouseover', function() {
          d3.select(this)
          return tip.show(d)
        })
        .on('mouseout', function() {
          d3.select(this)
          return tip.hide(d)
        })

      v.append('text')
        .text(d => d.key)
        .attr('class', 'subtitle')
        .attr('x', xPositionScale(d.state))
        .attr('y', 70)
        .attr('font-size', 12)
        .attr('fill', 'black')
        .attr('text-anchor', 'middle')
    })
}

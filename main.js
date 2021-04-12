const margin = 30,
    width = 1000,
    height = 500,
    rValues = [2, 15];

let circles, xScale, yScale;


var svg = d3.select('#chart')
    .append("svg")
    .attr("width", width + 'px')
    .attr("height", height + 'px');

d3.csv('boston-housing.csv').then(
    (data) => {
        //Sorting Data using Lodash
        data = _.orderBy(data, ['charles'], ['desc'])
            // console.log(sorteData);
            //Getting the Max & Min of the data in each 
        xMinMax = d3.extent(data, (param) => {
            return parseFloat(param.poor)
        })
        yMinMax = d3.extent(data, (param) => {
            return parseFloat(param.rooms)
        })
        rMinMax = d3.extent(data, (param) => {
                return parseFloat(param.value)
            })
            //console.log(xMinMax);
            // setting up the graphe's Vectors (x,y)
        xScale = d3.scaleLinear()
            .domain([xMinMax[1], xMinMax[0]])
            .range([margin + rValues[1], width - margin - rValues[1]]);
        yScale = d3.scaleLinear()
            .domain([yMinMax[1], yMinMax[0]])
            .range([margin + rValues[1], height - margin - rValues[1]]);
        //Setting up the radius for the circle
        rScale = d3.scaleLinear()
            .domain(rMinMax)
            .range(rValues);
        //Setting up the scale for colors
        cScale = d3.scaleOrdinal()
            .domain([0, 1])
            .range(['#333', '#FF6600']);

        circles = svg.selectAll('.dot')
            .data(data)
            .enter()
            .append('circle')
            .attr('class', 'dot')
            .attr('cx', (param) => { return xScale(param.poor) })
            .attr('cy', (param) => {
                return yScale(param.rooms)
            })
            .attr('r', 0)
            .attr('fill', (param) => {
                return cScale(param.charles)
            })
            .style('opacity', (param) => {
                return param.charles == 1 ? 1 : 0.5;
            })
            .on('mouseover', (param) => {
                poorInfo = ' X | poor : ' + parseFloat(param.poor).toFixed(3) + '<br/>';
                poorInfo += ' Y | rooms : ' + parseFloat(param.rooms).toFixed(3) + '<br/>';
                poorInfo += ' R | value : ' + parseFloat(param.value).toFixed(3) + '<br/>';
                poorInfo += ' C | charles : ' + parseInt(param.charles);


                d3.select('#tooltip')
                    .html(poorInfo)
                    .style('opacity', 0.85)
                    .style("left", (d3.event.pageX - 100) + 'px')
                    .style('top', (d3.event.pageY - 150) + 'px');
            })
            .on('mouseout', () => {
                d3.select('#tooltip')
                    .style('left', '-1000px')
                    .style('opacity', 0);
            });

        // Creating Axis'
        xAxis = d3.axisBottom(xScale)
            .ticks(0) // for no ticks
            // .tickValues([xMinMax[0], xMinMax[1]]) //to set ticks as Min & Max 
        yAxis = d3.axisLeft(yScale).tickValues(yMinMax) //to set ticks as Min & Max 

        xAxisG = svg.append('g')
            .attr('id', 'xAxis')
            .attr('class', 'axis');
        yAxisG = svg.append('g')
            .attr('id', 'yAxis')
            .attr('class', 'axis');

        xAxisG.call(xAxis)
            .attr('transform', 'translate(0, ' + (height - margin) + ')');
        yAxisG.call(yAxis)
            .attr('transform', 'translate(' + margin + ', 0 )');

        svg.append('text')
            .attr('x', xScale(xMinMax[0]))
            .attr('y', yScale(yMinMax[0]) + margin)
            .attr('text-anchor', 'middle')
            .attr('class', 'axisLabel')
            .text('+Wealthy')

        update();
    });

let update = () => {
    circles.transition()
        // .delay(500) // delays the display for 0.5s
        .delay(function(d, i) {
            return i * 5 // display one by one rapidly
        })
        .attr('r', (param) => {
            return rScale(param.value)
        });
}

// Shapes we can do with D3 :
// svg.append('rect')
//     .attr('x', 100)
//     .attr('y', 100)
//     .attr('width', 10)
//     .attr('height', 10)

// svg.append('circle')
//     .attr('cx', 200)
//     .attr('cy', 100)
//     .attr('r', 20);


// svg.append('line')
//     .attr('id', 'line1')
//     .attr('x1', 20)
//     .attr('y1', 20)
//     .attr('x2', 20)
//     .attr('y2', 480)
//     .attr('stroke', '#000');

// svg.append('line')
//     .attr('id', 'line2')
//     .attr('x1', 20)
//     .attr('y1', 480)
//     .attr('x2', 980)
//     .attr('y2', 480)
//     .attr('stroke', '#000');
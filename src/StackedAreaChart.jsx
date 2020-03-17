import React, { useEffect, useRef } from "react";
// import _ from 'lodash';
import { select, axisLeft, axisBottom, stack, area, scalePoint,
    max, scaleLinear, stackOrderAscending, curveCardinal} from "d3";
import useResizeObserver from "./useResizeObserver";

function StackedAreaChart({ data, keys, colors }) {
    const svgRef = useRef();
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    // will be called initially and on every data change
    useEffect(() => {
        const svg = select(svgRef.current);
        const { width, height } = dimensions || wrapperRef.current.getBoundingClientRect();

        const stackGenerator = stack()
            .keys(keys) // [ [avocado vals], [banana vals + prev vals], [eggplant vals + prev vals] ]
            .order(stackOrderAscending); // ordered by sum, otherwise, turning keys on & off will change order
        const layers = stackGenerator(data);

        // const vals = _.flattenDeep(layers);
        let vals = [].concat(...layers);    // flatten one level
        vals = [].concat(...vals);          // flatten again
        const extent = [ 0, max(vals) ];
        // const extent = [ 0, max(layers, l => max(l, seq => seq[1])) ];

        const xScale = scalePoint() // divides x axis into 5 points (1 per year)
            .domain(data.map(d => d.year))
            .range([0, width])

        const yScale = scaleLinear()
            .domain(extent)
            .range([height, 0]);

        const areaGenerator = area()
            .x(seq => xScale(seq.data.year))
            .y0(seq => yScale(seq[0]))   // lower coord of area at year
            .y1(seq => yScale(seq[1]))   // higher coord of area at year
            .curve(curveCardinal)

        svg
            .selectAll(".layer")
            .data(layers)
            .join("path")
            .attr("class", "layer")
            .attr("fill", layer => colors[layer.key])
            // .attr('d', layer => areaGenerator(layer))       
            .attr('d', areaGenerator)       

        const xAxis = axisBottom(xScale);
        const yAxis = axisLeft(yScale);
        svg
            .select(".x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.select(".y-axis").call(yAxis);
    }, [colors, data, dimensions, keys]);

    return (
        <React.Fragment>
            <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
                <svg ref={svgRef}>
                    <g className="x-axis" />
                    <g className="y-axis" />
                </svg>
            </div>
        </React.Fragment>
    );
}

export default StackedAreaChart;
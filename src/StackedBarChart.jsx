import React, { useEffect, useRef } from "react";
// import _ from 'lodash';
import { select, scaleBand, axisBottom, stack,
    max, scaleLinear, axisLeft, stackOrderAscending} from "d3";
import useResizeObserver from "./useResizeObserver";

function StackedBarChart({ data, keys, colors }) {
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

        const xScale = scaleBand()
            .domain(data.map(d => d.year))
            .range([0, width])
            .padding(0.25);

        const yScale = scaleLinear()
            .domain(extent)
            .range([height, 0]);

        svg
            .selectAll(".layer")
            .data(layers)
            .join("g")
                .attr("class", "layer")
                .attr("fill", layer => colors[layer.key])
                    .selectAll("rect")
                    .data(layer => layer)
                    .join("rect")
                        .attr("x", sequence => xScale(sequence.data.year))
                        .attr("width", xScale.bandwidth())
                        .attr("y", sequence => yScale(sequence[1]))
                        .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]));

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

export default StackedBarChart;
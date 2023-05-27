import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WeatherReport, WeatherDay } from '@/schemas/weather';

interface IProps {
  data: WeatherReport;
}

const WeatherChart: React.FC<IProps> = ({ data }) => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const dailyData: WeatherDay[] = data.flatMap(d => d.daily);

    if (dailyData && dailyData.length > 0 && ref.current) {
      const margin = {top: 20, right: 80, bottom: 30, left: 50}; // Adjust right margin here
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const x = d3.scaleTime().range([0, width]);
      const y1 = d3.scaleLinear().range([height, 0]);
      const y2 = d3.scaleLinear().domain([0,100]).range([height, 0]);

      const xAxis = d3.axisBottom(x);
      const yAxisLeft = d3.axisLeft(y1);
      const yAxisRight = d3.axisRight(y2).tickFormat(d => `${d}%`);

      const svg = d3.select(ref.current)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      const lineTempMax = d3.line<WeatherDay>()
        .x(d => x(new Date(d.date)))
        .y(d => y1(d.temp_max));

      const lineTempMin = d3.line<WeatherDay>()
        .x(d => x(new Date(d.date)))
        .y(d => y1(d.temp_min));

      const linePrecipitation = d3.line<WeatherDay>()
        .x(d => x(new Date(d.date)))
        .y(d => y2(d.prec_prob || 0)); // Handle nullable prec_prob

      x.domain(d3.extent(dailyData, d => new Date(d.date)) as [Date, Date]);
      y1.domain([0, d3.max(dailyData, d => d.temp_max) as number]);

      svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

      svg.append("g")
        .attr("class", "y axisLeft")
        .call(yAxisLeft);

      svg.append("g")
        .attr("class", "y axisRight")
        .attr("transform", `translate(${width},0)`)
        .call(yAxisRight);

      svg.append("path")
        .datum(dailyData)
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", lineTempMax);

      svg.append("path")
        .datum(dailyData)
        .attr("class", "line")
        .style("stroke", "blue")
        .attr("d", lineTempMin);

      svg.append("path")
        .datum(dailyData)
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", linePrecipitation);
    }
  }, [data]);

  return (
    <svg ref={ref} />
  );
}

export default WeatherChart;

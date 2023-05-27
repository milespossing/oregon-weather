import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { WeatherReport, WeatherDay, WeatherReportCity } from '@/schemas/weather';

interface IProps {
  data: WeatherReport;
}

const WeatherChart: React.FC<IProps> = ({ data }) => {
  const maxMinRef = useRef<SVGSVGElement | null>(null);
  const precipitationRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const dailyData: WeatherDay[] = data.flatMap((cityData: WeatherReportCity) => cityData.daily);

    if (dailyData && dailyData.length > 0 && maxMinRef.current && precipitationRef.current) {
      const margin = { top: 20, right: 80, bottom: 30, left: 50 };
      const width = 960 - margin.left - margin.right;
      const height = 500 - margin.top - margin.bottom;

      const x = d3.scaleTime().range([0, width]);
      const y1 = d3.scaleLinear().range([height, 0]);
      const y2 = d3.scaleLinear().domain([0, 100]).range([height, 0]);

      const xAxis = d3.axisBottom(x);
      const yAxisLeft = d3.axisLeft(y1);
      const yAxisRight = d3.axisRight(y2).tickFormat(d => `${d}%`);

      const maxMinSvg = d3.select(maxMinRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const precipitationSvg = d3.select(precipitationRef.current)
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const lineTempMax = d3
        .line<WeatherDay>()
        .x(d => x(new Date(d.date)))
        .y(d => y1(d.temp_max));

      const lineTempMin = d3
        .line<WeatherDay>()
        .x(d => x(new Date(d.date)))
        .y(d => y1(d.temp_min));

      const linePrecipitation = d3
        .line<WeatherDay>()
        .x(d => x(new Date(d.date)))
        .y(d => y2(d.prec_prob || 0));

      const maxTempColorScale = d3.scaleSequential(d3.interpolateReds) // Color scale for max temperature
        .domain([d3.min(dailyData, d => d.temp_max) as number, d3.max(dailyData, d => d.temp_max) as number]);

      const minTempColorScale = d3.scaleSequential(d3.interpolateBlues) // Color scale for min temperature
        .domain([d3.min(dailyData, d => d.temp_min) as number, d3.max(dailyData, d => d.temp_min) as number]);

      const precColorScale = d3.scaleSequential(d3.interpolateGreens) // Color scale for precipitation
        .domain([d3.min(dailyData, d => d.prec_prob || 0) as number, d3.max(dailyData, d => d.prec_prob || 0) as number]);

      x.domain(d3.extent(dailyData, d => new Date(d.date)) as [Date, Date]);
      y1.domain([
        d3.min(dailyData, d => d.temp_min) as number,
        d3.max(dailyData, d => d.temp_max) as number
      ]);

      maxMinSvg
        .append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis);

      maxMinSvg
        .append('g')
        .attr('class', 'y axisLeft')
        .call(yAxisLeft);

      precipitationSvg
        .append('g')
        .attr('class', 'y axisRight')
        .call(yAxisRight);

      const cities = data.map(cityData => cityData.city.name); // Get city names

      cities.forEach((city, index) => {
        const cityData = data[index];
        const cityDailyData = cityData.daily;

        y1.domain([
          d3.min(cityDailyData, d => d.temp_min) as number,
          d3.max(cityDailyData, d => d.temp_max) as number
        ]);

        y2.domain([
          0,
          d3.max(cityDailyData, d => d.prec_prob || 0) as number
        ]);

        maxMinSvg
          .append('path')
          .datum(cityDailyData)
          .attr('class', 'line')
          .style('stroke', maxTempColorScale(cityDailyData[0].temp_max))
          .style('fill', 'none') // Set fill to none to avoid line overlap
          .attr('d', lineTempMax);

        maxMinSvg
          .append('path')
          .datum(cityDailyData)
          .attr('class', 'line')
          .style('stroke', minTempColorScale(cityDailyData[0].temp_min))
          .style('fill', 'none') // Set fill to none to avoid line overlap
          .attr('d', lineTempMin);

        precipitationSvg
          .append('path')
          .datum(cityDailyData)
          .attr('class', 'line')
          .style('stroke', precColorScale(index))
          .style('fill', 'none') // Set fill to none to avoid line overlap
          .attr('d', linePrecipitation);
      });
    }
  }, [data]);

  return (
    <div>
      <svg ref={maxMinRef} />
      <svg ref={precipitationRef} />
    </div>
  );
};

export default WeatherChart;

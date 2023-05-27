import { GetServerSideProps } from 'next'
import { WeatherReport, WeatherReportSchema } from '../schemas/weather' // adjust the path to your schema accordingly
import WeatherChart from '../components/weather'
import * as fs from "fs"; // adjust the path to your component accordingly

type WeatherPageProps = {
  weatherReport: WeatherReport
}

const WeatherPage = ({ weatherReport }: WeatherPageProps) => {
  return <WeatherChart data={weatherReport} />
}


export default WeatherPage

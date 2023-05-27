import { GetServerSideProps } from 'next'
import { WeatherReport, WeatherReportSchema } from '@/schemas/weather' // adjust the path to your schema accordingly
import WeatherChart from '../components/weather'
import * as fs from "fs"; // adjust the path to your component accordingly

type WeatherPageProps = {
  weatherReport: WeatherReport
}

const WeatherPage = ({ weatherReport }: WeatherPageProps) => {
  return <WeatherChart data={weatherReport} />
}

export const getServerSideProps: GetServerSideProps = async () => {
  const data = fs.readFileSync(process.env.WEATHER_FILE!).toString();

  const weatherReport = WeatherReportSchema.parse(JSON.parse(data));

  return {
    props: {
      weatherReport,
    },
  }
}



export default WeatherPage

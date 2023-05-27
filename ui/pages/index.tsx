import {WeatherReport, WeatherReportSchema} from "@/schemas/weather";
import {GetServerSideProps} from "next";
import fs from "fs";
import WeatherChart from "@/components/weather";
import RootLayout from "@/app/layout";

type WeatherPageProps = {
  weatherReport: WeatherReport
}

const Home: React.FC<WeatherPageProps> = ({weatherReport}) => {
  return (
    <RootLayout>
      <WeatherChart data={weatherReport} />
    </RootLayout>
  )
}

export const getServerSideProps: GetServerSideProps<WeatherPageProps> = async () => {
  const data = fs.readFileSync(process.env.WEATHER_FILE!).toString();

  const weatherReport = WeatherReportSchema.parse(JSON.parse(data));

  return {
    props: {
      weatherReport,
    },
  }
}

export default Home

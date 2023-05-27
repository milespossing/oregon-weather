mod weather;

use serde::Serialize;
use std::{fs::File, io::BufReader, env};
use weather::{weather_at_location, WeatherData, WeatherLocation, WeatherResponse};

async fn get_weather_from_api(
    location: &WeatherLocation,
) -> Result<WeatherResponse, Box<dyn std::error::Error>> {
    let weather = weather_at_location(&location).await?;
    Ok(weather)
}

#[derive(Serialize)]
struct WeatherReport {
    city: WeatherLocation,
    daily: Vec<WeatherData>,
}

impl WeatherReport {
    fn new(city: WeatherLocation, daily: Vec<WeatherData>) -> Self {
        Self { city, daily }
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let file_path = match env::var("WEATHER_FILE") {
        Ok(file_path) => file_path,
        Err(_) => {
            eprintln!("Please provide a file path as an environment variable");
            return Ok(());
        }
    };
    let file = File::open(file_path)?;
    let reader = BufReader::new(file);
    let cities: Vec<WeatherLocation> = serde_json::from_reader(reader)?;
    let mut reports: Vec<WeatherReport> = vec![];
    for city in cities {
        let result = get_weather_from_api(&city).await?;
        let daily = WeatherData::from_weather_response(result.daily);
        let report = WeatherReport::new(city, daily);
        reports.push(report);
    }
    let output_file = File::create("result.json")?;
    serde_json::to_writer(output_file, &reports)?;

    Ok(())
}

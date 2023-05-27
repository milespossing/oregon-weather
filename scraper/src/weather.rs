use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct WeatherLocation {
    pub name: String,
    pub lat: f32,
    pub lon: f32,
}

#[derive(Debug, Deserialize)]
pub struct WeatherResponseDaily {
    #[serde(alias = "time")]
    pub date: Vec<String>,
    #[serde(alias = "weathercode")]
    pub weather_code: Vec<u32>,
    #[serde(alias = "temperature_2m_max")]
    pub temp_max: Vec<f32>,
    #[serde(alias = "temperature_2m_min")]
    pub temp_min: Vec<f32>,
    #[serde(alias = "precipitation_probability_max")]
    pub prec_prob: Vec<Option<f32>>,
}

#[derive(Debug, Serialize)]
pub struct WeatherData {
    pub date: String,
    pub weather_code: u32,
    pub temp_max: f32,
    pub temp_min: f32,
    pub prec_prob: Option<f32>,
}

impl WeatherData {
    pub fn from_weather_response(resp: WeatherResponseDaily) -> Vec<WeatherData> {
        let mut output: Vec<WeatherData> = vec![];
        for i in 0..resp.date.len() {
            let new = WeatherData {
                date: resp.date[i].clone(),
                weather_code: resp.weather_code[i],
                temp_max: resp.temp_max[i],
                temp_min: resp.temp_min[i],
                prec_prob: resp.prec_prob[i],
            };
            output.push(new);
        }
        output
    }
}

#[derive(Debug, Deserialize)]
pub struct WeatherResponse {
    pub daily: WeatherResponseDaily,
}

fn format_query(location: &WeatherLocation) -> String {
    format!("https://api.open-meteo.com/v1/forecast?latitude={}&longitude={}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=14&timezone=America%2FLos_Angeles", location.lat, location.lon)
}

pub async fn weather_at_location(
    location: &WeatherLocation,
) -> Result<WeatherResponse, Box<dyn std::error::Error>> {
    let query = format_query(location);
    let resp = reqwest::get(query).await?.json::<WeatherResponse>().await?;
    Ok(resp)
}

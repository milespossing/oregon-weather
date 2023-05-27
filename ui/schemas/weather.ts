import { z } from "zod";

export const WeatherDaySchema = z.object({
  date: z.string(),
  weather_code: z.number(),
  temp_max: z.number(),
  temp_min: z.number(),
  prec_prob: z.number().nullable(),
});

export type WeatherDay = z.infer<typeof WeatherDaySchema>;

export const WeatherReportCitySchema = z.object({
  city: z.object({
    name: z.string(),
    lat: z.number(),
    lon: z.number(),
  }),
  daily: z.array(WeatherDaySchema),
})

export type WeatherReportCity = z.infer<typeof WeatherReportCitySchema> ;

export const WeatherReportSchema = z.array(WeatherReportCitySchema);
export type WeatherReport = z.infer<typeof WeatherReportSchema>;
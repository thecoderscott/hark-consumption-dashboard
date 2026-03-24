using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;
// HotChocolate exposes its own Path type which conflicts with System.IO.Path.
// Aliasing here avoids fully-qualified references throughout the file.
using Path = System.IO.Path;

namespace EnergyDashboard.Api.Data;

public static class CsvDataLoader
{
    // CsvHelper needs explicit column mappings because the CSV headers don't
    // match our C# record property names (e.g. "Date" vs "Timestamp").
    private sealed class EnergyRow
    {
        public string Timestamp { get; set; } = "";
        public double Consumption { get; set; }
    }

    private sealed class WeatherRow
    {
        public string Date { get; set; } = "";
        public double AverageTemperature { get; set; }
        public double AverageHumidity { get; set; }
    }

    public static IReadOnlyList<DashboardReading> Load(string dataDirectory)
    {
        var energyPath = Path.Combine(dataDirectory, "HalfHourlyEnergyData.csv");
        var weatherPath = Path.Combine(dataDirectory, "Weather.csv");
        var anomalyPath = Path.Combine(dataDirectory, "HalfHourlyEnergyDataAnomalies.csv");

        var energyRows = ReadCsv<EnergyRow>(energyPath);
        var weatherRows = ReadCsv<WeatherRow>(weatherPath);
        var anomalyRows = ReadCsv<EnergyRow>(anomalyPath);

        // Build a set of anomaly timestamps for O(1) lookup during join.
        var anomalyTimestamps = anomalyRows
            .Select(r => ParseIso(r.Timestamp))
            .ToHashSet();

        // Weather uses a different date format (dd/MM/yyyy HH:mm) and the file
        // has a UTF-8 BOM, so we normalise both sides to UTC DateTime for the join.
        // GroupBy + First handles the 7 exact duplicate rows in the source data.
        var weatherByTimestamp = weatherRows
            .GroupBy(r => ParseUkDate(r.Date))
            .ToDictionary(g => g.Key, g => g.First());

        var readings = energyRows
            .Select(e =>
            {
                var ts = ParseIso(e.Timestamp);

                // Not every energy row is guaranteed a weather match - fall back
                // to zero rather than crashing, so partial data still renders.
                weatherByTimestamp.TryGetValue(ts, out var weather);

                return new DashboardReading(
                    Timestamp: ts,
                    Consumption: e.Consumption,
                    IsAnomaly: anomalyTimestamps.Contains(ts),
                    AverageTemperature:weather?.AverageTemperature ?? 0,
                    AverageHumidity: weather?.AverageHumidity    ?? 0
                );
            })
            .OrderBy(r => r.Timestamp)
            .ToList();

        return readings;
    }

    private static List<T> ReadCsv<T>(string path)
    {
        // PrepareHeaderForMatch strips the BOM that Weather.csv includes - without
        // this, the "Date" header doesn't match and CsvHelper silently skips the column.
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            PrepareHeaderForMatch = args => args.Header.Trim('\uFEFF', ' ')
        };

        using var reader = new StreamReader(path);
        using var csv    = new CsvReader(reader, config);
        return csv.GetRecords<T>().ToList();
    }

    private static DateTime ParseIso(string value) =>
        // Energy and anomaly timestamps are ISO 8601 UTC ("2020-01-01T00:00:00Z").
        DateTime.Parse(value, CultureInfo.InvariantCulture, DateTimeStyles.AdjustToUniversal);

    private static DateTime ParseUkDate(string value) =>
        // Weather dates are in UK format ("01/01/2020 00:30"), treated as UTC.
        DateTime.ParseExact(value.Trim(), "dd/MM/yyyy HH:mm", CultureInfo.InvariantCulture,
            DateTimeStyles.AssumeUniversal | DateTimeStyles.AdjustToUniversal);
}

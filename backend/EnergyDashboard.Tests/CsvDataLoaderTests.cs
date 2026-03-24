using EnergyDashboard.Api.Data;
using FluentAssertions;

namespace EnergyDashboard.Tests;

// Each test gets its own isolated temp directory so tests can't bleed into each other.
// IDisposable cleans it up after the test completes.
public class CsvDataLoaderTests : IDisposable
{
    private readonly string _tempDir;

    public CsvDataLoaderTests()
    {
        _tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(_tempDir);
    }

    public void Dispose() => Directory.Delete(_tempDir, recursive: true);

    // ── Helpers ────────────────────────────────────────────────────────────────

    private void WriteEnergy(string content) =>
        File.WriteAllText(Path.Combine(_tempDir, "HalfHourlyEnergyData.csv"), content);

    private void WriteWeather(string content) =>
        File.WriteAllText(Path.Combine(_tempDir, "Weather.csv"), content);

    private void WriteAnomalies(string content) =>
        File.WriteAllText(Path.Combine(_tempDir, "HalfHourlyEnergyDataAnomalies.csv"), content);

    // Writes the three CSVs with sensible defaults so individual tests only
    // need to override the file(s) relevant to what they're testing.
    private void WriteDefaults()
    {
        WriteEnergy(
            "Timestamp,Consumption\n" +
            "2020-01-01T00:00:00Z,10.0\n" +
            "2020-01-01T00:30:00Z,20.0\n" +
            "2020-01-01T01:00:00Z,30.0");

        WriteWeather(
            "Date,AverageTemperature,AverageHumidity\n" +
            "01/01/2020 00:00,9.0,0.9\n" +
            "01/01/2020 00:30,8.5,0.85\n" +
            "01/01/2020 01:00,8.0,0.8");

        // Empty anomalies by default — tests that need anomalies write their own.
        WriteAnomalies("Timestamp,Consumption");
    }

    // ── Tests ──────────────────────────────────────────────────────────────────

    [Fact]
    public void Load_ReturnsOneReadingPerEnergyRow()
    {
        WriteDefaults();

        var result = CsvDataLoader.Load(_tempDir);

        result.Should().HaveCount(3);
    }

    [Fact]
    public void Load_ResultsAreOrderedByTimestamp()
    {
        // Write energy rows in reverse order to confirm sorting is applied.
        WriteEnergy(
            "Timestamp,Consumption\n" +
            "2020-01-01T01:00:00Z,30.0\n" +
            "2020-01-01T00:00:00Z,10.0\n" +
            "2020-01-01T00:30:00Z,20.0");
        WriteWeather("Date,AverageTemperature,AverageHumidity");
        WriteAnomalies("Timestamp,Consumption");

        var result = CsvDataLoader.Load(_tempDir);

        result.Select(r => r.Timestamp).Should().BeInAscendingOrder();
    }

    [Fact]
    public void Load_MapsConsumptionCorrectly()
    {
        WriteDefaults();

        var result = CsvDataLoader.Load(_tempDir);

        result[0].Consumption.Should().Be(10.0);
        result[1].Consumption.Should().Be(20.0);
        result[2].Consumption.Should().Be(30.0);
    }

    [Fact]
    public void Load_JoinsWeatherDataByTimestamp()
    {
        WriteDefaults();

        var result = CsvDataLoader.Load(_tempDir);

        // Verify the weather columns are correctly joined onto the matching energy row.
        result[0].AverageTemperature.Should().Be(9.0);
        result[0].AverageHumidity.Should().Be(0.9);
    }

    [Fact]
    public void Load_FallsBackToZeroWhenNoWeatherMatchExists()
    {
        WriteDefaults();
        // Write weather with no rows — no match possible for any energy timestamp.
        WriteWeather("Date,AverageTemperature,AverageHumidity");

        var result = CsvDataLoader.Load(_tempDir);

        result[0].AverageTemperature.Should().Be(0);
        result[0].AverageHumidity.Should().Be(0);
    }

    [Fact]
    public void Load_FlagsAnomalyRowsCorrectly()
    {
        WriteDefaults();
        // Only the 00:30 row is an anomaly.
        WriteAnomalies(
            "Timestamp,Consumption\n" +
            "2020-01-01T00:30:00Z,20.0");

        var result = CsvDataLoader.Load(_tempDir);

        result[0].IsAnomaly.Should().BeFalse();
        result[1].IsAnomaly.Should().BeTrue();
        result[2].IsAnomaly.Should().BeFalse();
    }

    [Fact]
    public void Load_NonAnomalyRowsAreNotFlagged()
    {
        WriteDefaults(); // anomalies file is empty by default

        var result = CsvDataLoader.Load(_tempDir);

        result.Should().AllSatisfy(r => r.IsAnomaly.Should().BeFalse());
    }

    [Fact]
    public void Load_HandlesDuplicateWeatherTimestamps()
    {
        WriteDefaults();
        // Duplicate rows for 00:00 — mirrors the real Weather.csv data quality issue.
        WriteWeather(
            "Date,AverageTemperature,AverageHumidity\n" +
            "01/01/2020 00:00,9.0,0.9\n" +
            "01/01/2020 00:00,9.0,0.9\n" +
            "01/01/2020 00:30,8.5,0.85\n" +
            "01/01/2020 01:00,8.0,0.8");

        // Should not throw and should still return all 3 energy rows.
        var act = () => CsvDataLoader.Load(_tempDir);

        act.Should().NotThrow();
        act().Should().HaveCount(3);
    }

    [Fact]
    public void Load_HandlesUtf8BomInWeatherCsv()
    {
        WriteDefaults();
        // Write Weather.csv with a BOM prefix — replicates how Excel saves CSV files.
        var bomHeader = "\uFEFFDate,AverageTemperature,AverageHumidity\n01/01/2020 00:00,9.0,0.9\n01/01/2020 00:30,8.5,0.85\n01/01/2020 01:00,8.0,0.8";
        WriteWeather(bomHeader);

        // Should parse correctly — BOM stripping in ReadCsv handles this.
        var act = () => CsvDataLoader.Load(_tempDir);

        act.Should().NotThrow();
        act()[0].AverageTemperature.Should().Be(9.0);
    }
}

using EnergyDashboard.Api.Data;
using EnergyDashboard.Api.GraphQL;
using FluentAssertions;
using Microsoft.Extensions.Configuration;

namespace EnergyDashboard.Tests;

public class QueryTests : IDisposable
{
    private readonly string _tempDir;

    public QueryTests()
    {
        _tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(_tempDir);

        // Write minimal CSVs so we can construct a real DataStore.
        File.WriteAllText(Path.Combine(_tempDir, "HalfHourlyEnergyData.csv"),
            "Timestamp,Consumption\n2020-01-01T00:00:00Z,10.0\n2020-01-01T00:30:00Z,20.0");
        File.WriteAllText(Path.Combine(_tempDir, "Weather.csv"),
            "Date,AverageTemperature,AverageHumidity\n01/01/2020 00:00,9.0,0.9\n01/01/2020 00:30,8.5,0.85");
        File.WriteAllText(Path.Combine(_tempDir, "HalfHourlyEnergyDataAnomalies.csv"),
            "Timestamp,Consumption");
    }

    public void Dispose() => Directory.Delete(_tempDir, recursive: true);

    private DataStore BuildStore() =>
        new(new ConfigurationBuilder()
            .AddInMemoryCollection(new Dictionary<string, string?> { ["DataDirectory"] = _tempDir })
            .Build());

    [Fact]
    public void GetDashboardReadings_ReturnsAllReadingsFromStore()
    {
        var store = BuildStore();
        var query = new Query();

        // The resolver is intentionally thin — it just returns store.Readings.
        // This test confirms the wiring is correct and nothing is filtered or transformed.
        var result = query.GetDashboardReadings(store);

        result.Should().BeEquivalentTo(store.Readings);
    }

    [Fact]
    public void GetDashboardReadings_ReturnsCorrectCount()
    {
        var store = BuildStore();
        var query = new Query();

        var result = query.GetDashboardReadings(store);

        result.Should().HaveCount(2);
    }
}

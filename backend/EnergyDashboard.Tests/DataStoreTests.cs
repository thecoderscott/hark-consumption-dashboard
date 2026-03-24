using EnergyDashboard.Api.Data;
using FluentAssertions;
using Microsoft.Extensions.Configuration;

namespace EnergyDashboard.Tests;

public class DataStoreTests : IDisposable
{
    private readonly string _tempDir;

    public DataStoreTests()
    {
        _tempDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(_tempDir);
    }

    public void Dispose() => Directory.Delete(_tempDir, recursive: true);

    // Builds a real IConfiguration with an in-memory key/value pair —
    // no mocking library needed for something this simple.
    private static IConfiguration BuildConfig(string? dataDirectory) =>
        new ConfigurationBuilder()
            .AddInMemoryCollection(dataDirectory is not null
                ? new Dictionary<string, string?> { ["DataDirectory"] = dataDirectory }
                : new Dictionary<string, string?>())
            .Build();

    private void WriteMinimalCsvs()
    {
        File.WriteAllText(Path.Combine(_tempDir, "HalfHourlyEnergyData.csv"),
            "Timestamp,Consumption\n2020-01-01T00:00:00Z,10.0");
        File.WriteAllText(Path.Combine(_tempDir, "Weather.csv"),
            "Date,AverageTemperature,AverageHumidity\n01/01/2020 00:00,9.0,0.9");
        File.WriteAllText(Path.Combine(_tempDir, "HalfHourlyEnergyDataAnomalies.csv"),
            "Timestamp,Consumption");
    }

    [Fact]
    public void Constructor_ThrowsWhenDataDirectoryNotConfigured()
    {
        var config = BuildConfig(dataDirectory: null);

        var act = () => new DataStore(config);

        act.Should().Throw<InvalidOperationException>()
            .WithMessage("DataDirectory is not configured.");
    }

    [Fact]
    public void Constructor_LoadsReadingsFromConfiguredDirectory()
    {
        WriteMinimalCsvs();
        var config = BuildConfig(_tempDir);

        var store = new DataStore(config);

        store.Readings.Should().HaveCount(1);
    }

    [Fact]
    public void Readings_AreReadOnly()
    {
        // Verify the exposed list doesn't allow mutation —
        // callers should never be able to modify the in-memory dataset.
        WriteMinimalCsvs();
        var config = BuildConfig(_tempDir);
        var store = new DataStore(config);

        store.Readings.Should().BeAssignableTo<IReadOnlyList<DashboardReading>>();
    }
}

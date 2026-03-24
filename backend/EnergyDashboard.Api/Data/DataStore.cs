namespace EnergyDashboard.Api.Data;

// We load everything into memory once at startup and never reload.
// 336 rows is tiny - this avoids per-request file I/O with zero downside.
// Registered as a singleton in Program.cs so DI hands the same instance
// to every GraphQL resolver.
public class DataStore
{
    public IReadOnlyList<DashboardReading> Readings { get; }

    public DataStore(IConfiguration config)
    {
        // DataDirectory is set in appsettings.json for local dev, and via env var in Docker.
        // Throwing here means a misconfigured path fails immediately at startup with a clear
        // message, rather than silently failing on the first request.
        var dataDir = config["DataDirectory"]
            ?? throw new InvalidOperationException("DataDirectory is not configured.");

        Readings = CsvDataLoader.Load(dataDir);
    }
}

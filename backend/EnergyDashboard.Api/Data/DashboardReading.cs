namespace EnergyDashboard.Api.Data;

// One merged row per half-hour interval - this is the shape GraphQL exposes.
// All three CSVs are joined into this flat record so the frontend gets everything
// it needs in a single query with no client-side joining.
public record DashboardReading(
    DateTime Timestamp,
    double Consumption,
    bool IsAnomaly,
    double AverageTemperature,
    double AverageHumidity
);

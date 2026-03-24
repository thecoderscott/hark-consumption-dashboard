using EnergyDashboard.Api.Data;

namespace EnergyDashboard.Api.GraphQL;

// Hot Chocolate discovers this class by convention (registered via AddQueryType<Query>).
// Each public method becomes a GraphQL field on the root Query type.
public class Query
{
    // Returns the full merged dataset. The frontend can filter/aggregate client-side
    // or we can add arguments (e.g. date range) later if needed.
    public IReadOnlyList<DashboardReading> GetDashboardReadings([Service] DataStore store)
        => store.Readings;
}

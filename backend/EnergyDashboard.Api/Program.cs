using EnergyDashboard.Api.Data;
using EnergyDashboard.Api.GraphQL;

var builder = WebApplication.CreateBuilder(args);

// Load CSVs once at startup.
// Loaded as a singleton to ensure all requests share the same
// in-memory data - fine for read-only data that never changes.
builder.Services.AddSingleton<DataStore>();

// CORS: allowing the FE project to call this API.
// In production both services would be on the same origin (Docker) so this
// could be tightened, but keeping it open for the tech test.
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

// Hot Chocolate: register the Query type and enable the Banana Cake Pop UI
// so queries can be tested at /graphql in the browser.
builder.Services
    .AddGraphQLServer()
    .AddQueryType<Query>();

var app = builder.Build();

app.UseCors();

// Banana Cake Pop playground - only useful in development, but leaving enabled
// for the tech test so reviewers can explore the schema.
app.MapGraphQL();

// "Warm up" the DataStore so any CSV parse errors surface at startup
// rather than on the first request. Failing fast is friendlier than a silent null.
// This will never fail for this tech test as the data will never change, however,
// good to show this has been considered for other, more complex, implementations.
app.Services.GetRequiredService<DataStore>();

app.Run();

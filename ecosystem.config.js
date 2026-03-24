const HOME = process.env.HOME || "/root";
const REPO = `${HOME}/hark-consumption-dashboard`;

module.exports = {
  apps: [
    {
      name: "hark-frontend",
      cwd: `${REPO}/frontend`,
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        // Points the server action at the backend running on the same machine.
        GRAPHQL_URL: "http://localhost:5000/graphql",
      },
    },
    {
      name: "hark-backend",
      cwd: `${REPO}/backend/EnergyDashboard.Api`,
      script: "dotnet",
      // Runs the published binary directly - faster startup than `dotnet run`
      // which triggers a rebuild every time.
      args: `${REPO}/backend/EnergyDashboard.Api/publish/EnergyDashboard.Api.dll`,
      interpreter: "none",
      env: {
        ASPNETCORE_ENVIRONMENT: "Production",
        ASPNETCORE_URLS: "http://localhost:5000",
        // Absolute path so the backend can find the CSVs regardless of where
        // the process is started from.
        DataDirectory: `${REPO}/data`,
      },
    },
  ],
};

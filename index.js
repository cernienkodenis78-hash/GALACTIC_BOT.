const http = require("http");
const { statusBedrock } = require("minecraft-server-util");

const host = process.env.MC_HOST || "ASTRIXSMP-HwFm.aternos.me";
const port = Number(process.env.MC_PORT || "43831");
const httpPort = Number(process.env.PORT || "10000");

let latest = {
  checkedAt: null,
  server: host + ":" + port,
  status: "NOT_CHECKED"
};

async function checkServer() {
  try {
    const result = await statusBedrock(host, port, { timeout: 8000 });
    latest = {
      checkedAt: new Date().toISOString(),
      server: host + ":" + port,
      status: "ONLINE",
      players: result.players,
      version: result.version
    };
  } catch (error) {
    latest = {
      checkedAt: new Date().toISOString(),
      server: host + ":" + port,
      status: "OFFLINE_OR_UNREACHABLE",
      message: String(error.message || error).slice(0, 200)
    };
  }
  console.log(JSON.stringify(latest));
}

const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  if (req.url === "/") {
    res.end(JSON.stringify({
      name: "Aternos Watchdog",
      description: "Bedrock server status monitor",
      statusEndpoint: "/status",
      note: "This service monitors status only; it does not start Aternos servers."
    }, null, 2));
    return;
  }
  if (req.url === "/status") {
    res.end(JSON.stringify(latest, null, 2));
    return;
  }
  res.statusCode = 404;
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(httpPort, "0.0.0.0", () => {
  console.log("Aternos Watchdog listening on port " + httpPort);
  checkServer();
  setInterval(checkServer, 5 * 60 * 1000);
});

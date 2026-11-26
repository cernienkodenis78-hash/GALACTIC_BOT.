const { statusBedrock } = require("minecraft-server-util");

const host = process.env.MC_HOST || "ASTRIXSMP-HwFm.aternos.me";
const port = Number(process.env.MC_PORT || "43831");

(async () => {
  try {
    const result = await statusBedrock(host, port, { timeout: 8000 });
    console.log(JSON.stringify({
      checkedAt: new Date().toISOString(),
      server: host + ":" + port,
      status: "ONLINE",
      players: result.players,
      version: result.version
    }));
  } catch (error) {
    console.log(JSON.stringify({
      checkedAt: new Date().toISOString(),
      server: host + ":" + port,
      status: "OFFLINE_OR_UNREACHABLE",
      message: String(error.message || error).slice(0, 200)
    }));
  }
})();

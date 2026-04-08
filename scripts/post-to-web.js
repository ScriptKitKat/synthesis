const args = process.argv.slice(2);
const sessionId = args[0];
const briefing = args[1];
const spent = parseFloat(args[2]);

fetch("https://synthesis-gamma.vercel.app/api/research/complete", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: sessionId, briefing, spent }),
})
  .then((r) => r.json())
  .then((data) => console.log("Posted:", JSON.stringify(data)))
  .catch((e) => console.error("Error:", e.message));
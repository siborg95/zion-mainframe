app.post("/gpt", async (req, res) => {
  try {
    const { prompt } = req.body || {};
    if (!prompt) {
      return res.status(400).json({ ok: false, error: "missing_prompt" });
    }
    if (!API_KEY) {
      return res.status(500).json({ ok: false, error: "missing_api_key" });
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000); // 15s safety timeout

    const r = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input: prompt
      })
    }).catch((e) => {
      throw new Error(`fetch_failed: ${e.message}`);
    });
    clearTimeout(timer);

    const data = await r.json().catch(() => ({}));

    if (!r.ok) {
      console.error("OpenAI HTTP", r.status, data);
      return res.status(502).json({
        ok: false,
        error: "openai_http_error",
        status: r.status
      });
    }

    // Always try multiple extraction points
    let text = "";
    if (typeof data.output_text === "string" && data.output_text.trim()) {
      text = data.output_text.trim();
    } else if (Array.isArray(data.output)) {
      text = data.output
        .map(part => Array.isArray(part.content)
          ? part.content.map(c => c.text?.value || "").join("")
          : "")
        .join("")
        .trim();
    } else if (data.choices?.[0]?.message?.content) {
      text = data.choices[0].message

<style scoped>
/* White (light) page background */
.page {
  min-height: 100vh;
  margin: 0;
  background: #f7f8fb;
  display: flex;
  align-items: center;
  justify-content: flex-start;   /* move content higher */
  padding: 32px 24px 24px;       /* top padding instead of perfect center */
  box-sizing: border-box;
  color: #111827;
}

/* Card width; logo will be slightly smaller than this */
.wrap { width: 100%; max-width: 440px; text-align: center; }

/* Logo: a bit smaller than the box, keep aspect ratio, tighter spacing */
.logo {
  width: 90%;           /* slightly narrower than the card */
  max-width: 420px;     /* guardrail on very wide screens */
  height: auto;
  display: block;
  margin: 4px auto 14px;/* less top/bottom gap so more room for the card */
  user-select: none;
}

/* Blue login box */
.card {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #ffffff;
  border-radius: 14px;
  padding: 24px;
  box-shadow: 0 14px 28px rgba(0,0,0,0.18);
  text-align: left;
}

.title {
  margin: 0 0 14px;
  font-size: 22px;
  font-weight: 700;
  text-align: center;
  color: #ffffff;
}

.field { margin-bottom: 14px; }
.label { display: block; font-size: 13px; margin-bottom: 6px; color: rgba(255,255,255,0.9); }
.passrow { position: relative; }

/* White inputs on blue card */
.input {
  width: 100%;
  padding: 12px 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  outline: none;
  box-sizing: border-box;
  transition: border .15s, box-shadow .15s, background .15s;
}
.input::placeholder { color: #6b7280; }
.input:focus {
  border-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(255,255,255,0.35);
  background: #ffffff;
}

.eye {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  height: 32px; padding: 0 10px; border: 0; border-radius: 8px;
  background: transparent; color: #374151; cursor: pointer;
}

/* Button: white on blue card */
.btn {
  width: 100%;
  margin-top: 8px;
  padding: 12px 14px;
  border: 0;
  border-radius: 10px;
  font-weight: 700;
  background: #ffffff;
  color: #0b0f1a;
  cursor: pointer;
  transition: transform .05s ease, box-shadow .15s ease, filter .15s ease;
}
.btn:hover { filter: brightness(0.98); box-shadow: 0 8px 18px rgba(255,255,255,.25); }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: .65; cursor: default; }

.spinner {
  width: 16px; height: 16px; border-radius: 50%;
  border: 2px solid rgba(0,0,0,0.25); border-top-color: rgba(0,0,0,0.75);
  display: inline-block; margin-right: 8px; vertical-align: -2px;
  animation: spin 0.9s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

.error { margin-top: 10px; color: #b91c1c; text-align: center; font-size: 13px; }

/* Tagline on white page */
.tagline { margin-top: 14px; color: #374151; font-size: 13px; }
.tagline strong { color: #111827; }
</style>

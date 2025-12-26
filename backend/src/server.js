import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { v1Router } from "./routes/v1/index.js";

const app = express();

app.use(cors({
  origin: "https://iawhats.com.mx",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false
}));

app.options("*", cors());

app.use(express.json({ limit: "2mb" }));

app.get("/health", (req, res) => res.status(200).send("ok"));

app.use("/v1", v1Router);

app.get("/", (req, res) => {
  res.json({
    ok: true,
    service: "Saas-Formularios API",
    status: "API Ready",
    day: 1,
    docs: "/v1/meta"
  });
});

app.listen(env.PORT, () => {
  console.log(`[api] listening on :${env.PORT} (${env.NODE_ENV})`);
});


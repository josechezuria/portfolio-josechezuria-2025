import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";

dotenv.config();

const app = express();
// Use INTERNAL_PORT for Docker, fallback to PORT for local dev
const PORT = process.env.INTERNAL_PORT || process.env.INTERNAL_PORT_DEV || process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security: Helmet middleware - sets various HTTP headers for security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdnjs.cloudflare.com",
        ],
        fontSrc: [
          "'self'",
          "https://fonts.gstatic.com",
          "https://cdnjs.cloudflare.com",
        ],
        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net",
        ],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// Security: Rate limiting to prevent abuse
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all requests
app.use(limiter);

// Performance: Compress responses
app.use(compression());

// Disable X-Powered-By header
app.disable("x-powered-by");

// Serve static files (css, js, images) with caching in production
const staticOptions = NODE_ENV === "production"
  ? { maxAge: "1d", etag: true }
  : {};
app.use(express.static(path.join(__dirname, "public"), staticOptions));

// Route for homepage
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Portfolio running at http://0.0.0.0:${PORT}`);
  console.log(`🔒 Environment: ${NODE_ENV}`);
  console.log(`📱 Access from Tailscale device: http://[YOUR-TAILSCALE-IP]:${PORT}`);
});

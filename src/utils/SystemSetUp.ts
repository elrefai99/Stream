import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import useragent from "express-useragent";
import requestIp from "request-ip";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
// import expressLayouts from 'express-ejs-layouts'
import flash from 'connect-flash'

// Create the rate limit rule
const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request | any) => req.clientIP, // Use custom IP
  handler: (_req: Request, res: Response) => {
    res.status(429).json({ code: 429, status: "Too Many Requests", message: "Too many requests from this IP, please try again after an 7 min", });
  },
});

export default (app: Application) => {
  const allowedOrigins = ["http://localhost:8000", "http://localhost:8001", "http://localhost:8002", "http://localhost:1935", "http://localhost:9000"];
  const corsOptions = {
    origin: (origin: any, callback: any) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    optionsSuccessState: 200,
  };

  app.use(helmet());
  app.use(requestIp.mw());
  app.use(express.json());
  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use("/v0/public", express.static("public"));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(morgan("dev"));
  app.use(useragent.express());
  app.use(async (req: Request | any, _res: Response, next: NextFunction) => {
    const clientIP = req.headers["cf-connecting-ip"] || req.headers["x-real-ip"] || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "";
    req.clientIP = clientIP;
    next();
  });
  app.use(limiter);

  // app.use(expressLayouts);
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '../views'));
  app.use(express.static(path.join(__dirname, '../views/Shared')));
  app.use(express.static(path.join(__dirname, '../views/CSS')));

  app.use(flash());
}

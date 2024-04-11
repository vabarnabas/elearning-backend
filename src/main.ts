import cors from "cors"
import * as dotenv from "dotenv"
import express from "express"

import { authRouter } from "./routes/auth/auth.controller"
import { courseRouter } from "./routes/course/course.controller"
import { courseClassRouter } from "./routes/course-class/course-class.controller"

dotenv.config()

async function start() {
  const app = express()

  app.use(express.json())
  app.use(cors())

  app.use("/auth", authRouter)
  app.use("/course", courseRouter)
  app.use("/course-class", courseClassRouter)

  app.use((err, _req, res, _next) => {
    const status = err.status || 500
    res.status(status).json({ error: err.message })
  })

  app.get("/", (_req, res) => {
    res.status(200).send("Hello World")
  })

  try {
    app.listen(process.env.PORT || 3000)
    console.log(`🚀 Server is running at port ${process.env.PORT || 3000}`)
  } catch (e) {
    console.error("⛔️ Something went wrong (" + e + ")")
  }
}

start()

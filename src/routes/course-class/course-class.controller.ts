import { Router } from "express"

import authenticate from "../../middleware/auth/auth.middleware"
import { CreateCourseClassDto } from "../../types/dto/course-class/create-course-class.dto"
import { UpdateCourseClassDto } from "../../types/dto/course-class/update-course-class.dto"
import CourseClassService from "./course-class.service"

const router = Router()

router.get("/", async (_req, res, next) => {
  try {
    const response = await CourseClassService.findAll()
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get("/:id", async (req, res, next) => {
  const { id } = req.params

  try {
    const response = await CourseClassService.findSpecific(id)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post("/", async (req, res, next) => {
  const dto = req.body as CreateCourseClassDto

  try {
    const response = await CourseClassService.create(dto)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post("/complete/:id", authenticate, async (req, res, next) => {
  const { id } = req.params
  const tokenUser = req["user"]

  try {
    const response = await CourseClassService.complete(id, tokenUser.id)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post("/incomplete/:id", authenticate, async (req, res, next) => {
  const { id } = req.params
  const tokenUser = req["user"]

  try {
    const response = await CourseClassService.complete(id, tokenUser.id)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params
  const dto = req.body as UpdateCourseClassDto

  try {
    const response = await CourseClassService.update(id, dto)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params

  try {
    const response = await CourseClassService.delete(id)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

export const courseClassRouter = router

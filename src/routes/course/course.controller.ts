import { Router } from "express"

import { CreateCourseDto } from "../../types/dto/course/create-course.dto"
import { UpdateCourseDto } from "../../types/dto/course/update-course.dto"
import CourseService from "./course.service"

const router = Router()

router.get("/", async (_req, res, next) => {
  try {
    const response = await CourseService.findAll()
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.get("/:id", async (req, res, next) => {
  const { id } = req.params

  try {
    const response = await CourseService.findSpecific(id)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post("/", async (req, res, next) => {
  const dto = req.body as CreateCourseDto

  try {
    const response = await CourseService.create(dto)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.patch("/:id/class/add/:classId", async (req, res, next) => {
  const { id, classId } = req.params

  try {
    const response = await CourseService.addClass(id, classId)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.patch("/:id/class/remove/:classId", async (req, res, next) => {
  const { id, classId } = req.params

  try {
    const response = await CourseService.removeClass(id, classId)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params
  const dto = req.body as UpdateCourseDto

  try {
    const response = await CourseService.update(id, dto)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params

  try {
    const response = await CourseService.delete(id)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

export const courseRouter = router

import { Router } from "express"

import { BadRequestError } from "../../errors/errors"
import authenticate from "../../middleware/auth/auth.middleware"
import { LoginDto } from "../../types/dto/auth/login.dto"
import { RegisterDto } from "../../types/dto/auth/register.dto"
import AuthService from "./auth.service"

const router = Router()

router.get("/current", authenticate, async (req, res, next) => {
  const tokenUser = req["user"]

  try {
    const response = await AuthService.getCurrentUser(tokenUser.id)
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post("/login", async (req, res, next) => {
  const { identifier, password } = req.body as LoginDto

  if (!identifier || !password) {
    return BadRequestError(res)
  }

  try {
    const response = await AuthService.login({ identifier, password })
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

router.post("/register", authenticate, async (req, res, next) => {
  const { displayName, email, password, userName, isAdmin } =
    req.body as RegisterDto

  try {
    const response = await AuthService.register({
      displayName,
      email,
      password,
      userName,
      isAdmin,
    })
    return res.status(200).json(response)
  } catch (e) {
    next(e)
  }
})

export const authRouter = router

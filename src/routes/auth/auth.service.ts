import { compare, genSalt, hash } from "bcrypt"
import jwt from "jsonwebtoken"

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/errors"
import { prisma } from "../../prisma"
import { LoginDto } from "../../types/dto/auth/login.dto"
import { RegisterDto } from "../../types/dto/auth/register.dto"

export default class AuthService {
  static async getToken(id: string, identifier: string, userName: string) {
    const at = jwt.sign(
      { id, identifier, userName },
      process.env.TOKEN_SECRET as string,
      { expiresIn: 24 * 60 * 60 },
    )

    return {
      access_token: at,
      refresh_token: "",
    }
  }

  static async getCurrentUser(id: string) {
    return await prisma.user.findUnique({
      where: { id },
    })
  }

  static async login(dto: LoginDto) {
    const users = await prisma.user.findMany({
      where: { OR: [{ email: dto.identifier }, { userName: dto.identifier }] },
    })

    if (0 === users.length) {
      NotFoundError()
    }

    const user = users[0]

    const passwordMatches = await compare(dto.password, user.password)
    if (!passwordMatches) {
      ForbiddenError()
    }

    return await this.getToken(user.id, user.email, user.userName)
  }

  static async register(dto: RegisterDto) {
    if (!dto.password || !dto.displayName || !dto.email || !dto.userName) {
      BadRequestError()
    }

    const salt = await genSalt()
    dto.password = await hash(dto.password, salt)

    return await prisma.user.create({
      data: dto,
    })
  }
}

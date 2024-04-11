import { BadRequestError, NotFoundError } from "../../errors/errors"
import { prisma } from "../../prisma"
import { CreateCourseClassDto } from "../../types/dto/course-class/create-course-class.dto"
import { UpdateCourseClassDto } from "../../types/dto/course-class/update-course-class.dto"

export default class CourseClassService {
  static async findAll() {
    return await prisma.courseClass.findMany()
  }

  static async findSpecific(id: string) {
    const courseClasses = await prisma.courseClass.findMany({
      where: {
        OR: [{ id: { equals: id } }, { slug: { equals: id } }],
      },
    })

    if (!courseClasses.length) {
      NotFoundError()
    }

    const courseClass = courseClasses[0]

    return courseClass
  }

  static async create(dto: CreateCourseClassDto) {
    if (!dto.displayName || !dto.slug || !dto.embedId) {
      BadRequestError()
    }

    return await prisma.courseClass.create({ data: dto })
  }

  static async complete(id: string, userId: string) {
    const courseClass = await prisma.courseClass.findUnique({
      where: {
        id,
      },
    })

    if (!courseClass) {
      NotFoundError()
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { completedClassIds: { push: id } },
    })
  }

  static async update(id: string, dto: UpdateCourseClassDto) {
    const courseClass = await prisma.courseClass.findUnique({
      where: {
        id,
      },
    })

    if (!courseClass) {
      NotFoundError()
    }

    return await prisma.courseClass.update({
      where: { id: courseClass.id },
      data: dto,
    })
  }

  static async delete(id: string) {
    const courseClass = await prisma.courseClass.findUnique({
      where: {
        id,
      },
    })

    if (!courseClass) {
      NotFoundError()
    }

    return await prisma.courseClass.delete({
      where: { id: courseClass.id },
    })
  }
}

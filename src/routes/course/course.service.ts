import { BadRequestError, NotFoundError } from "../../errors/errors"
import { prisma } from "../../prisma"
import { CreateCourseDto } from "../../types/dto/course/create-course.dto"
import { UpdateCourseDto } from "../../types/dto/course/update-course.dto"

export default class CourseService {
  static async findAll() {
    return await prisma.course.findMany()
  }

  static async findSpecific(id: string) {
    const courses = await prisma.course.findMany({
      where: {
        OR: [{ id: { equals: id } }, { slug: { equals: id } }],
      },
    })

    if (!courses.length) {
      NotFoundError()
    }

    const course = courses[0]

    const classes = await prisma.courseClass.findMany({
      where: { id: { in: course.classIds } },
    })

    const creator = await prisma.user.findUnique({
      where: { id: course.creatorId },
    })

    return { ...course, classes, creator }
  }

  static async create(dto: CreateCourseDto) {
    if (
      !dto.displayName ||
      !dto.classIds ||
      dto.cost === undefined ||
      !dto.description ||
      !dto.shortDescription ||
      !dto.imageUrl ||
      dto.isAvailable === undefined ||
      !dto.slug ||
      !dto.creatorId ||
      !dto.categories
    ) {
      BadRequestError()
    }

    return await prisma.course.create({ data: dto })
  }

  static async update(id: string, dto: UpdateCourseDto) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!course) {
      NotFoundError()
    }

    return await prisma.course.update({
      where: { id: course.id },
      data: dto,
    })
  }

  static async addCourseToOwned(id: string, userId: string) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!course) {
      NotFoundError()
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })

    if (!user) {
      NotFoundError()
    }

    if (user.ownedCourseIds.includes(id)) {
      return course
    }

    return await prisma.user.update({
      where: { id: userId },
      data: {
        ownedCourseIds: { push: id },
      },
    })
  }

  static async addClass(id: string, classId: string) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!course) {
      NotFoundError()
    }

    if (course.classIds.includes(classId)) {
      return course
    }

    return await prisma.course.update({
      where: { id: course.id },
      data: { ...course, classIds: [...course.classIds, classId] },
    })
  }

  static async removeClass(id: string, classId: string) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!course) {
      NotFoundError()
    }

    return await prisma.course.update({
      where: { id: course.id },
      data: {
        ...course,
        classIds: course.classIds.filter((id) => id !== classId),
      },
    })
  }

  static async delete(id: string) {
    const course = await prisma.course.findUnique({
      where: {
        id,
      },
    })

    if (!course) {
      NotFoundError()
    }

    return await prisma.course.delete({
      where: { id: course.id },
    })
  }
}

import { Course, CourseClass, PrismaClient, User } from "@prisma/client"
import { genSalt, hash } from "bcrypt"

const prisma = new PrismaClient()

const user: Omit<User, "id"> = {
  displayName: "Super Admin",
  email: "superadmin@coursel.barnabee.studio",
  userName: "superadmin",
  password: "aa",
  completedClassIds: [],
  isAdministrator: true,
  isEducator: true,
  ownedCourseIds: [],
}

const courseClass: Omit<CourseClass, "id"> = {
  displayName: "Test Class",
  description: "This is test class",
  type: "video",
  categories: ["Test"],
  url: "https://www.youtube.com/watch?v=Big_aFLmekI",
  slug: "test-class",
}

const course: Omit<Course, "id" | "creatorId"> = {
  displayName: "Test Course",
  description: "This is a test course.",
  shortDescription: "This is a test course.",
  imageUrl:
    "https://images.unsplash.com/photo-1547754145-ef9ff306e3f3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fHRhdHRvb3xlbnwwfHwwfHx8MA%3D%3D",
  cost: 0,
  classIds: [],
  isAvailable: true,
  slug: "test-course",
  categories: ["Test"],
}

const main = async () => {
  if (user.password) {
    const salt = await genSalt()
    user.password = await hash(user.password, salt)
  }

  const createdCourseClass = await prisma.courseClass.create({
    data: courseClass,
  })

  const createdUser = await prisma.user.create({
    data: user,
  })

  await prisma.course.create({
    data: {
      ...course,
      classIds: [createdCourseClass.id],
      creatorId: createdUser.id,
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

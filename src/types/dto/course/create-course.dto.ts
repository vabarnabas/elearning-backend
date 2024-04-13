export interface CreateCourseDto {
  slug: string
  displayName: string
  description: string
  shortDescription: string
  cost: number
  isAvailable: boolean
  imageUrl: string
  classIds: string[]
  creatorId: string
  categories: string[]
}

export interface PersonImage {
  medium: string
  original: string
}

export interface Person {
  id: number
  name: string
  image: PersonImage | null
}

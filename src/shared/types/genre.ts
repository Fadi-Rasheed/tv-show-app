export const SHOW_GENRE = {
  ACTION: 'Action',
  ADULT: 'Adult',
  ADVENTURE: 'Adventure',
  ANIME: 'Anime',
  CHILDREN: 'Children',
  COMEDY: 'Comedy',
  CRIME: 'Crime',
  DIY: 'DIY',
  DRAMA: 'Drama',
  ESPIONAGE: 'Espionage',
  FAMILY: 'Family',
  FANTASY: 'Fantasy',
  FOOD: 'Food',
  HISTORY: 'History',
  HORROR: 'Horror',
  LEGAL: 'Legal',
  MEDICAL: 'Medical',
  MUSIC: 'Music',
  MYSTERY: 'Mystery',
  NATURE: 'Nature',
  ROMANCE: 'Romance',
  SCIENCE_FICTION: 'Science-Fiction',
  SPORTS: 'Sports',
  SUPERNATURAL: 'Supernatural',
  THRILLER: 'Thriller',
  TRAVEL: 'Travel',
  WAR: 'War',
  WESTERN: 'Western',
} as const

export type ShowGenre = (typeof SHOW_GENRE)[keyof typeof SHOW_GENRE]

export const SHOW_GENRES = Object.values(SHOW_GENRE)

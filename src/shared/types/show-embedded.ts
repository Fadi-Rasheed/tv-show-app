import type { Person } from './person'
import type { Show } from './show'

export interface EmbeddedCastCredit {
  person: Person
  character?: {
    id?: number
    name: string
  }
  self?: boolean
  voice?: boolean
}

export interface ShowWithEmbedded extends Show {
  _embedded?: {
    cast?: EmbeddedCastCredit[]
  }
}

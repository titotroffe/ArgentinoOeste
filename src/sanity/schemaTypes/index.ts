import { type SchemaTypeDefinition } from 'sanity'
import { nota } from './nota'
import { matchDetails } from './matchDetails'
import { team } from './team'
import { player } from './player'
import { leyenda } from './leyenda'
import { chatLog } from './chatLog'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [nota, matchDetails, team, player, leyenda, chatLog],
}

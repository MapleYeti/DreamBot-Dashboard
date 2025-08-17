export function getSkillEmoji(skill: string): string {
  switch (skill) {
    //F2P skills
    case 'Attack':
      return '🗡️'
    case 'Strength':
      return '💪'
    case 'Defence':
      return '🛡️'
    case 'Ranged':
      return '🏹'
    case 'Prayer':
      return '🙏'
    case 'Magic':
      return '🧙‍♂️'
    case 'Runecrafting':
      return '🔮'
    case 'Hitpoints':
      return '❤️'
    case 'Crafting':
      return '🛠️'
    case 'Mining':
      return '⛏️'
    case 'Smithing':
      return '🔨'
    case 'Fishing':
      return '🎣'
    case 'Cooking':
      return '🥣'
    case 'Firemaking':
      return '🔥'
    case 'Woodcutting':
      return '🌳'

    //Members only skills
    case 'Agility':
      return '🏃‍♂️'
    case 'Herblore':
      return '🌿'
    case 'Thieving':
      return '💰'
    case 'Fletching':
      return '🎯'
    case 'Slayer':
      return '👹'
    case 'Farming':
      return '🌱'
    case 'Construction':
      return '🏠'
    case 'Hunter':
      return '🐺'

    // Special
    case 'Combat':
      return '⚔️'

    default:
      return '❓'
  }
}

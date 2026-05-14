export function getCharacterNameFromTitle(title: string): string {
  return title
    .replace(/\s+Beginner Character Guide for Smash Ultimate$/i, "")
    .replace(/\s+Character Guide for Smash Ultimate$/i, "")
    .replace(/\s+Beginner Guide for Smash Ultimate$/i, "")
    .replace(/\s+Guide for Smash Ultimate$/i, "")
    .replace(/\s+Character Guide$/i, "")
    .trim();
}

export function buildCharacterGuideDisplayTitle(characterName: string): string {
  return `${characterName} Guide - Combos, Matchups & Tips`;
}

export function buildCharacterGuideSeoTitle(characterName: string): string {
  return `${characterName} Guide - Combos, Matchups & Tips | Smash Ultimate`;
}

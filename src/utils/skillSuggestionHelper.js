import skills from '../constants/SkillsSuggestion';
skills = new Array(new Set(skills));

export function suggestSkill(input) {
    const refinedInput = input.toLowerCase().trim();
    if (!refinedInput) return [];
    return skills.filter(skill => skill.toLowerCase().includes(refinedInput)).slice(0,15);
}
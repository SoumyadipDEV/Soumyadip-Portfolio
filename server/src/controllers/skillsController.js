import {
  createCreateController,
  createDeleteController,
  createListController,
  createUpdateController,
} from './crudControllerFactory.js';

const tableName = 'skills';

const groupSkillsByCategory = (skills) =>
  skills.reduce((groups, skill) => {
    const category = skill.category || 'Other';
    groups[category] = groups[category] || [];
    groups[category].push(skill);
    return groups;
  }, {});

export const getSkills = createListController(tableName, {
  orderBy: 'category',
  secondaryOrderBy: 'display_order',
  secondaryAscending: true,
  transform: groupSkillsByCategory,
});
export const createSkill = createCreateController(tableName);
export const updateSkill = createUpdateController(tableName);
export const deleteSkill = createDeleteController(tableName);

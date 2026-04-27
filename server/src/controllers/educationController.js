import {
  createCreateController,
  createDeleteController,
  createListController,
  createUpdateController,
} from './crudControllerFactory.js';

const tableName = 'education';

export const getEducation = createListController(tableName, {
  secondaryOrderBy: 'created_at',
});
export const createEducation = createCreateController(tableName);
export const updateEducation = createUpdateController(tableName);
export const deleteEducation = createDeleteController(tableName);

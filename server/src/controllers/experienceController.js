import {
  createCreateController,
  createDeleteController,
  createListController,
  createUpdateController,
} from './crudControllerFactory.js';

const tableName = 'experience';

export const getExperience = createListController(tableName, {
  secondaryOrderBy: 'created_at',
});
export const createExperience = createCreateController(tableName);
export const updateExperience = createUpdateController(tableName);
export const deleteExperience = createDeleteController(tableName);

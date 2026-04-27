import {
  createCreateController,
  createDeleteController,
  createListController,
  createUpdateController,
} from './crudControllerFactory.js';

const tableName = 'hobbies';

export const getHobbies = createListController(tableName, {
  secondaryOrderBy: 'name',
  secondaryAscending: true,
});
export const createHobby = createCreateController(tableName);
export const updateHobby = createUpdateController(tableName);
export const deleteHobby = createDeleteController(tableName);

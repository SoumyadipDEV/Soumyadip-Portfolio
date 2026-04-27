import {
  createCreateController,
  createDeleteController,
  createListController,
  createUpdateController,
} from './crudControllerFactory.js';

const tableName = 'projects';

export const getProjects = createListController(tableName, {
  secondaryOrderBy: 'created_at',
});

export const getFeaturedProjects = createListController(tableName, {
  filters: [{ operator: 'eq', column: 'is_featured', value: true }],
  secondaryOrderBy: 'created_at',
});

export const createProject = createCreateController(tableName);
export const updateProject = createUpdateController(tableName);
export const deleteProject = createDeleteController(tableName);

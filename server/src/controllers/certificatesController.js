import {
  createCreateController,
  createDeleteController,
  createListController,
  createUpdateController,
} from './crudControllerFactory.js';

const tableName = 'certificates';

export const getCertificates = createListController(tableName, {
  secondaryOrderBy: 'created_at',
});
export const createCertificate = createCreateController(tableName);
export const updateCertificate = createUpdateController(tableName);
export const deleteCertificate = createDeleteController(tableName);

import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import Joi from 'joi';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contact.js';
import { contactCreateSchema, contactUpdateSchema } from '../schemas/contact.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.post('/', upload.single('photo'), validateBody(contactCreateSchema), ctrlWrapper(createContactController));

router
  .route('/:contactId')
  .all(isValidId)
  .get(ctrlWrapper(getContactByIdController))
  .patch(validateBody(contactUpdateSchema), ctrlWrapper(updateContactController))
  .delete(ctrlWrapper(deleteContactController));

export default router;
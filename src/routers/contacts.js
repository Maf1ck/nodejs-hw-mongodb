import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contact.js';
import Joi from 'joi';
import validateBody from '../middlewares/validateBody.js';
import { contactUpdateSchema } from '../schemas/contact.js';

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.post('/', upload.single('photo'), ctrlWrapper(createContactController));

router
  .route('/:contactId')
  .get(ctrlWrapper(getContactByIdController))
  .patch(upload.single('photo'), validateBody(contactUpdateSchema), ctrlWrapper(updateContactController))
  .delete(ctrlWrapper(deleteContactController));

export default router;
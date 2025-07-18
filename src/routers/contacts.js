import { Router } from 'express';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  updateContactController,
} from '../controllers/contact.js';
import Joi from 'joi';
import validateBody from '../middlewares/validateBody.js';
import isValidId from '../middlewares/isValidId.js';

const contactCreateSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal').required(),
});

const contactUpdateSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().email().min(3).max(20),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid('work', 'home', 'personal'),
}).min(1);

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router
  .route('/:contactId')
  .all(isValidId)
  .get(ctrlWrapper(getContactByIdController))
  .patch(validateBody(contactUpdateSchema), ctrlWrapper(updateContactController))
  .delete(ctrlWrapper(deleteContactController));
router.post('/', validateBody(contactCreateSchema), ctrlWrapper(createContactController));

export default router;
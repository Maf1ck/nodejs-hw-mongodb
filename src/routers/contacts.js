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

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:contactId', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));
router.patch('/:contactId', ctrlWrapper(updateContactController));

export default router;
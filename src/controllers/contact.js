import {
  getAllContacts as getAllContactsService,
  getContactById as getContactByIdService,
  createContact as createContactService,
  deleteContact as deleteContactService,
  updateContact as updateContactService,
} from '../services/contact.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  const { page = 1, limit = 10, sortBy, sortByDesc, filter } = req.query;
  const skip = (page - 1) * limit;
  const sort = {};
  if (sortBy) sort[sortBy] = 1;
  if (sortByDesc) sort[sortByDesc] = -1;
  let filterQuery = { userId: req.user._id };
  if (filter) {
    // filter=field1|field2
    const fields = filter.split('|');
    filterQuery = {
      ...filterQuery,
      $or: fields.map((field) => ({ [field]: { $exists: true } })),
    };
  }
  const contacts = await getAllContactsService(filterQuery, { skip: Number(skip), limit: Number(limit), sort });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactByIdService(contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const payload = req.body;
  if (!payload.name || !payload.phoneNumber || !payload.contactType) {
      throw createHttpError(400, 'Missing required fields: name, phoneNumber, contactType');
  }
  const contact = await createContactService({ ...payload, userId: req.user._id });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const contact = await deleteContactService(contactId, req.user._id);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
};

export const updateContactController = async (req, res) => {
  const { contactId } = req.params;
  const payload = req.body;
  if (Object.keys(payload).length === 0) {
    throw createHttpError(400, 'Missing fields to update');
  }
  const contact = await updateContactService(contactId, req.user._id, payload);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: contact,
  });
};
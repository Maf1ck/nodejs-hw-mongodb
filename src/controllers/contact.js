import {
  getAllContacts as getAllContactsService,
  getContactById as getContactByIdService,
  createContact as createContactService,
  deleteContact as deleteContactService,
  updateContact as updateContactService,
} from '../services/contact.js';
import createHttpError from 'http-errors';

export const getAllContactsController = async (req, res) => {
  const {
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = 'asc',
    type,
    isFavourite,
  } = req.query;
  const pageNum = Number(page);
  const perPageNum = Number(perPage);
  const skip = (pageNum - 1) * perPageNum;

  let filterQuery = { userId: req.user._id };
  if (type) {
    filterQuery.contactType = type;
  }
  if (typeof isFavourite !== 'undefined') {
    filterQuery.isFavourite = isFavourite === 'true';
  }

  const sort = {};
  if (sortBy) {
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const { Contact } = await import('../models/contact.js');
  const totalItems = await Contact.countDocuments(filterQuery);
  const totalPages = Math.ceil(totalItems / perPageNum);
  const contacts = await Contact.find(filterQuery, null, {
    skip,
    limit: perPageNum,
    sort,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: {
      data: contacts,
      page: pageNum,
      perPage: perPageNum,
      totalItems,
      totalPages,
      hasPreviousPage: pageNum > 1,
      hasNextPage: pageNum < totalPages,
    },
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
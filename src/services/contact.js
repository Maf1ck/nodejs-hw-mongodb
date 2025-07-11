import { Contact } from '../models/contact.js';

export const getAllContacts = async (page = 1, perPage = 10, sortBy = 'name', sortOrder = 'asc', type, isFavourite) => {
  const skip = (page - 1) * perPage;
  const sortDirection = sortOrder === 'desc' ? -1 : 1;
  
  // Build filter object
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';
  
  // Get total count for pagination
  const totalItems = await Contact.countDocuments(filter);
  
  // Get contacts with pagination and sorting
  const contacts = await Contact.find(filter)
    .sort({ [sortBy]: sortDirection })
    .skip(skip)
    .limit(perPage);
  
  const totalPages = Math.ceil(totalItems / perPage);
  
  return {
    data: contacts,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  };
};

export const getContactById = async (contactId) => Contact.findById(contactId);
export const createContact = async (payload) => Contact.create(payload);
export const deleteContact = async (contactId) => Contact.findByIdAndDelete(contactId);
export const updateContact = async (contactId, payload) => Contact.findByIdAndUpdate(contactId, payload);
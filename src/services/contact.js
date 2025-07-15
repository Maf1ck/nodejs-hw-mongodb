import { Contact } from '../models/contact.js';

export const getAllContacts = async (userId) => Contact.find({ userId });
export const getContactById = async (contactId, userId) => Contact.findOne({ _id: contactId, userId });
export const createContact = async (payload) => Contact.create(payload);
export const deleteContact = async (contactId, userId) => Contact.findOneAndDelete({ _id: contactId, userId });
export const updateContact = async (contactId, userId, payload) => Contact.findOneAndUpdate({ _id: contactId, userId }, payload, { new: true });
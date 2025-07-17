import {
  getAllContacts as getAllContactsService,
  getContactById as getContactByIdService,
  createContact as createContactService,
  deleteContact as deleteContactService,
  updateContact as updateContactService,
} from '../services/contact.js';
import createHttpError from 'http-errors';
import cloudinary from '../utils/cloudinary.js';

export const getAllContactsController = async (req, res) => {
  const contacts = await getAllContactsService(req.user._id);
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
  let photoUrl = '';
  if (req.file) {
    const uploadResult = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
      if (error) throw createHttpError(500, 'Failed to upload photo');
      photoUrl = result.secure_url;
    });
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(createHttpError(500, 'Failed to upload photo'));
        photoUrl = result.secure_url;
        resolve();
      });
      stream.end(req.file.buffer);
    });
  }
  const contact = await createContactService({ ...payload, userId: req.user._id, photo: photoUrl });
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
  if (Object.keys(payload).length === 0 && !req.file) {
    throw createHttpError(400, 'Missing fields to update');
  }
  let photoUrl;
  if (req.file) {
    await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream((error, result) => {
        if (error) return reject(createHttpError(500, 'Failed to upload photo'));
        photoUrl = result.secure_url;
        resolve();
      });
      stream.end(req.file.buffer);
    });
  }
  const contact = await updateContactService(contactId, req.user._id, { ...payload, ...(photoUrl && { photo: photoUrl }) });
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully updated contact!',
    data: contact,
  });
};
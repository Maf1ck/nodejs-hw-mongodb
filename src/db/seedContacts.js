import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { Contact } from '../models/contact.js';
import { initMongoConnection } from './initMongoConnection.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function seedContacts() {
  try {
    await initMongoConnection();
    const contactsPath = path.join(__dirname, 'contacts.json');
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);

    // Optional: Clear existing contacts first
    await Contact.deleteMany({});
    await Contact.insertMany(contacts);
    console.log('Contacts seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding contacts:', error);
    process.exit(1);
  }
}

seedContacts();

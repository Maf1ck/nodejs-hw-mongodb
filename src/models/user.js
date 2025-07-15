import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+@.+\..+/
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User = model('users', userSchema); 
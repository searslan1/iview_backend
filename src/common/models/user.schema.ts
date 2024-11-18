import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId; // _id alanının türünü burada açıkça belirtiyoruz
  username: string;
  password: string;
  role: 'admin' | 'master';
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'master'] }
});

export const User = model<IUser>('User', UserSchema);

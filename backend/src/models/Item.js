import mongoose from 'mongoose';
const ItemSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  author: { type: String, default: '' },
  mediaFormat: { type: String, enum: ['BOOK','DVD','MAGAZINE','AUDIOBOOK'], required: true },
  location: { type: String, default: '' },
  status: { type: String, enum: ['AVAILABLE','CHECKED_OUT','ON_HOLD','LOST'], default: 'AVAILABLE', index: true },
  barcode: { type: String, unique: true, sparse: true },
  rfid: { type: String, unique: true, sparse: true }
}, { timestamps: true });
export default mongoose.model('Item', ItemSchema);
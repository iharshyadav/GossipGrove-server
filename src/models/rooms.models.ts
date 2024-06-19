import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  roomName: {
    type: [String],
    required: true,
  },
  isAdmin : {
    type: Boolean,
    default : true
  }
});

const StoreRoom = mongoose.models.StoreRoom || mongoose.model('StoreRoom', roomSchema);

export default StoreRoom;

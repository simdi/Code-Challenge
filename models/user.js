const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: Schema.Types.String, required: true, unique: true },
    email: { type: Schema.Types.String, required: true, unique: true, lowercase: true },
    verificationId: { type: Schema.Types.String },
    isVerified: { type: Schema.Types.Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);
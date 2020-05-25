const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const getMustHave = (str) => {
    return `A user must have ${str}`;
};

const def = {
    name: {
        type: String,
        required: [true, getMustHave('name')],
    },
    email: {
        type: String,
        required: [true, getMustHave('email')],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, getMustHave('valid email')],
    },
    photo: {
        type: String,
        default: 'default.jpg',
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, getMustHave('password')],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, getMustHave('confirm password')],
        validate: {
            // This work on create and save
            validator: function (el) {
                return el === this.password;
            },
            message: getMustHave('same confirm password'),
        },
    },
    passwordChangedAt: {
        type: Date,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
};
const userSchema = Schema(def);

// Query Middleware
userSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});
// Document Middleware
userSchema.pre('save', async function (next) {
    // Only run this function if password is actually modified
    if (!this.isModified('password')) return next();
    // Hash password with cost
    this.password = await bcrypt.hash(this.password, 12);
    // Delete password confirmed
    this.passwordConfirm = undefined;
    // delete this.passwordConfirm;

    next();
});

userSchema.pre('save', function (next) {
    // Run if password is modified using reset
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimestamp) {
    if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10
        );
        // Password was changed after token was issued
        return JWTTimestamp < changedTimestamp;
    }
    // Password was changed before token was issued
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    // console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;

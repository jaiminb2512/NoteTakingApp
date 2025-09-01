import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    email: string;
    fullName: string;
    dob: Date;
    otp?: string;
    otpExpiry?: Date;
    isEmailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    isOtpExpired(): boolean;
    generateOtp(expiryMinutes?: number): string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        maxlength: [100, 'Full name cannot exceed 100 characters']
    },
    dob: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function (value: Date) {
                return value <= new Date() && value >= new Date('1900-01-01');
            },
            message: 'Invalid date of birth'
        }
    },
    otp: {
        type: String,
        default: null
    },
    otpExpiry: {
        type: Date,
        default: null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.otp;
            delete ret.otpExpiry;
            return ret;
        }
    }
});

// Check if OTP is expired
userSchema.methods.isOtpExpired = function (): boolean {
    if (!this.otpExpiry) return true;
    return new Date() > this.otpExpiry;
};

// Generate OTP with expiry time
userSchema.methods.generateOtp = function (expiryMinutes: number = 10): string {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    this.otp = otp;
    this.otpExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    return otp;
};

// Index for better query performance
userSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', userSchema);

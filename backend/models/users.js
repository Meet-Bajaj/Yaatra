const mongoose = require("mongoose");

const normalizePhone = (value) => {
  const input = String(value || "").trim();
  const digitsOnly = input.replace(/\D/g, "");

  if (!digitsOnly) {
    return input;
  }

  const localTenDigits = digitsOnly.slice(-10);
  return `+91${localTenDigits}`;
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true,
      unique: true,
    },
    password: {
      type: String,
      select: false,
    },
    role: {
      type: String,
      enum: ["rider", "driver", "admin"],
      default: "rider",
    },
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    avatarUrl: String,
    fcmToken: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

userSchema.pre("validate", function normalizeUserPhone() {
  if (this.phone) {
    this.phone = normalizePhone(this.phone);
  }
});

module.exports = mongoose.model("User", userSchema);

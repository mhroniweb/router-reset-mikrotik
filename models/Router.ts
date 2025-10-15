import { Schema, model, models, Document, CallbackError } from "mongoose";
import { encrypt, decrypt } from "@/lib/crypto";

export interface IRouter extends Document {
  name: string;
  ipAddress: string;
  username: string;
  password: string;
  port: number;
  createdAt: Date;
  getDecryptedPassword(): string;
}

const RouterSchema = new Schema<IRouter>({
  name: {
    type: String,
    required: [true, "Router name is required"],
    trim: true,
  },
  ipAddress: {
    type: String,
    required: [true, "IP address is required"],
    trim: true,
  },
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  port: {
    type: Number,
    default: 8728,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password before saving (using reversible encryption)
RouterSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = encrypt(this.password);
    next();
  } catch (error: unknown) {
    next(error as CallbackError);
  }
});

// Method to get decrypted password
RouterSchema.methods.getDecryptedPassword = function (): string {
  return decrypt(this.password);
};

const Router = models.Router || model<IRouter>("Router", RouterSchema);

export default Router;

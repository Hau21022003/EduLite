import { Role } from "@/enums/user.enum";

export type Account = {
  id: string;
  fullName: string;
  avatar?: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  // contactDetails: ContactDetailsSchema.optional(),
};

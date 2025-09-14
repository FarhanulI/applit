import { DocumentStatusEnums, PlanValdityEnum } from "@/enums";

export type UserPurchaseListType = {
  type: string; // or you can be more specific: "cv-correction" | "standard-pack" | ...
  name: string;
  amount: number;
  purchasedAt: string; // ISO string
  billingCycle: "one_time" | "monthly";
  payment_status: "succeeded" | "failed" | "pending";
  sessionId: string;
  validity?: PlanValdityEnum;
  expiredAt?: string; // ISO string
  subscriptionID?: string | null;
  paymentMethod?: string | null;
};

export type UserStatsTypes = {
  remainingCoverLetter: number | string | null
  uploadedCv?: number;
};

export type UserStatsType = {
  purchasePlans: UserPurchaseListType[];
  stats: UserStatsTypes | null;
  currentPlan: UserPurchaseListType | null;
};

export type UserCvDocument = {
  id?: string;
  correction_status: DocumentStatusEnums;
  downloadUrl: string;
  sessionId: string;
  type: "CV" | "CoverLetter";
  fileName: string;
  createdAt?: string;
};

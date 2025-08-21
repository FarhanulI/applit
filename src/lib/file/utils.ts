/* eslint-disable @typescript-eslint/ban-ts-comment */
import { doc, getDoc, setDoc } from "firebase/firestore";
import {
  UserStatsType,
  UserPurchaseListType,
  UserStatsTypes,
} from "./types";
import { db } from "@/config/firebase-config";
import { Dispatch, SetStateAction } from "react";

/**
 * Updates a user's Firestore profile with plan & stats.
 */
export const updateUserWithPlan = async (
  userId: string,
  currentPlan: UserPurchaseListType,
  newStats: Partial<UserStatsTypes>,
  setUserStats: Dispatch<SetStateAction<UserStatsType | undefined>>
): Promise<boolean> => {
  if (!userId) throw new Error("User ID is required");

  const userRef = doc(db, "users", userId);
  const existingDoc = await getDoc(userRef);
  const existingData = existingDoc.exists()
    ? (existingDoc.data() as UserStatsType)
    : null;

  const updatedPurchasePlans: UserPurchaseListType[] = [
    ...(existingData?.purchasePlans || []),
    currentPlan,
  ];

  // @ts-ignore
  const updatedStats: UserStatsTypes = {
    ...existingData?.stats,
    ...newStats,
  };

  const updatedUserData: UserStatsType = {
    currentPlan,
    purchasePlans: updatedPurchasePlans,
    stats: updatedStats,
  };

  try {
    await setDoc(userRef, updatedUserData, { merge: true });
    setUserStats(updatedUserData);

    return true;
  } catch (error) {
    console.error("❌ Error updating user with plan:", error);
    return false;
  }
};

export const LOCAL_PDF_PATH = "/pdf/sample.pdf";

export const categories = [
  "Software Engineer",
  "Accountant",
  "Marketing Specialist",
  "Project Manager",
  "Customer Support",
  "HR Manager",
  "Sales Executive",
  "Graphic Designer",
];

export const getRandomCategory = () => {
  const index = Math.floor(Math.random() * categories.length);
  return categories[index];
};

export const getRemainingDays = (expiresAt: string): number => {
  const now = new Date();
  const expiryDate = new Date(expiresAt);

  // Get time difference in milliseconds
  const diffTime = expiryDate.getTime() - now.getTime();

  // Convert milliseconds to days
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

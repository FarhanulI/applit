/* eslint-disable @typescript-eslint/ban-ts-comment */
import { db } from "@/config/firebase-config";
import { CoverLetterPlansIdEnum, PlansNameEnum } from "@/enums";
import { UserProfileType } from "@/lib/auth/type";
import { updateUserPlan } from "@/lib/file/apis";
import { UserStatsType } from "@/lib/file/types";
import { updateUserWithPlan } from "@/lib/file/utils";
import { collection, getDocs } from "firebase/firestore";
import { Dispatch, SetStateAction } from "react";

export type CoverLetterDoc = {
  id?: string;
  type: string;
  fileName: string;
  downloadUrl: string;
  correction_status: string;
  createdAt: string;
  category: string;
};

export const getCoverLetters = async (): Promise<CoverLetterDoc[]> => {
  try {
    const colRef = collection(db, "coverLetters");
    const snapshot = await getDocs(colRef);

    const coverLetters: CoverLetterDoc[] = snapshot.docs.map((doc) => ({
      ...(doc.data() as CoverLetterDoc),
    }));

    return coverLetters;
  } catch (error) {
    console.error("❌ Error fetching cover letters:", error);
    return [];
  }
};

export const handleUserDocuments = async (
  user: UserProfileType,
  userStats: UserStatsType,
  setUserStats: Dispatch<React.SetStateAction<UserStatsType | undefined>>
) => {
  const uid = user?.uid;
  const currentPlan = userStats?.currentPlan;
  const stats = userStats?.stats;

  console.log({currentPlan});
  

  if (!uid || !currentPlan) return;

  const updatedStats: UserStatsType = { ...userStats };

  if (currentPlan.type === CoverLetterPlansIdEnum.unlimited) {
    updatedStats.stats = {
      ...stats,
      remainingCoverLetter: "Unlimited",
    };
  }

  if (currentPlan.type === CoverLetterPlansIdEnum.standard) {
    if (typeof stats?.remainingCoverLetter !== "number") return;

    updatedStats.stats = {
      ...stats,
      remainingCoverLetter: Math.max(stats.remainingCoverLetter - 1, 0),
    };
  }

  if (currentPlan.type === PlansNameEnum.payAsYouGo) {
    if (typeof stats?.remainingCoverLetter !== "number") return;

    updatedStats.stats = {
      ...stats,
      remainingCoverLetter: Math.max(stats.remainingCoverLetter - 1, 0),
    };

    // @ts-ignore
    await await updateUserPlan(uid, {currentPlan: null});
  }

  // If stats not updated for a known plan, skip update
  if (!updatedStats.stats) return;

  try {
    const res = await updateUserPlan(uid, updatedStats);
    return res ?? null;
  } catch (error) {
    console.error("❌ Error updating user plan:", error);
    return null;
  }
};

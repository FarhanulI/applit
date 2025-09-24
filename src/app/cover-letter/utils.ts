import { db } from "@/config/firebase-config";
import { CoverLetterPlansIdEnum } from "@/enums";
import { updateUserPlan } from "@/lib/file/apis";
import { UserStatsType } from "@/lib/file/types";
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
  user: UserStatsType,
) => {
  if (!user?.uid || !user.currentPlan) return;

  const currentPlanId = user.currentPlan.type;

  if (
    CoverLetterPlansIdEnum.standard === currentPlanId &&
    user!.stats &&
    user.stats.remainingCoverLetter
  ) {
    const newStats = {
      ...user,
      stats: {
        ...user.stats,
        remainingCoverLetter: Number(user.stats.remainingCoverLetter) - 1,
      },
    };

    const res = await updateUserPlan(user?.uid, newStats);
    if (res) {
      return res;
    }

    return;
  }
};

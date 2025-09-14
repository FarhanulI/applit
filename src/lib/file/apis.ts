/* eslint-disable @typescript-eslint/ban-ts-comment */
import { db, storage } from "@/config/firebase-config";
import { DocumentStatusEnums, PlanValdityEnum } from "@/enums";
import { handleCheckSessionFile } from "@/hooks/auth/utils";
import { User } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { UserCvDocument, UserStatsType, UserPurchaseListType } from "./types";
import { getRandomCategory, LOCAL_PDF_PATH, updateUserWithPlan } from "./utils";
import { Dispatch, SetStateAction, use } from "react";
import { UserProfileType } from "../auth/type";
import { addDays } from "date-fns";
import { CoverLetterDoc } from "@/app/cover-letter/utils";
import { pricingPlans } from "@/config/stripe-config";

export const uploadFile = async (file: File): Promise<string | undefined> => {
  if (!file) return;

  try {
    // Upload to Storage
    const storageRef = ref(storage, `${file.name}`);
    await uploadBytes(storageRef, file);
    const downloadUrl = await getDownloadURL(storageRef);

    return downloadUrl;
  } catch (err) {
    console.error("Upload failed:", err);
  }
};

export const fetchUserStats = async (user: Partial<UserProfileType> | null) => {
  try {
    const userId = user?.uid;
    if (!userId) throw new Error("User ID is required");

    const snapshot = await getDoc(doc(db, "users", userId));

    return snapshot.data();
  } catch (error) {
    console.log(error);
    return {};
  }
};

export const handleCVCorrectionPlan = async (
  user: UserProfileType,
  setUserStats: Dispatch<SetStateAction<UserStatsType | undefined>>,
  planId: string
) => {
  try {
    const file = handleCheckSessionFile();
    if (!file) {
      throw new Error("No file found");
    }

    const sessionId = sessionStorage.getItem("checkoutSessionId");
    const plan = pricingPlans.find((item) => item.id === planId);

    if (!plan) {
      throw new Error("Plan information is missing or invalid.");
    }

    const downloadUrl = await uploadFile(file);

    await addDoc(collection(db, "documents", user?.uid, "cv"), {
      correction_status: DocumentStatusEnums.processing,
      downloadUrl: downloadUrl || "",
      sessionId: sessionId || "",
      type: "CV",
      fileName: file.name,
      createdAt: new Date(),
    });

    // @ts-ignore
    return updateUserWithPlan(user?.uid, null, {}, setUserStats);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handlePaytAsGoPlan = async (
  user: UserProfileType,
  setUserStats: Dispatch<SetStateAction<UserStatsType | undefined>>,
  planId: string,
  subscriptionID: string | null,
  paymentMethod: string | null
) => {
  if (!user) return false;

  try {
    const sessionId = sessionStorage.getItem("checkoutSessionId");
    const plan = pricingPlans.find((item) => item.id === planId);

    // ✅ Validate required plan fields
    if (!plan) {
      throw new Error("Plan information is missing or invalid.");
    }

    // ✅ Construct the current plan
    const currentPlan: UserPurchaseListType = {
      type: plan.id,
      name: plan.name,
      amount: plan.priceAmount / 100,
      purchasedAt: new Date().toISOString(),
      billingCycle: "one_time",
      payment_status: "succeeded",
      sessionId: sessionId || "",
      validity: PlanValdityEnum.standard,
      expiredAt: addDays(
        new Date().toISOString(),
        PlanValdityEnum.standard
      ).toISOString(),
      subscriptionID,
      paymentMethod,
    };

    const newStats = {
      remainingCoverLetter: 1,
    };

    return updateUserWithPlan(user.uid, currentPlan, newStats, setUserStats);
  } catch (error) {
    console.error("❌ Error handling standard plan:", error);
    return false;
  }
};

export const handleStandardPlan = async (
  user: UserProfileType,
  setUserStats: Dispatch<SetStateAction<UserStatsType | undefined>>,
  planId: string,
  subscriptionID: string | null,
  paymentMethod: string | null
) => {
  if (!user) return false;

  try {
    const sessionId = sessionStorage.getItem("checkoutSessionId");
    const plan = pricingPlans.find((item) => item.id === planId);

    // ✅ Validate required plan fields
    if (!plan) {
      throw new Error("Plan information is missing or invalid.");
    }

    // ✅ Construct the current plan
    const currentPlan: UserPurchaseListType = {
      type: plan.id,
      name: plan.name || "Standard Pack",
      amount: plan.priceAmount / 100,
      purchasedAt: new Date().toISOString(),
      billingCycle: "one_time",
      payment_status: "succeeded",
      sessionId: sessionId || "",
      validity: PlanValdityEnum.standard,
      expiredAt: addDays(
        new Date().toISOString(),
        PlanValdityEnum.standard
      ).toISOString(),
      subscriptionID,
      paymentMethod,
    };

    const newStats = {
      remainingCoverLetter: 30,
    };

    return updateUserWithPlan(user.uid, currentPlan, newStats, setUserStats);
  } catch (error) {
    console.error("❌ Error handling standard plan:", error);
    return false;
  }
};

export const handleUnlimitedPlan = async (
  user: UserProfileType,
  setUserStats: Dispatch<SetStateAction<UserStatsType | undefined>>,
  planId: string,
  subscriptionID: string | null,
  sessionId: string | null,
  paymentMethod: string | null
) => {
  if (!user) return false;

  try {
    const plan = pricingPlans.find((item) => item.id === planId);

    // ✅ Validate required plan fields
    if (!plan) {
      throw new Error("Plan information is missing or invalid.");
    }

    // ✅ Construct the current plan
    const currentPlan: UserPurchaseListType = {
      type: plan.id,
      name: plan.name || "Standard Pack",
      amount: plan.priceAmount / 100,
      purchasedAt: new Date().toISOString(),
      billingCycle: "monthly",
      payment_status: "succeeded",
      sessionId: sessionId || "",
      validity: PlanValdityEnum.unlimited,
      expiredAt: addDays(
        new Date().toISOString(),
        PlanValdityEnum.unlimited
      ).toISOString(),
      subscriptionID,
      paymentMethod,
    };

    const newStats = {
      remainingCoverLetter: "Unlimited",
    };

    return updateUserWithPlan(user.uid, currentPlan, newStats, setUserStats);
  } catch (error) {
    console.error("❌ Error handling standard plan:", error);
    return false;
  }
};

export const updateUserPlan = async (
  userId: string,
  fields: Partial<UserStatsType>
) => {
  if (!userId) return;

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, fields);

    const userStats = await fetchUserStats({ uid: userId });

    console.log("✅ Plan canceled successfully.");
    return userStats;
  } catch (error) {
    console.error("❌ Error canceling plan:", error);
    return null;
  }
};

export const fetchDocuments = async (
  user: UserProfileType,
  docType: string = "cv"
): Promise<UserCvDocument[]> => {
  const userId = user?.uid;
  if (!userId) throw new Error("User ID is required");

  try {
    const cvDocsRef = collection(db, "documents", userId, docType);
    const snapshot = await getDocs(cvDocsRef);

    const documents: UserCvDocument[] = snapshot.docs.map((doc) => ({
      ...doc.data(),
    })) as UserCvDocument[];

    return documents;
  } catch (error) {
    console.error("❌ Error fetching CV documents:", error);
    return [];
  }
};

export const addDocument = async (
  user: UserProfileType,
  document: Omit<UserCvDocument | CoverLetterDoc, "id"> // Assuming Firestore will auto-generate an ID
): Promise<string | null> => {
  const userId = user?.uid;
  if (!userId) throw new Error("User ID is required");

  try {
    const cvDocsRef = collection(db, "documents", userId, "cover-letter");
    const docRef = await addDoc(cvDocsRef, document);
    console.log("✅ Document added with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding document:", error);
    return null;
  }
};

export const uploadAndCreateCoverLetters = async () => {
  try {
    const storage = getStorage();

    // Fetch the file from the public directory
    const response = await fetch(LOCAL_PDF_PATH);
    const blob = await response.blob();
    const originalFileName = "cover_letter_template.pdf";

    // Upload once
    const storageRef = ref(storage, `cover_letter/${originalFileName}`);
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);

    // Create 35 unique Firestore documents with that download URL
    const batchPromises = Array.from({ length: 35 }, (_, i) => {
      const fileName = `cover_letter_${i + 1}.pdf`;
      const category = getRandomCategory();

      return addDoc(collection(db, "coverLetters"), {
        type: "CoverLetter",
        fileName,
        downloadUrl,
        correction_status: "Completed",
        category,
        createdAt: new Date().toISOString(),
      });
    });

    await Promise.all(batchPromises);

    console.log("✅ 35 documents with categories created successfully.");
  } catch (error) {
    console.error("❌ Failed to upload or write Firestore:", error);
    throw error;
  }
};

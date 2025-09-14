export enum PlansNameEnum {
  cv_correction = "cv-correction",
  payAsYouGo = "pay-as-you-go",
  unlimited = "unlimited",
  standard = "standard-pack",
}

export enum PlanEnumNum {
  'cv-correction' = 1,
  'pay-as-you-go' = 2,
  'standard-pack' = 3,
  'unlimited' = 4,
}

export enum PlanValdityEnum {
  standard = 90,
  unlimited = 30,
}

export enum DocumentStatusEnums {
  completed = "completed",
  processing = "processing",
}

export enum CoverLetterPlansIdEnum {
  unlimited = "unlimited",
  standard = "standard-pack",
}

export enum PaymentMethodEnum {
  stripe = "stripe",
  paypal = "paypal",
}

export enum SuccessQueryEnum {
  planId = 'planId',
  subscriptionID = 'subscriptionID',
  sessionId = 'sessionId',
  paymentMethod = 'paymentMethod'
}
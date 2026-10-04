import { z } from "zod";

export const paymentStatuses = [
  "paid",
  "unpaid",
  "partially_paid",
  "refunded",
] as const;

export const paymentMethods = [
  "mada",
  "visa",
  "mastercard",
  "apple_pay",
  "bank_transfer",
  "sadad",
] as const;

export const contractStatuses = [
  "certified",
  "under_review",
  "pending_approval",
  "pending_payment",
  "rejected",
  "expired",
  "cancelled",
] as const;

export const updatePaymentStatusSchema = z
  .object({
    paymentStatus: z.enum(paymentStatuses, {
      message: "يرجى اختيار حالة السداد",
    }),
    paymentMethod: z.enum(paymentMethods).optional(),
    transactionId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentStatus === "paid" ||
      data.paymentStatus === "partially_paid"
    ) {
      if (!data.paymentMethod) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["paymentMethod"],
          message: "يرجى اختيار طريقة السداد",
        });
      }
      if (!data.transactionId || !data.transactionId.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["transactionId"],
          message: "يرجى إدخال رقم العملية أو المرجع المالي",
        });
      }
    }
  });

export type UpdatePaymentStatusFormData = z.infer<
  typeof updatePaymentStatusSchema
>;

export const updateContractStatusSchema = z.object({
  status: z.enum(contractStatuses, {
    message: "يرجى اختيار حالة العقد",
  }),
  note: z.string().optional(),
  ejarNumber: z.string().optional(),
});

export type UpdateContractStatusFormData = z.infer<
  typeof updateContractStatusSchema
>;

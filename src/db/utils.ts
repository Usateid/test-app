import { z } from "zod";
// import { getCurrentUser } from "./helpers";
// import type { UserType } from "@/db/auth";

function getFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string> = {};
  error.issues.forEach((issue) => {
    console.log(issue.path.join("."), issue.code);
    fieldErrors[issue.path.join(".")] = issue.message;
  });
  return fieldErrors;
}
export type ActionState = {
  error?: string;
  success?: boolean;
  fieldErrors?: Record<string, string>; // Errori specifici per campo
  [key: string]: unknown; // This allows for additional properties
};

type ValidatedActionFunction<S extends z.ZodTypeAny, T> = (
  data: z.infer<S>,
  formData: FormData
) => Promise<T>;

export function validatedAction<S extends z.ZodTypeAny, T>(
  schema: S,
  action: ValidatedActionFunction<S, T>
) {
  return async (prevState: ActionState, formData: FormData) => {
    const formDataObj = Object.fromEntries(formData);
    const result = schema.safeParse(formDataObj);

    if (!result.success) {
      return {
        fieldErrors: getFieldErrors(result.error),
        success: false,
        ...formDataObj,
      };
    }
    return action(result.data, formData);
  };
}

// export function validatedAction<S extends z.ZodType<any, any>, T>(
//   schema: S,
//   action: ValidatedActionFunction<S, T>
// ) {
//   return async (prevState: ActionState, formData: FormData) => {
//     // 1. Convert FormData to a plain object
//     const formDataObj = Object.fromEntries(formData);

//     // 2. Validate against the provided Zod schema
//     const result = schema.safeParse(formDataObj);

//     if (!result.success) {
//       // 3. If validation fails, create field-specific error mapping
//       const fieldErrors: ActionState["fieldErrors"] = {};
//       result.error.errors.forEach((error) => {
//         const fieldName = error.path.join(".");
//         fieldErrors[fieldName] = error.message;
//       });

//       // 4. Return error state with field errors and form data
//       return {
//         error: result.error.errors[0].message,
//         fieldErrors,
//         ...formDataObj,
//       };
//     }

//     // 5. If validation passes, execute the original action
//     return action(result.data, formData);
//   };
// }

// type ValidatedActionWithUserFunction<S extends z.ZodType<any, any>, T> = (
//   data: z.infer<S>,
//   formData: FormData,
//   user: UserType
// ) => Promise<T>;

// export function validatedActionWithUser<S extends z.ZodType<any, any>, T>(
//   schema: S,
//   action: ValidatedActionWithUserFunction<S, T>
// ) {
//   return async (prevState: ActionState, formData: FormData) => {
//     const user = await getCurrentUser();
//     if (!user) {
//       return {
//         error: "User is not authenticated",
//       };
//     }

//     const formDataObj = Object.fromEntries(formData);
//     const result = schema.safeParse(formDataObj);

//     if (!result.success) {
//       const fieldErrors: Record<string, string> = {};
//       result.error.errors.forEach((error) => {
//         const fieldName = error.path.join(".");
//         fieldErrors[fieldName] = error.message;
//       });

//       return {
//         error: result.error.errors[0].message,
//         fieldErrors,
//       };
//     }

//     return action(result.data, formData, user);
//   };
// }

// type ValidatedActionWithRoleFunction<S extends z.ZodType<any, any>, T> = (
//   data: z.infer<S>,
//   formData: FormData,
//   user: UserType
// ) => Promise<T>;

// export function validatedActionWithRole<S extends z.ZodType<any, any>, T>(
//   schema: S,
//   requiredRole: string | string[],
//   action: ValidatedActionWithRoleFunction<S, T>
// ) {
//   return async (prevState: ActionState, formData: FormData) => {
//     const user = await getCurrentUser();
//     if (!user) {
//       return {
//         error: "User is not authenticated",
//       };
//     }

//     const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
//     if (!roles.includes(user.role)) {
//       return {
//         error: "You do not have permission to perform this action",
//       };
//     }

//     const formDataObj = Object.fromEntries(formData);
//     const result = schema.safeParse(formDataObj);

//     if (!result.success) {
//       const fieldErrors: Record<string, string> = {};
//       result.error.errors.forEach((error) => {
//         const fieldName = error.path.join(".");
//         fieldErrors[fieldName] = error.message;
//       });

//       return {
//         error: result.error.errors[0].message,
//         fieldErrors,
//       };
//     }

//     return action(result.data, formData, user);
//   };
// }

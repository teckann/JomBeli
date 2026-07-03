import { createClient } from "./server";

export async function getAccountSecurityLevel(userId) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("USERS_T")
    .select("security_question1")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Failed to fetch account security:", error.message);
    throw new Error("Could not fetch account security");
  }

  const hasSecurityQuestion = !!data?.security_question1;

  if (hasSecurityQuestion) {
    return {
      status: "secure",
      message: "No security issues detected. Your account is secure.",
      textColor: "#2CB819",
      borderColor: "#BEFFC0",
      bgColor: "#EFFFF0",
    };
  }

  return {
    status: "warning",
    message: "Security issues detected. Please set your security questions.",
    textColor: "#B0B819",
    borderColor: "#FEFFBE",
    bgColor: "#FFFDEF",
  };
}

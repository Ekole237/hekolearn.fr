import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/database.types";

export async function getCategories() {
  const supabase = createClientComponentClient<Database>();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("order_index");

  if (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }

  return data;
}

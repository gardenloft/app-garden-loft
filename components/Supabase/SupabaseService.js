import supabase from "../../SupabaseConfig";

// ✅ Function to Get Resident ID from Supabase
export const getResidentId = async (firebaseUid, email) => {
  const { data, error } = await supabase
    .from("residents")
    .select("resident_id")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (error && error.code === "PGRST116") {
    return await createNewResident(firebaseUid, email);
  } else if (error) {
    console.error("Error fetching resident ID:", error);
    return null;
  }

  return data.resident_id;
};

// ✅ Function to Create a New Resident in Supabase
export const createNewResident = async (firebaseUid, email) => {
  const { data, error } = await supabase
    .from("residents")
    .insert([{ firebase_uid: firebaseUid, email: email }])
    .select("resident_id")
    .single();

  if (error) {
    console.error("Error creating resident:", error);
    return null;
  }
  return data.resident_id;
};
import supabase from "../SupabaseConfig";

// ✅ Function to Fetch `resident_id` from Supabase using Firebase UID
const getResidentId = async (firebaseUid) => {
  const { data, error } = await supabase
    .from("residents")
    .select("resident_id")
    .eq("firebase_uid", firebaseUid)
    .single();

  if (error && error.code === "PGRST116") {
    return await createNewResident(firebaseUid);
  } else if (error) {
    console.error("Error fetching resident ID:", error);
    return null;
  }

  return data.resident_id;
};

// ✅ Function to Create a New Resident in Supabase (if not exists)
const createNewResident = async (firebaseUid) => {
  const { data, error } = await supabase
    .from("residents")
    .insert([{ firebase_uid: firebaseUid }])
    .select("resident_id")
    .single();

  if (error) {
    console.error("Error creating resident:", error);
    return null;
  }
  return data.resident_id;
};

// ✅ Function to Log YouTube Video Play Event in `app_usage_event_log`
// export const logAppUsageEvent = async (
//   firebaseUid,
//   eventType,
//   source,
//   metadata = {}
// ) => {
//   const residentId = await getResidentId(firebaseUid);
//   if (!residentId) return;

//   const { error } = await supabase.from("app_usage_event_log").insert([
//     {
//       resident_id: residentId,
//       event_type: eventType,
//       source: source,
//       metadata: metadata,
//     },
//   ]);

//   if (error) {
//     console.error("Error logging app usage event:", error);
//   }
// };

// ✅ Function to Log Call and Other Events in `app_usage_event_log`
export const logAppUsageEvent = async (
  firebaseUid,
  eventType,
  metadata = {}
) => {
  const residentId = await getResidentId(firebaseUid);
  if (!residentId) return;

  const { error } = await supabase.from("app_usage_event_log").insert([
    {
      resident_id: residentId,
      event_type: eventType,
      source: "Expo App",
      metadata: metadata,
    },
  ]);

  if (error) {
    console.error(`Error logging event: ${eventType}`, error);
  } else {
    console.log(`✅ Event Logged: ${eventType}`);
  }
};
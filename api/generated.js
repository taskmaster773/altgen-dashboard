import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  try {
    // Get first unused alt
    const { data: alts, error } = await supabase
      .from("alts")
      .select("*")
      .eq("used", false)
      .limit(1);

    if (error) throw error;
    if (!alts || alts.length === 0) return res.status(400).json({ error: "No more unused alts!" });

    const alt = alts[0];

    // Mark as used
    const { error: updateError } = await supabase
      .from("alts")
      .update({ used: true })
      .eq("id", alt.id);

    if (updateError) throw updateError;

    res.status(200).json({ alt: `${alt.username}:${alt.password}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error generating alt" });
  }
}

import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { defaultSiteSettings, normalizeSiteSettings } from "@/lib/site-settings";
import { ok, serverError } from "@/lib/api";

export async function GET() {
  try {
    await dbConnect();
    const settingsDoc = await SiteSettings.findOne({ key: "main" }).lean();
    const settings = normalizeSiteSettings(settingsDoc ?? defaultSiteSettings);
    return ok("Settings fetched successfully", { settings });
  } catch (err: unknown) {
    return serverError("Error fetching settings:", err);
  }
}

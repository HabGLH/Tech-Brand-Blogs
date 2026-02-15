import dbConnect from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import requireAdmin from "@/lib/middleware/role";
import {
  defaultSiteSettings,
  normalizeSiteSettings,
  validateSiteSettings,
} from "@/lib/site-settings";
import { ok, error, serverError } from "@/lib/api";

export async function GET(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }

    await dbConnect();
    const settingsDoc = await SiteSettings.findOne({ key: "main" }).lean();
    const settings = normalizeSiteSettings(settingsDoc ?? defaultSiteSettings);
    return ok("Settings fetched successfully", { settings });
  } catch (err: unknown) {
    return serverError("Error fetching admin settings:", err);
  }
}

export async function PUT(req: Request) {
  try {
    const auth = requireAdmin(req);
    if (!auth.ok) {
      return error(auth.message, auth.status);
    }

    const body = await req.json();
    const normalizedSettings = normalizeSiteSettings(body?.settings ?? body);
    const validationError = validateSiteSettings(normalizedSettings);
    if (validationError) {
      return error(validationError, 400);
    }

    await dbConnect();
    const settings = await SiteSettings.findOneAndUpdate(
      { key: "main" },
      { key: "main", ...normalizedSettings },
      { new: true, upsert: true, setDefaultsOnInsert: true },
    ).lean();

    return ok("Settings updated successfully", {
      settings: normalizeSiteSettings(settings),
    });
  } catch (err: unknown) {
    return serverError("Error updating admin settings:", err);
  }
}

import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { serverError } from "@/lib/api";

type Handler = (
  req: Request,
  context?: unknown,
) => Promise<NextResponse> | NextResponse;

export const createHandler = (handler: Handler): Handler => {
  return async (req: Request, context?: unknown) => {
    try {
      await dbConnect();
      return await handler(req, context);
    } catch (error) {
      return serverError("API Error", error);
    }
  };
};

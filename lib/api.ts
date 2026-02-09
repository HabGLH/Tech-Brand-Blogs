import { NextResponse } from "next/server";
import { ApiResponse } from "@/types/api";

type ApiData = Record<string, unknown> | unknown;

export const ok = <T extends ApiData>(
  message: string,
  data?: T,
  status = 200,
) =>
  NextResponse.json<ApiResponse<T>>(
    {
      status: "success",
      message,
      data: data as T,
    },
    { status },
  );

export const error = (message: string, status = 400) =>
  NextResponse.json<ApiResponse>(
    { status: "error", message },
    { status },
  );

export const serverError = (context: string, err: unknown) => {
  const errorMessage = err instanceof Error ? err.message : String(err);
  console.error(context, errorMessage);
  return error(process.env.NODE_ENV === "production" ? "Internal Server Error" : errorMessage, 500);
};

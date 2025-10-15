import { Request, Response, NextFunction } from "express";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase credentials not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

/**
 * Middleware to verify Supabase JWT token
 * Extracts user from Authorization header and attaches to req.user
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "인증이 필요합니다. 로그인해주세요.",
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify JWT token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        error: "유효하지 않은 인증 토큰입니다.",
      });
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: "인증 처리 중 오류가 발생했습니다.",
    });
  }
}

/**
 * Optional auth middleware - doesn't block request if no token
 * But still extracts user if token is present
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return next();
    }

    const token = authHeader.substring(7);

    const {
      data: { user },
    } = await supabase.auth.getUser(token);

    if (user) {
      req.user = {
        id: user.id,
        email: user.email,
      };
    }

    next();
  } catch (error) {
    // Don't block the request even if auth fails
    next();
  }
}

import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { authService } from "../services/auth.service";

const router = Router();

router.post("/login", authController.login);

router.post("/validate", authController.validate);

router.post("/refresh", authController.refresh);

router.post("/logout", authController.logout);

router.post("/register", authController.register);

router.get("/oauth/initiate", authController.initiateOAuth);

router.post("/oauth/exchange-code", authController.exchangeCode);

router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).json({ message: "Code required" });
  }

  try {
    const result = await authService.exchangeCodeForTokens(code as string);
    const redirectUrl = `${process.env.FRONTEND_PUBLIC_URL}/auth/callback?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`;
    res.redirect(redirectUrl);
  } catch {
    res.redirect(`${process.env.FRONTEND_PUBLIC_URL}/login?error=oauth_failed`);
  }
});

export default router;

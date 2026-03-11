import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

class AuthController {
  
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.authenticateUser({ email, pass: password });
      
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 604800000 });
      res.json(result);
    } catch (error) {
      res.status(401).json({ message: (error as Error).message });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const result = await authService.registerUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: (error as Error).message });
    }
  }

  async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refresh_token_id || req.cookies.refreshToken;
      if (!refreshToken) return res.status(400).json({ message: 'Refresh token required' });

      const result = await authService.processRefreshToken(refreshToken);
      
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 604800000 });
      res.json(result);
    } catch {
      res.status(403).json({ message: 'Refresh failed' });
    }
  }

  async validate(req: Request, res: Response) {
    try {
      const accessToken = req.body.access_token; 
      
      if (!accessToken) {
        return res.status(400).json({ message: 'Access token required' });
      }

      const payload = await authService.validateToken(accessToken);
      res.json(payload);
    } catch {
      res.status(401).json({ valid: false });
    }
  }

  async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refresh_token_id || req.cookies.refreshToken;
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
      res.clearCookie('refreshToken');
      res.json({ message: 'Logged out' });
    } catch {
      res.status(200).json({ message: 'Logged out' });
    }
  }

  async initiateOAuth(req: Request, res: Response) {
    try {
      const url = authService.getGoogleOAuthURL();
      res.json({ url });
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  }

  async exchangeCode(req: Request, res: Response) {
    try {
      const { code } = req.body;
      if (!code) return res.status(400).json({ message: 'Code required' });

      const result = await authService.exchangeCodeForTokens(code);
      
      res.cookie('refreshToken', result.refreshToken, { httpOnly: true, maxAge: 604800000 });
      res.json(result);
    } catch (error) {
      const err = error as { response?: { data?: unknown }; message?: string };
      console.error('OAuth Exchange Error:', err.response?.data || err.message);
      res.status(400).json({ message: 'OAuth failed' });
    }
  }
}

export const authController = new AuthController();
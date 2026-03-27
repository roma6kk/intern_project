import { Router } from 'express';
import { authController } from '../controllers/auth.controller';

const router = Router();

/**
 * @openapi
 * /internal/auth/login:
 *   post:
 *     summary: Enter by login/password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Successful authentication, returns tokens
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /internal/auth/validate:
 *   post:
 *     summary: Validation of an existing access‑token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Token is invalid or expired
 */
router.post('/validate', authController.validate);

/**
 * @openapi
 * /internal/auth/refresh:
 *   post:
 *     summary: Updating a pair of tokens by a refresh‑token
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: New access and refresh tokens
 *       401:
 *         description: Invalid refresh‑token
 */
router.post('/refresh', authController.refresh);

/**
 * @openapi
 * /internal/auth/logout:
 *   post:
 *     summary: User logout and session invalidation
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Successful logout
 */
router.post('/logout', authController.logout);

/**
 * @openapi
 * /internal/auth/register:
 *   post:
 *     summary: Registration of a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *               - username
 *     responses:
 *       201:
 *         description: User created
 *       400:
 *         description: Validation error or user already exists
 */
router.post('/register', authController.register);

/**
 * @openapi
 * /internal/auth/oauth/initiate:
 *   get:
 *     summary: Initiation of OAuth‑authentication (for example, Google)
 *     tags:
 *       - OAuth
 *     responses:
 *       302:
 *         description: Redirect to the OAuth provider page
 */
router.get('/oauth/initiate', authController.initiateOAuth);

/**
 * @openapi
 * /internal/auth/oauth/exchange-code:
 *   post:
 *     summary: Exchange of an OAuth‑code for tokens
 *     tags:
 *       - OAuth
 *     responses:
 *       200:
 *         description: Successful exchange, returns tokens
       400:
         description: Invalid code or exchange error
 */
router.post('/oauth/exchange-code', authController.exchangeCode);

export default router;
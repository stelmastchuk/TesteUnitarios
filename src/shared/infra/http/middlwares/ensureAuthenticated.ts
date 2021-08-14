import { NextFunction, Request, Response } from "express";
import { verify } from 'jsonwebtoken';

import authConfig from '../../../../config/auth';
import { JWTInvalidTokenError } from "../../../errors/JWTInvalidTokenError";
import { JWTTokenMissingError } from "../../../errors/JWTTokenMissingError";

interface IPayload {
  sub: string;
}

export async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new JWTTokenMissingError()
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, '769a5c867380cf637a3d0c13d8cc445c') as IPayload;

    request.user = {
      id: user_id,
    };

    next();
  } catch {
    throw new JWTInvalidTokenError()
  }
}

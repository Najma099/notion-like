import z from 'zod';

export enum ValidationSource {
    BODY = 'body',
    HEADER = 'headers',
    QUERY = 'query',
    PARAM = 'params',
    REQUEST = 'request'
}

export const ZodAuthBearer = z
  .string()
  .regex(/^Bearer\s+\S+$/, {
    message: "Invalid Authorization header. Expected: 'Bearer <token>'",
  });

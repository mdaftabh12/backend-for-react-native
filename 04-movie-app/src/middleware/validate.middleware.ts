import { RequestHandler } from "express";
import { ZodType } from "zod";

const validate = (schema: ZodType): RequestHandler => {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      return next(result.error);
    }

    // Replace validated body
    req.body = result.data.body;

    // Replace validated params
    req.params = result.data.params;

    // DO NOT assign req.query
    // Express 5 req.query is getter-only

    next();
  };
};

export { validate };

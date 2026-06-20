import { z } from "zod";

export const jwt_schema_data = z.object({
    id: z.uuid(),
    iat: z.number(),
    exp: z.number()
})

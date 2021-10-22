import { badRequest, ok } from "../utils/httpResponses";

export class Validation {
  constructor(schema) {
    this.schema = schema;
  }
  async execute(httpRequest) {
    const isValid = await this.schema.isValid(httpRequest.body);
    if (!isValid) {
      return badRequest({ message: "Parametros inválidos" });
    }
    return ok();
  }
}

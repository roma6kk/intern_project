import { OpenAPIObject } from '@nestjs/swagger';

export let SWAGGER_DOCUMENT: OpenAPIObject = {} as OpenAPIObject;

export function setSwaggerDocument(document: OpenAPIObject): void {
  SWAGGER_DOCUMENT = document;
}

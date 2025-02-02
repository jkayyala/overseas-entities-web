jest.mock("ioredis");
jest.mock("../../../src/utils/logger");
jest.mock('../../../src/middleware/authentication.middleware');
jest.mock('../../../src/middleware/service.availability.middleware');

import { NextFunction, Request, Response } from "express";
import { expect, jest, test, describe } from "@jest/globals";
import request from "supertest";

import app from "../../../src/app";
import { UPDATE_INTERRUPT_CARD_URL, UPDATE_INTERRUPT_CARD_PAGE, OVERSEAS_ENTITY_QUERY_URL } from "../../../src/config";
import { INTERRUPT_CARD_PAGE_TITLE } from "../../__mocks__/text.mock";

import {
  ANY_MESSAGE_ERROR,
  SERVICE_UNAVAILABLE,
  PAGE_TITLE_ERROR
} from "../../__mocks__/text.mock";

import { authentication } from "../../../src/middleware/authentication.middleware";
import { serviceAvailabilityMiddleware } from "../../../src/middleware/service.availability.middleware";
import { logger } from "../../../src/utils/logger";

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );
const mockServiceAvailabilityMiddleware = serviceAvailabilityMiddleware as jest.Mock;
mockServiceAvailabilityMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockLoggerDebugRequest = logger.debugRequest as jest.Mock;

describe("UPDATE INTERRUPT CARD controller", () => {
  describe("GET tests", () => {
    test(`renders the ${UPDATE_INTERRUPT_CARD_PAGE} page`, async () => {
      const resp = await request(app).get(UPDATE_INTERRUPT_CARD_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(INTERRUPT_CARD_PAGE_TITLE);
      expect(resp.text).not.toContain(PAGE_TITLE_ERROR);
    });

    test("catch error when rendering the page", async () => {
      mockLoggerDebugRequest.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app).get(UPDATE_INTERRUPT_CARD_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });

  describe("POST tests", () => {
    test(`redirect to ${OVERSEAS_ENTITY_QUERY_URL}`, async () => {
      const resp = await request(app).post(UPDATE_INTERRUPT_CARD_URL);

      expect(resp.status).toEqual(302);
      expect(resp.text).toContain("overseas-entity-query");
    });

    test("catch error when posting the page", async () => {
      mockLoggerDebugRequest.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app)
        .post(UPDATE_INTERRUPT_CARD_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });
});

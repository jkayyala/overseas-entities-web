jest.mock("ioredis");
jest.mock('../../src/middleware/authentication.middleware');
jest.mock('../../src/middleware/navigation/is.secure.register.middleware');
jest.mock("../../src/utils/feature.flag" );

import { NextFunction, Request, Response } from "express";
import { expect, jest, test, describe } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import { INTERRUPT_CARD_PAGE, INTERRUPT_CARD_URL, LANDING_PAGE_URL } from "../../src/config";
import { INTERRUPT_CARD_PAGE_TITLE } from "../__mocks__/text.mock";

import { authentication } from "../../src/middleware/authentication.middleware";
import { isSecureRegister } from "../../src/middleware/navigation/is.secure.register.middleware";
import { isActiveFeature } from "../../src/utils/feature.flag";

const mockIsSecureRegisterMiddleware = isSecureRegister as jest.Mock;
mockIsSecureRegisterMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

describe("INTERRUPT CARD controller", () => {
  describe("GET tests", () => {
    test(`renders the ${INTERRUPT_CARD_PAGE} page`, async () => {
      const resp = await request(app).get(INTERRUPT_CARD_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(INTERRUPT_CARD_PAGE_TITLE);
      expect(resp.text).toContain(LANDING_PAGE_URL);
    });

    test(`renders the ${INTERRUPT_CARD_PAGE} page with trust feature flag false`, async () => {
      (isActiveFeature as jest.Mock).mockReturnValue(false);

      const resp = await request(app).get(INTERRUPT_CARD_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(INTERRUPT_CARD_PAGE_TITLE);
      expect(resp.text).toContain(LANDING_PAGE_URL);
      expect(resp.text).toContain("Trusts");
    });
  });
});

jest.mock("ioredis");
jest.mock("../../../src/utils/logger");
jest.mock('../../../src/middleware/authentication.middleware');
jest.mock('../../../src/middleware/service.availability.middleware');
jest.mock('../../../src/utils/application.data');

import { NextFunction, Request, Response } from "express";
import { beforeEach, expect, jest, test, describe } from "@jest/globals";
import request from "supertest";
import { serviceAvailabilityMiddleware } from "../../../src/middleware/service.availability.middleware";

import * as config from "../../../src/config";
import app from "../../../src/app";
import {
  PAGE_TITLE_ERROR,
  OVERSEAS_ENTITY_UPDATE_TITLE,
  CHANGE_LINK,
  CHANGE_LINK_ENTITY_NAME,
  CHANGE_LINK_ENTITY_EMAIL,
  CHANGE_LINK_ENTITY_GOVERNING_LAW,
  CHANGE_LINK_ENTITY_INCORPORATION_COUNTRY,
  CHANGE_LINK_ENTITY_LEGAL_FORM,
  CHANGE_LINK_ENTITY_PRINCIPAL_ADDRESS,
  CHANGE_LINK_ENTITY_SERVICE_ADDRESS
} from "../../__mocks__/text.mock";

import { APPLICATION_DATA_MOCK } from "../../__mocks__/session.mock";

import { getApplicationData } from "../../../src/utils/application.data";
import { authentication } from "../../../src/middleware/authentication.middleware";

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );
const mockServiceAvailabilityMiddleware = serviceAvailabilityMiddleware as jest.Mock;
mockServiceAvailabilityMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockGetApplicationData = getApplicationData as jest.Mock;

describe("OVERSEAS ENTITY REVIEW controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET tests", () => {
    test(`renders the ${config.OVERSEAS_ENTITY_REVIEW_PAGE} page`, async () => {

      mockGetApplicationData.mockReturnValueOnce({ ...APPLICATION_DATA_MOCK });

      const resp = await request(app).get(config.OVERSEAS_ENTITY_REVIEW_URL);
      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(OVERSEAS_ENTITY_UPDATE_TITLE);
      expect(resp.text).not.toContain(PAGE_TITLE_ERROR);
      expect(resp.text).toContain("overseasEntityName");
      expect(resp.text).toContain("incorporationCountry");
    });

    test(`renders the ${config.OVERSEAS_ENTITY_REVIEW_PAGE} with Change links`, async () => {

      mockGetApplicationData.mockReturnValueOnce({ ...APPLICATION_DATA_MOCK });

      const resp = await request(app).get(config.OVERSEAS_ENTITY_REVIEW_URL);
      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(OVERSEAS_ENTITY_UPDATE_TITLE);
      expect(resp.text).not.toContain(PAGE_TITLE_ERROR);
      expect(resp.text).toContain(CHANGE_LINK);
      expect(resp.text).toContain(CHANGE_LINK_ENTITY_NAME);
      expect(resp.text).toContain(CHANGE_LINK_ENTITY_INCORPORATION_COUNTRY);
      expect(resp.text).toContain(CHANGE_LINK_ENTITY_PRINCIPAL_ADDRESS);
      expect(resp.text).toContain(CHANGE_LINK_ENTITY_SERVICE_ADDRESS);
      expect(resp.text).toContain(CHANGE_LINK_ENTITY_EMAIL);
      expect(resp.text).toContain(CHANGE_LINK_ENTITY_LEGAL_FORM);
      expect(resp.text).toContain(CHANGE_LINK_ENTITY_GOVERNING_LAW);
    });
  });

});

jest.mock("ioredis");
jest.mock('../../../src/middleware/authentication.middleware');
jest.mock('../../../src/middleware/service.availability.middleware');
jest.mock('../../../src/utils/application.data');
jest.mock('../../../src/middleware/navigation/update/has.entity.update.middleware');

import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { NextFunction, Request, Response } from "express";
import request from "supertest";

import app from "../../../src/app";
import { authentication } from "../../../src/middleware/authentication.middleware";
import { serviceAvailabilityMiddleware } from "../../../src/middleware/service.availability.middleware";
import { hasEntityUpdateDetails } from "../../../src/middleware/navigation/update/has.entity.update.middleware";
import * as config from "../../../src/config";
import { getApplicationData } from '../../../src/utils/application.data';
import {
  SERVICE_UNAVAILABLE,
  BENEFICIAL_OWNER_TYPE_PAGE_HEADING_ALL_IDENTIFIED_ALL_DETAILS,
  BENEFICIAL_OWNER_TYPE_LEGEND_TEXT_ALL_IDENTIFIED_ALL_DETAILS,
  BENEFICIAL_OWNER_TYPE_ADD_BUTTON_ALL_IDENTIFIED,
  BENEFICIAL_OWNER_TYPE_PAGE_GOVERNMENT_BO,
  BENEFICIAL_OWNER_TYPE_PAGE_CORPORATE_BO,
  BENEFICIAL_OWNER_TYPE_PAGE_CORPORATE_MO,
  BENEFICIAL_OWNER_TYPE_PAGE_INDIVIDUAL_BO,
  BENEFICIAL_OWNER_TYPE_PAGE_INDIVIDUAL_MO,
  PAGE_TITLE_ERROR
} from '../../__mocks__/text.mock';
import {
  APPLICATION_DATA_MOCK,
  ERROR
} from '../../__mocks__/session.mock';
import { ErrorMessages } from '../../../src/validation/error.messages';
import { BeneficialOwnersStatementType, BeneficialOwnerStatementKey } from '../../../src/model/beneficial.owner.statement.model';
import { BeneficialOwnerTypeChoice, BeneficialOwnerTypeKey } from '../../../src/model/beneficial.owner.type.model';

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockServiceAvailabilityMiddleware = serviceAvailabilityMiddleware as jest.Mock;
mockServiceAvailabilityMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockHasEntityUpdate = hasEntityUpdateDetails as jest.Mock;
mockHasEntityUpdate.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockGetApplicationData = getApplicationData as jest.Mock;

describe("BENEFICIAL OWNER TYPE controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET tests", () => {
    test(`renders the ${config.UPDATE_BENEFICIAL_OWNER_TYPE_PAGE} page for beneficial owners`, async () => {
      mockGetApplicationData.mockReturnValueOnce({
        ...APPLICATION_DATA_MOCK,
        [BeneficialOwnerStatementKey]: BeneficialOwnersStatementType.ALL_IDENTIFIED_ALL_DETAILS
      });
      const resp = await request(app).get(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_PAGE_HEADING_ALL_IDENTIFIED_ALL_DETAILS);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_PAGE_INDIVIDUAL_BO);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_PAGE_CORPORATE_BO);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_PAGE_GOVERNMENT_BO);
      expect(resp.text).not.toContain(BENEFICIAL_OWNER_TYPE_PAGE_INDIVIDUAL_MO);
      expect(resp.text).not.toContain(BENEFICIAL_OWNER_TYPE_PAGE_CORPORATE_MO);
    });

    test(`renders the ${config.UPDATE_BENEFICIAL_OWNER_TYPE_PAGE} page for beneficial owners with just the BOs options`, async () => {
      mockGetApplicationData.mockReturnValueOnce({ [BeneficialOwnerStatementKey]: BeneficialOwnersStatementType.ALL_IDENTIFIED_ALL_DETAILS });
      const resp = await request(app).get(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_PAGE_HEADING_ALL_IDENTIFIED_ALL_DETAILS);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_LEGEND_TEXT_ALL_IDENTIFIED_ALL_DETAILS);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_ADD_BUTTON_ALL_IDENTIFIED);
    });

    test("catch error when rendering the page", async () => {
      mockGetApplicationData.mockImplementationOnce( () => { throw ERROR; });
      const resp = await request(app).get(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });

  describe("POST tests", () => {
    test(`redirects to the ${config.UPDATE_BENEFICIAL_OWNER_INDIVIDUAL_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL)
        .send({ [BeneficialOwnerTypeKey]: BeneficialOwnerTypeChoice.individual });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.UPDATE_BENEFICIAL_OWNER_INDIVIDUAL_URL);
    });

    test(`redirects to the ${config.UPDATE_BENEFICIAL_OWNER_OTHER_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL)
        .send({ [BeneficialOwnerTypeKey]: BeneficialOwnerTypeChoice.otherLegal });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.UPDATE_BENEFICIAL_OWNER_OTHER_URL);
    });

    test(`redirects to the ${config.UPDATE_BENEFICIAL_OWNER_GOV_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL)
        .send({ [BeneficialOwnerTypeKey]: BeneficialOwnerTypeChoice.government });

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toEqual(config.UPDATE_BENEFICIAL_OWNER_GOV_URL);
    });

    test(`renders the current page with error message when ${BeneficialOwnersStatementType.ALL_IDENTIFIED_ALL_DETAILS} has been selected `, async () => {
      const resp = await request(app)
        .post(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL)
        .send({ [BeneficialOwnerStatementKey]: BeneficialOwnersStatementType.ALL_IDENTIFIED_ALL_DETAILS });

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(BENEFICIAL_OWNER_TYPE_PAGE_HEADING_ALL_IDENTIFIED_ALL_DETAILS);
      expect(resp.text).toContain(ErrorMessages.SELECT_THE_TYPE_OF_BENEFICIAL_OWNER_YOU_WANT_TO_ADD);
    });

    test(`POST empty object and check for error in page title`, async () => {
      const resp = await request(app).post(config.UPDATE_BENEFICIAL_OWNER_TYPE_URL);
      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(PAGE_TITLE_ERROR);
    });
  });

  describe("POST Submit tests", () => {
    test(`redirects to the ${config.UPDATE_CHECK_YOUR_ANSWERS_PAGE} page`, async () => {
      const resp = await request(app)
        .post(config.UPDATE_BENEFICIAL_OWNER_TYPE_SUBMIT_URL);

      expect(resp.status).toEqual(302);
      expect(resp.header.location).toContain(config.UPDATE_CHECK_YOUR_ANSWERS_PAGE);
    });
  });
});
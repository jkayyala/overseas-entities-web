jest.mock("ioredis");
jest.mock("../../../src/utils/logger");
jest.mock('../../../src/middleware/authentication.middleware');
jest.mock('../../../src/middleware/company.authentication.middleware');
jest.mock('../../../src/middleware/service.availability.middleware');
jest.mock('../../../src/utils/application.data');
jest.mock('../../../src/middleware/navigation/update/has.overseas.entity.middleware');
jest.mock('../../../src/utils/save.and.continue');

import { NextFunction, Request, Response } from "express";
import { beforeEach, expect, jest, test, describe } from "@jest/globals";
import request from "supertest";
import { serviceAvailabilityMiddleware } from "../../../src/middleware/service.availability.middleware";

import * as config from "../../../src/config";
import app from "../../../src/app";

import { APPLICATION_DATA_MOCK, UPDATE_ENTITY_BODY_OBJECT_MOCK_WITH_ADDRESS, ENTITY_OBJECT_MOCK } from "../../__mocks__/session.mock";

import { getApplicationData, prepareData, setApplicationData } from "../../../src/utils/application.data";
import { authentication } from "../../../src/middleware/authentication.middleware";
import { companyAuthentication } from "../../../src/middleware/company.authentication.middleware";
import { saveAndContinue } from "../../../src/utils/save.and.continue";
import {
  ANY_MESSAGE_ERROR,
  ENTITY_PAGE_TITLE,
  PAGE_TITLE_ERROR,
  SAVE_AND_CONTINUE_BUTTON_TEXT,
  SERVICE_UNAVAILABLE
}
  from "../../__mocks__/text.mock";
import { EntityKey } from "../../../src/model/entity.model";
import {
  IsOnRegisterInCountryFormedInKey,
  PublicRegisterJurisdictionKey,
  PublicRegisterNameKey,
  RegistrationNumberKey
} from "../../../src/model/data.types.model";
import { ErrorMessages } from "../../../src/validation/error.messages";
import { UPDATE_ENTITY_WITH_INVALID_CHARACTERS_FIELDS_MOCK } from "../../__mocks__/validation.mock";
import { hasOverseasEntityNumber } from "../../../src/middleware/navigation/update/has.overseas.entity.middleware";

const mockAuthenticationMiddleware = authentication as jest.Mock;
mockAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockCompanyAuthenticationMiddleware = companyAuthentication as jest.Mock;
mockCompanyAuthenticationMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockServiceAvailabilityMiddleware = serviceAvailabilityMiddleware as jest.Mock;
mockServiceAvailabilityMiddleware.mockImplementation((req: Request, res: Response, next: NextFunction) => next() );

const mockHasOverseasEntityNumber = hasOverseasEntityNumber as jest.Mock;
mockHasOverseasEntityNumber.mockImplementation((req: Request, res: Response, next: NextFunction) => next());

const mockPrepareData = prepareData as jest.Mock;
const mockGetApplicationData = getApplicationData as jest.Mock;
const mockSetApplicationData = setApplicationData as jest.Mock;
const mockSaveAndContinue = saveAndContinue as jest.Mock;

describe("OVERSEAS ENTITY UPDATE DETAILS controller", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET tests", () => {
    test(`renders the OVERSEAS ENTITY UPDATE DETAILS page`, async () => {
      mockGetApplicationData.mockReturnValueOnce({ ...APPLICATION_DATA_MOCK });

      const resp = await request(app).get(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL);
      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ENTITY_PAGE_TITLE);
      expect(resp.text).not.toContain(PAGE_TITLE_ERROR);
      expect(resp.text).toContain(SAVE_AND_CONTINUE_BUTTON_TEXT);
    });

    test("renders the OVERSEAS ENTITY UPDATE DETAILS on GET method with Afghanistan as country field", async () => {
      mockGetApplicationData.mockReturnValueOnce( {
        ...APPLICATION_DATA_MOCK,
        [EntityKey]: {
          ...APPLICATION_DATA_MOCK[EntityKey],
          incorporation_country: "Afghanistan"
        }
      });
      const resp = await request(app).get(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ENTITY_PAGE_TITLE);
      expect(resp.text).toContain("value=\"Afghanistan\" selected");
      expect(resp.text).toContain(SAVE_AND_CONTINUE_BUTTON_TEXT);
    });

    test("catch error when renders the entity page on GET method", async () => {
      mockGetApplicationData.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app).get(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });

  describe("POST tests", () => {
    test("redirect to OVERSEAS ENTITY REVIEW page after a successful post from OVERSEAS ENTITY UPDATE DETAILS page", async () => {
      mockPrepareData.mockReturnValueOnce(ENTITY_OBJECT_MOCK);
      const resp = await request(app)
        .post(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL)
        .send(UPDATE_ENTITY_BODY_OBJECT_MOCK_WITH_ADDRESS);

      expect(resp.status).toEqual(302);
      expect(resp.text).toContain(config.OVERSEAS_ENTITY_REVIEW_PAGE);
      expect(mockSaveAndContinue).toHaveBeenCalledTimes(1);
    });

    test("renders the current page with INVALID CHARACTERS error messages", async () => {
      const resp = await request(app)
        .post(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL)
        .send(UPDATE_ENTITY_WITH_INVALID_CHARACTERS_FIELDS_MOCK);

      expect(resp.status).toEqual(200);
      expect(resp.text).toContain(ENTITY_PAGE_TITLE);
      expect(resp.text).toContain(ErrorMessages.ENTITY_NAME_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.PROPERTY_NAME_OR_NUMBER_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.ADDRESS_LINE_1_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.ADDRESS_LINE_2_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.CITY_OR_TOWN_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.COUNTY_STATE_PROVINCE_REGION_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.POSTCODE_ZIPCODE_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.EMAIL_INVALID_FORMAT);
      expect(resp.text).toContain(ErrorMessages.LEGAL_FORM_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.LAW_GOVERNED_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.PUBLIC_REGISTER_NAME_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.PUBLIC_REGISTER_JURISDICTION_INVALID_CHARACTERS);
      expect(resp.text).toContain(ErrorMessages.PUBLIC_REGISTER_NUMBER_INVALID_CHARACTERS);
    });

    test("redirect to the next page page after a successful post from OVERSEAS ENTITY UPDATE DETAILS page without the register option", async () => {
      mockPrepareData.mockReturnValueOnce( { ...ENTITY_OBJECT_MOCK, [IsOnRegisterInCountryFormedInKey]: "" } );
      const resp = await request(app)
        .post(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL)
        .send(UPDATE_ENTITY_BODY_OBJECT_MOCK_WITH_ADDRESS);

      expect(resp.status).toEqual(302);

      const data = mockSetApplicationData.mock.calls[0][1];
      expect(data[PublicRegisterNameKey]).toEqual('');
      expect(data[PublicRegisterJurisdictionKey]).toEqual('');
      expect(data[RegistrationNumberKey]).toEqual('');
    });

    test("catch error when post data from ENTITY page", async () => {
      mockSetApplicationData.mockImplementationOnce( () => { throw new Error(ANY_MESSAGE_ERROR); });
      const resp = await request(app)
        .post(config.OVERSEAS_ENTITY_UPDATE_DETAILS_URL)
        .send(UPDATE_ENTITY_BODY_OBJECT_MOCK_WITH_ADDRESS);

      expect(resp.status).toEqual(500);
      expect(resp.text).toContain(SERVICE_UNAVAILABLE);
    });
  });
});

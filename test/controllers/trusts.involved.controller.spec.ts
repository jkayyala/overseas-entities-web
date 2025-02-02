jest.mock("ioredis");
jest.mock('express-validator/src/validation-result');
jest.mock(".../../../src/utils/application.data");
jest.mock('../../src/middleware/authentication.middleware');
jest.mock('../../src/middleware/navigation/has.trust.middleware');
jest.mock('../../src/middleware/is.feature.enabled.middleware', () => ({
  isFeatureEnabled: () => (_, __, next: NextFunction) => next(),
}));
jest.mock('../../src/utils/trust/common.trust.data.mapper');
jest.mock('../../src/utils/trust/who.is.involved.mapper');
jest.mock('../../src/utils/trust/who.is.involved.mapper');
jest.mock('../../src/utils/trusts');

import { constants } from 'http2';
import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { NextFunction, Request, Response } from "express";
import { Params } from 'express-serve-static-core';
import { validationResult } from 'express-validator/src/validation-result';
import { Session } from '@companieshouse/node-session-handler';
import request from "supertest";
import app from "../../src/app";
import { TRUST_WITH_ID } from '../__mocks__/session.mock';
import { ANY_MESSAGE_ERROR, PAGE_TITLE_ERROR } from '../__mocks__/text.mock';
import {
  ADD_TRUST_URL,
  TRUST_ENTRY_URL,
  TRUST_HISTORICAL_BENEFICIAL_OWNER_URL,
  TRUST_INDIVIDUAL_BENEFICIAL_OWNER_URL,
  TRUST_INVOLVED_PAGE,
  TRUST_INVOLVED_URL,
  TRUST_LEGAL_ENTITY_BENEFICIAL_OWNER_URL,
} from '../../src/config';
import { get, post, TRUST_INVOLVED_TEXTS } from "../../src/controllers/trust.involved.controller";
import { authentication } from '../../src/middleware/authentication.middleware';
import { hasTrustWithId } from '../../src/middleware/navigation/has.trust.middleware';
import { ErrorMessages } from '../../src/validation/error.messages';
import { TrusteeType } from '../../src/model/trustee.type.model';
import { getApplicationData } from '../../src/utils/application.data';
import { mapCommonTrustDataToPage } from '../../src/utils/trust/common.trust.data.mapper';
import { mapTrustWhoIsInvolvedToPage } from '../../src/utils/trust/who.is.involved.mapper';
import { getFormerTrusteesFromTrust, getIndividualTrusteesFromTrust } from '../../src/utils/trusts';

describe('Trust Involved controller', () => {
  const mockGetApplicationData = getApplicationData as jest.Mock;

  const trustId = TRUST_WITH_ID.trust_id;
  const pageUrl = `${TRUST_ENTRY_URL}/${trustId}${TRUST_INVOLVED_URL}`;

  let mockReq = {} as Request;
  const mockRes = {
    render: jest.fn() as any,
    redirect: jest.fn() as any,
  } as Response;
  const mockNext = jest.fn();

  const mockAppData = {
    dummyAppDataKey: 'dummyApplicationDataValue',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockReq = {
      params: {
        trustId: trustId,
      } as Params,
      headers: {},
      session: {} as Session,
      route: '',
      method: '',
      body: {},
    } as Request;
  });

  describe('GET unit tests', () => {
    test(('success'), () => {
      mockGetApplicationData.mockReturnValue(mockAppData);

      const mockTrustData = {
        trustName: 'dummy',
      };
      (mapCommonTrustDataToPage as any as jest.Mock).mockReturnValue(mockTrustData);

      const mockInvolvedData = {
        involvedDummyKey: 'involvedDummyValue',
      };
      (mapTrustWhoIsInvolvedToPage as any as jest.Mock).mockReturnValue(mockInvolvedData);

      const indiviudalTrusteeData = {
        name: "indiviudalTrustee"
      };

      (getIndividualTrusteesFromTrust as any as jest.Mock).mockReturnValue(indiviudalTrusteeData);

      const formerTrusteeData = {
        name: "formerTrustee"
      };

      (getFormerTrusteesFromTrust as any as jest.Mock).mockReturnValue(formerTrusteeData);

      get(mockReq, mockRes, mockNext);

      expect(mockRes.redirect).not.toBeCalled();

      expect(mapCommonTrustDataToPage).toBeCalledTimes(1);
      expect(mapCommonTrustDataToPage).toBeCalledWith(mockAppData, trustId);

      expect(mapTrustWhoIsInvolvedToPage).toBeCalledTimes(1);
      expect(mapTrustWhoIsInvolvedToPage).toBeCalledWith(mockAppData, trustId);

      expect(getIndividualTrusteesFromTrust).toBeCalledTimes(1);
      expect(getIndividualTrusteesFromTrust).toBeCalledWith(mockAppData, trustId);

      expect(getFormerTrusteesFromTrust).toBeCalledTimes(1);
      expect(getFormerTrusteesFromTrust).toBeCalledWith(mockAppData, trustId);

      expect(mockRes.render).toBeCalledTimes(1);
      expect(mockRes.render).toBeCalledWith(
        TRUST_INVOLVED_PAGE,
        expect.objectContaining({
          pageData: expect.objectContaining({
            trustData: mockTrustData,
            ...mockInvolvedData,
            individualTrusteeData: indiviudalTrusteeData,
            formerTrusteeData: formerTrusteeData,
          }),
        }),
      );
    });

    test('catch error when post data from page', () => {
      mockReq.body = {
        id: 'dummyId',
        typeOfTrustee: 'dummyTrusteeType',
        noMoreToAdd: 'add',
      };
      const error = new Error(ANY_MESSAGE_ERROR);
      (mockRes.redirect as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      post(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(error);
    });

    test('catch error when renders the page', () => {
      const error = new Error(ANY_MESSAGE_ERROR);
      mockGetApplicationData.mockImplementationOnce(() => {
        throw error;
      });

      get(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(error);
    });
  });

  describe('POST unit tests', () => {
    test('no more to add button pushed', () => {
      mockReq.body = {
        noMoreToAdd: 'noMoreToAdd',
      };

      post(mockReq, mockRes, mockNext);

      expect(mockRes.redirect).toBeCalledTimes(1);
      expect(mockRes.redirect).toBeCalledWith(`${TRUST_ENTRY_URL + ADD_TRUST_URL}`);
    });

    const dpPostTrustee = [
      [
        TrusteeType.HISTORICAL,
        TRUST_HISTORICAL_BENEFICIAL_OWNER_URL,
      ],
      [
        TrusteeType.INDIVIDUAL,
        TRUST_INDIVIDUAL_BENEFICIAL_OWNER_URL,
      ],
      [
        TrusteeType.LEGAL_ENTITY,
        TRUST_LEGAL_ENTITY_BENEFICIAL_OWNER_URL,
      ],
      [
        'unknown',
        '',
      ],
    ];

    test.each(dpPostTrustee)(
      'success push with %p type',
      (typeOfTrustee: string, expectedUrl: string) => {
        mockReq.body = {
          typeOfTrustee,
        };

        (validationResult as any as jest.Mock).mockImplementationOnce(() => ({
          isEmpty: jest.fn().mockReturnValue(true),
        }));

        post(mockReq, mockRes, mockNext);

        expect(mockRes.redirect).toBeCalledTimes(1);
        expect(mockRes.redirect).toBeCalledWith(`${TRUST_ENTRY_URL}/${trustId}${expectedUrl}`);
      },
    );

    test('render error', () => {
      const mockValidationErrors = [
        {
          value: undefined,
          msg: 'Select which type of individual or entity you want to add',
          param: 'typeOfTrustee',
          location: 'body',
        }, //  as ValidationError,
      ];
      (validationResult as any as jest.Mock).mockImplementationOnce(() => ({
        isEmpty: jest.fn().mockReturnValue(false),
        array: jest.fn().mockReturnValue(mockValidationErrors),
      }));

      mockReq.body = {
        dummyKey: 'dummyValue',
      };

      const mockTrustData = {
        trustName: 'dummy',
      };
      (mapCommonTrustDataToPage as any as jest.Mock).mockReturnValue(mockTrustData);

      const mockInvolvedData = {
        involvedDummyKey: 'involvedDummyValue',
      };
      (mapTrustWhoIsInvolvedToPage as any as jest.Mock).mockReturnValue(mockInvolvedData);

      post(mockReq, mockRes, mockNext);

      expect(mockRes.redirect).not.toBeCalled;

      expect(mapCommonTrustDataToPage).toBeCalledTimes(1);
      expect(mapCommonTrustDataToPage).toBeCalledWith(mockAppData, trustId);

      expect(mapTrustWhoIsInvolvedToPage).toBeCalledTimes(1);
      expect(mapTrustWhoIsInvolvedToPage).toBeCalledWith(mockAppData, trustId);

      expect(mockRes.render).toBeCalledTimes(1);
      expect(mockRes.render).toBeCalledWith(
        TRUST_INVOLVED_PAGE,
        expect.objectContaining({
          pageData: expect.objectContaining({
            trustData: mockTrustData,
            ...mockInvolvedData,
          }),
          errors: {
            errorList: [
              {
                href: '#typeOfTrustee',
                text: ErrorMessages.TRUST_INVOLVED_INVALID,
              },
            ],
            typeOfTrustee: {
              text: ErrorMessages.TRUST_INVOLVED_INVALID,
            },
          },
          formData: mockReq.body,
        }),
      );
    });

    test('catch error when post data from page', () => {
      mockReq.body = {
        id: 'dummyId',
        typeOfTrustee: 'dummyTrusteeType',
        noMoreToAdd: 'add',
      };
      const error = new Error(ANY_MESSAGE_ERROR);
      (mockRes.redirect as jest.Mock).mockImplementationOnce(() => {
        throw error;
      });

      post(mockReq, mockRes, mockNext);

      expect(mockNext).toBeCalledTimes(1);
      expect(mockNext).toBeCalledWith(error);
    });
  });

  describe('Endpoint Access tests with supertest', () => {
    beforeEach(() => {
      (authentication as jest.Mock).mockImplementation((_, __, next: NextFunction) => next());
      (hasTrustWithId as jest.Mock).mockImplementation((_, __, next: NextFunction) => next());
    });

    test(`successfully access GET method`, async () => {
      const mockTrustData = {
        trustName: 'dummy',
      };
      (mapCommonTrustDataToPage as any as jest.Mock).mockReturnValue(mockTrustData);

      const resp = await request(app).get(pageUrl);

      expect(resp.status).toEqual(constants.HTTP_STATUS_OK);
      expect(resp.text).toContain(TRUST_INVOLVED_TEXTS.title);
      expect(resp.text).toContain(mockTrustData.trustName);
      expect(resp.text).not.toContain(PAGE_TITLE_ERROR);
      expect(hasTrustWithId).toBeCalledTimes(1);
    });

    test(`successfully access POST method`, async () => {

      const resp = await request(app).post(pageUrl).send({ noMoreToAdd: 'noMoreToAdd' });

      expect(resp.status).toEqual(constants.HTTP_STATUS_FOUND);
      expect(resp.text).toContain(ADD_TRUST_URL);
      expect(resp.text).not.toContain(PAGE_TITLE_ERROR);
    });
  });
});

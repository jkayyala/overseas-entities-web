jest.mock('../../src/utils/logger');
jest.mock("../../src/utils/application.data");
jest.mock("../../src/service/retry.handler.service");

import { describe, expect, test, jest, beforeEach } from "@jest/globals";

import {
  APPLICATION_DATA_MOCK,
  ERROR,
  fnNamePostTransaction,
  fnNamePutTransaction,
  getSessionRequestWithExtraData,
  OVERSEAS_ENTITY_ID,
  serviceNameTransaction,
  TRANSACTION,
  TRANSACTION_CLOSED_PARAMS,
  TRANSACTION_CLOSED_RESPONSE,
  TRANSACTION_ID,
  TRANSACTION_POST_PARAMS,
} from "../__mocks__/session.mock";
import { createAndLogErrorRequest, logger } from '../../src/utils/logger';
import { getApplicationData } from "../../src/utils/application.data";

import { HTTP_STATUS_CODE_500, TRANSACTION_ERROR } from "../__mocks__/text.mock";
import { Request } from "express";
import { closeTransaction, postTransaction } from "../../src/service/transaction.service";
import { makeApiCallWithRetry } from "../../src/service/retry.handler.service";

const mockDebugRequestLog = logger.debugRequest as jest.Mock;
const mockCreateAndLogErrorRequest = createAndLogErrorRequest as jest.Mock;
mockCreateAndLogErrorRequest.mockReturnValue(ERROR);

const mockGetApplicationData = getApplicationData as jest.Mock;
const mockMakeApiCallWithRetry = makeApiCallWithRetry as jest.Mock;

const session = getSessionRequestWithExtraData();
const req: Request = {} as Request;

describe('Transaction Service test suite', () => {

  beforeEach (() => {
    jest.clearAllMocks();
  });

  describe('POST Transaction', () => {
    test('Should successfully post a transaction', async () => {
      mockGetApplicationData.mockReturnValueOnce( { ...APPLICATION_DATA_MOCK, entity: undefined } );
      mockMakeApiCallWithRetry.mockReturnValueOnce( { httpStatusCode: 200, resource: TRANSACTION } );
      const response = await postTransaction(req, session);

      expect(mockMakeApiCallWithRetry).toBeCalledWith(
        serviceNameTransaction, fnNamePostTransaction, req, session, { ...TRANSACTION_POST_PARAMS, companyName: undefined }
      );

      expect(response).toEqual(TRANSACTION_ID);
      expect(mockDebugRequestLog).toBeCalledTimes(1);
    });

    test(`Should throw an error (${HTTP_STATUS_CODE_500}) when httpStatusCode 500`, async () => {
      mockGetApplicationData.mockReturnValueOnce( APPLICATION_DATA_MOCK );
      mockMakeApiCallWithRetry.mockReturnValueOnce( { httpStatusCode: 500 } );

      await expect( postTransaction(req, session) ).rejects.toThrow(ERROR);
      expect(mockCreateAndLogErrorRequest).toBeCalledWith(req, HTTP_STATUS_CODE_500);
      expect(mockDebugRequestLog).not.toHaveBeenCalled();
    });

    test(`Should throw an error (${TRANSACTION_ERROR}) when no transaction api response`, async () => {
      mockGetApplicationData.mockReturnValueOnce( APPLICATION_DATA_MOCK );
      mockMakeApiCallWithRetry.mockResolvedValueOnce({ httpStatusCode: 200 });

      await expect( postTransaction(req, session) ).rejects.toThrow(ERROR);
      expect(mockCreateAndLogErrorRequest).toBeCalledWith(req, `POST - ${TRANSACTION_ERROR}`);
      expect(mockDebugRequestLog).not.toHaveBeenCalled();
    });
  });

  describe('CLOSE Transaction', () => {
    test('Should successfully update (change status to close) transaction', async () => {
      mockMakeApiCallWithRetry.mockResolvedValueOnce(TRANSACTION_CLOSED_RESPONSE);
      const response = await closeTransaction(req, session, TRANSACTION_ID, OVERSEAS_ENTITY_ID);

      expect(mockMakeApiCallWithRetry).toBeCalledWith(
        serviceNameTransaction, fnNamePutTransaction, req, session, TRANSACTION_CLOSED_PARAMS
      );
      expect(response).toEqual(TRANSACTION_CLOSED_RESPONSE);
      expect(mockDebugRequestLog).toBeCalledTimes(1);
    });

    test(`Should throw an error (${HTTP_STATUS_CODE_500}) when httpStatusCode 500`, async () => {
      mockMakeApiCallWithRetry.mockResolvedValueOnce({ httpStatusCode: 500 });

      await expect( closeTransaction(req, session, TRANSACTION_ID, OVERSEAS_ENTITY_ID) ).rejects.toThrow(ERROR);
      expect(mockCreateAndLogErrorRequest).toBeCalledWith(req, HTTP_STATUS_CODE_500);
      expect(mockDebugRequestLog).not.toHaveBeenCalled();
    });

    test(`Should throw an error (${TRANSACTION_ERROR}) when no response returned`, async () => {
      mockMakeApiCallWithRetry.mockResolvedValueOnce(null);

      await expect( closeTransaction(req, session, TRANSACTION_ID, OVERSEAS_ENTITY_ID) ).rejects.toThrow(ERROR);
      expect(mockCreateAndLogErrorRequest).toBeCalledWith(req, `PUT - ${TRANSACTION_ERROR}`);
      expect(mockDebugRequestLog).not.toHaveBeenCalled();
    });
  });

});

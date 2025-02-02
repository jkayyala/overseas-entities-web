import { ApiErrorResponse, ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { CompanyOfficers } from "@companieshouse/api-sdk-node/dist/services/company-officers/types";
import { ANY_MESSAGE_ERROR } from "./text.mock";

export const MOCK_GET_COMPANY_OFFICERS: CompanyOfficers = {
  "inactiveCount": '0',
  "links": {
    "self": "/company/OE111129/officers"
  },
  "kind": "officer-list",
  "itemsPerPage": '35',
  "etag": "015ab53552e02f53c8d92e50a678d30628256e73",
  "activeCount": '2',
  "startIndex": '0',
  "items": [
    {
      "address": {
        "region": "Gloucestershire",
        "postalCode": "GL7 7BX",
        "locality": "Cirencester",
        "addressLine2": "North Cerney",
        "addressLine1": "Cerney House",
        "country": "England",
        "premises": "Samron House"
      },
      "appointedOn": "2023-01-01",
      "links": {
        "officer": {
          "appointments": "/officers/secretary1/appointments"
        }
      },
      "name": "JONES, Tim Bill",
      "officerRole": "managing-officer"
    }
  ],
  "resignedCount": '0',
  "totalResults": '2'
};

export const MOCK_GET_COMPANY_OFFICERS_RESPONSE: ApiResponse<CompanyOfficers> = {
  httpStatusCode: 200,
  resource: MOCK_GET_COMPANY_OFFICERS
};

export const MOCK_GET_COMPANY_OFFICERS_UNAUTHORISED_RESPONSE: ApiErrorResponse = {
  httpStatusCode: 401,
  errors: [ { error: ANY_MESSAGE_ERROR }]
};

export const MOCK_GET_COMPANY_OFFICERS_NOT_FOUND_RESPONSE: ApiErrorResponse = {
  httpStatusCode: 404,
  errors: [ { error: ANY_MESSAGE_ERROR }]
};

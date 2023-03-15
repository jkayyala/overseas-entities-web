import { ApiErrorResponse, ApiResponse } from "@companieshouse/api-sdk-node/dist/services/resource";
import { CompanyPersonsWithSignificantControlResource } from "@companieshouse/api-sdk-node/dist/services/company-psc/types";
import { ANY_MESSAGE_ERROR } from "./text.mock";

export const MOCK_GET_COMPANY_PSC_RESOURCE = {
  "active_count": '1',
  "ceased_count": '',
  "items": [
    {
      "natures_of_control": [
        "ownership-of-shares-75-to-100-percent",
        "voting-rights-75-to-100-percent-as-trust"
      ],
      "kind": "individual-person-with-significant-control",
      "name_elements": {
        "middleName": "Notreal",
        "forename": "Random",
        "title": "Mr",
        "surname": "Person"
      },
      "name": "Mr Random Notreal Person",
      "notified_on": "2022-04-06",
      "nationality": "British",
      "address": {
        "postal_code": "CF14 3UZ",
        "premises": "Companies House",
        "locality": "Limavady",
        "country": "Wales",
        "address_line_1": "Crown Way"
      },
      "country_of_residence": "Wales",
      "date_of_birth": {
        "month": '8',
        "year": '1983'
      },
      "links": {
        "self": "/company/OE111129/persons-with-significant-control/individual/RandomeaP1EB70SSD9SLmiK5Y"
      },
      "etag": "8cb9d4c9ba82059ff01ed123405bc41c1bc4db40"
    }
  ],
  "items_per_page": '25',
  "links": {
    "self": "/company/OE111129/persons-with-significant-control"
  },
  "start_index": '0',
  "total_results": ''
};

export const MOCK_GET_COMPANY_PSC_RESPONSE: ApiResponse<CompanyPersonsWithSignificantControlResource> = {
  httpStatusCode: 200,
  resource: MOCK_GET_COMPANY_PSC_RESOURCE
};

export const MOCK_GET_COMPANY_PSC_UNAUTHORISED_RESPONSE: ApiErrorResponse = {
  httpStatusCode: 401,
  errors: [ { error: ANY_MESSAGE_ERROR }]
};

export const MOCK_GET_COMPANY_PSC_NOT_FOUND_RESPONSE: ApiErrorResponse = {
  httpStatusCode: 404,
  errors: [ { error: ANY_MESSAGE_ERROR }]
};
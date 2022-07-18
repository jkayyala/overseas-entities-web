import { OverseasEntityDueDiligence } from "../../src/model/overseas.entity.due.diligence.model";
import {
  ADDRESS,
  IDENTITY_ADDRESS_REQ_BODY_EMPTY_MOCK,
  IDENTITY_ADDRESS_REQ_BODY_MAX_LENGTH_MOCK,
  IDENTITY_ADDRESS_REQ_BODY_MOCK,
} from "./fields/address.mock";
import { DATE, EMPTY_DATE, IDENTITY_DATE_REQ_BODY_MOCK } from "./fields/date.mock";

const TEN_CHARACTERS_LENGTH = "LKJHG.asdf";
const FIFTY_CHARACTERS_LENGTH = "ABCDEabcde0123456789QWERTYUIOPqwertyuiopZXCVBzxcvb";

const MAX_256 = FIFTY_CHARACTERS_LENGTH.repeat(5) + TEN_CHARACTERS_LENGTH;

export const OVERSEAS_ENTITY_DUE_DILIGENCE_OBJECT_MOCK: OverseasEntityDueDiligence = {
  identity_date: DATE,
  name: "Some name",
  identity_address: ADDRESS,
  email: "email@email.ch",
  supervisory_name: "Some supervisory name",
  aml_number: "Any AML number 123",
  partner_name: "Some partner name"
};

export const OVERSEAS_ENTITY_DUE_DILIGENCE_REQ_BODY_OBJECT_MOCK = {
  ...OVERSEAS_ENTITY_DUE_DILIGENCE_OBJECT_MOCK,
  ...IDENTITY_ADDRESS_REQ_BODY_MOCK,
  ...IDENTITY_DATE_REQ_BODY_MOCK
};

const OVERSEAS_ENTITY_DUE_DILIGENCE_EMPTY_OBJECT_MOCK: OverseasEntityDueDiligence = {
  identity_date: EMPTY_DATE,
  name: "",
  identity_address: {},
  email: "",
  supervisory_name: "",
  aml_number: "",
  partner_name: ""
};

const OVERSEAS_ENTITY_DUE_DILIGENCE_MAX_LENGTH_FIELDS_MOCK: OverseasEntityDueDiligence = {
  identity_date: DATE,
  name: MAX_256,
  identity_address: {},
  email: MAX_256,
  supervisory_name: MAX_256,
  aml_number: MAX_256,
  partner_name: MAX_256
};

export const OVERSEAS_ENTITY_DUE_DILIGENCE_REQ_BODY_EMPTY_OBJECT_MOCK = {
  ...OVERSEAS_ENTITY_DUE_DILIGENCE_EMPTY_OBJECT_MOCK,
  ...IDENTITY_ADDRESS_REQ_BODY_EMPTY_MOCK,
};

export const OVERSEAS_ENTITY_DUE_DILIGENCE_REQ_BODY_MAX_LENGTH_FIELDS_MOCK = {
  ...OVERSEAS_ENTITY_DUE_DILIGENCE_MAX_LENGTH_FIELDS_MOCK,
  ...IDENTITY_ADDRESS_REQ_BODY_MAX_LENGTH_MOCK,
};

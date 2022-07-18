const FIFTY_CHARACTERS_LENGTH = "ABCDEabcde0123456789QWERTYUIOPqwertyuiopZXCVBzxcvb";

const NO_MAX = "ANY";
const MAX_50 = FIFTY_CHARACTERS_LENGTH;
const MAX_200 = FIFTY_CHARACTERS_LENGTH.repeat(4);

export const ADDRESS = {
  property_name_number: "1",
  line_1: "addressLine1",
  line_2: "addressLine2",
  town: "town",
  county: "county",
  country: "country",
  postcode: "BY 2"
};

export const IDENTITY_ADDRESS_REQ_BODY_MOCK = {
  identity_address_property_name_number: "1",
  identity_address_line_1: "addressLine1",
  identity_address_line_2: "addressLine2",
  identity_address_town: "town",
  identity_address_county: "county",
  identity_address_country: "country",
  identity_address_postcode: "BY 2"
};

export const IDENTITY_ADDRESS_REQ_BODY_EMPTY_MOCK = {
  identity_address_property_name_number: "",
  identity_address_line_1: "",
  identity_address_line_2: "",
  identity_address_town: "",
  identity_address_county: "",
  identity_address_country: "",
  identity_address_postcode: ""
};

export const IDENTITY_ADDRESS_REQ_BODY_MAX_LENGTH_MOCK = {
  identity_address_property_name_number: MAX_200 + "1",
  identity_address_line_1: MAX_50 + "1",
  identity_address_line_2: MAX_50 + "1",
  identity_address_town: MAX_50 + "1",
  identity_address_county: MAX_50 + "1",
  identity_address_country: NO_MAX,
  identity_address_postcode: MAX_50 + "1"
};

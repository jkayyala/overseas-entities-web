import { Address, InputDate, yesNoResponse } from "./data.types.model";

export const ManagingOfficerCorporateKey: string = "managing_officers_corporate";
export const ManagingOfficerCorporateKeys: string[] = [
  "id",
  "name",
  "principal_address",
  "service_address",
  "is_service_address_same_as_principal_address",
  "legal_form",
  "law_governed",
  "is_on_register_in_country_formed_in",
  "public_register_name",
  "registration_number",
  "role_and_responsibilities",
  "contact_full_name",
  "contact_email",
  "start_date",
  "resigned_on"
];

export interface ManagingOfficerCorporate {
  id: string;
  ch_reference?: string;
  name?: string;
  principal_address?: Address;
  is_service_address_same_as_principal_address?: yesNoResponse;
  service_address?: Address;
  legal_form?: string;
  law_governed?: string;
  is_on_register_in_country_formed_in?: yesNoResponse;
  public_register_name?: string;
  registration_number?: string;
  role_and_responsibilities?: string;
  contact_full_name?: string;
  contact_email?: string;
  start_date?: InputDate;
  resigned_on?: InputDate;
}

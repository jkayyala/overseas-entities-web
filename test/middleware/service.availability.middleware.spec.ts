jest.mock("ioredis");
jest.mock("../../src/utils/feature.flag" );

import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import request from "supertest";

import app from "../../src/app";
import { RESUME, STARTING_NEW_URL } from '../../src/config';
import { isActiveFeature } from "../../src/utils/feature.flag";
import { RESUME_SUBMISSION_URL } from '../__mocks__/session.mock';
import { FOUND_REDIRECT_TO } from '../__mocks__/text.mock';

const mockIsActiveFeature = isActiveFeature as jest.Mock;

describe("service availability middleware tests", () => {

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should return service offline page", async () => {
    mockIsActiveFeature.mockReturnValueOnce(true);
    const response = await request(app).get("/register-an-overseas-entity");

    expect(response.text).toContain("Service offline - Register an overseas entity");
  });

  test("should not return service offline page", async () => {
    mockIsActiveFeature.mockReturnValueOnce(false);
    const response = await request(app).get("/register-an-overseas-entity");

    expect(response.text).not.toContain("Service offline - Register an overseas entity");
  });

  test("update disabled should return service offline page", async () => {
    mockIsActiveFeature.mockReturnValueOnce(false).mockReturnValueOnce(false);
    const response = await request(app).get("/update-an-overseas-entity");

    expect(response.text).toContain("Service offline - Register an overseas entity");
  });

  test("update enabled should not return service offline page", async () => {
    mockIsActiveFeature.mockReturnValueOnce(false).mockReturnValueOnce(true);
    const response = await request(app).get("/update-an-overseas-entity");

    expect(response.text).not.toContain("Service offline - Register an overseas entity");
  });

  test(`should return service offline page when req.path is equal ${STARTING_NEW_URL} and save and resume flag disabled `, async () => {
    mockIsActiveFeature
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    const response = await request(app).get(STARTING_NEW_URL);

    expect(response.text).toContain("Service offline - Register an overseas entity");
  });

  test(`should redirect to signin page after next middleware (authentication) when req.path is equal ${STARTING_NEW_URL} and save and resume flag enabled `, async () => {
    mockIsActiveFeature
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const response = await request(app).get(STARTING_NEW_URL);

    expect(response.status).toEqual(302);
    expect(response.text).toEqual(`${FOUND_REDIRECT_TO} /signin?return_to=${STARTING_NEW_URL}`);
    expect(response.text).not.toContain("Service offline - Register an overseas entity");
  });

  test(`should return service offline page when req.path ends with '/${RESUME}' and save and resume flag disabled `, async () => {
    mockIsActiveFeature
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);
    const response = await request(app).get(RESUME_SUBMISSION_URL);

    expect(response.text).toContain("Service offline - Register an overseas entity");
  });

  test(`should redirect to signin page after next middleware (authentication) when req.path ends with '/${RESUME}' and save and resume flag enabled `, async () => {
    mockIsActiveFeature
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(true);
    const response = await request(app).get(RESUME_SUBMISSION_URL);

    expect(response.status).toEqual(302);
    expect(response.text).toEqual(`${FOUND_REDIRECT_TO} /signin?return_to=${RESUME_SUBMISSION_URL}`);
    expect(response.text).not.toContain("Service offline - Register an overseas entity");
  });
});

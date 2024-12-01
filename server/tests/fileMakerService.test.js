import { describe, it, expect, vi } from 'vitest'
import { FileMakerAPI } from '../services/FileMakerAPI";
import { describe, it, expect, vi } from "vitest";

describe("FileMakerAPI", () => {
  const config = {
    auServername: "example.com",
    auDatabase: "testDB",
  };
  const mockFetch = vi.fn();

  it("should fetch Juportal data", async () => {
    const token = "test-token";

    const mockResponse = {
      dataInfo: {
        database: "Arbitrage",
        layout: "popup_XML_FOD_Justitie_Arrest",
        table: "Arresten",
        totalRecordCount: 5481,
        foundCount: 5481,
        returnedCount: 1,
      },
      data: [
        {
          fieldData: {
            Arrest_xml: "",
            MaxArrestDateMinus10_cu: "01/13/2022",
            Update_xml_ECLI: null,
          },
          portalData: {},
          recordId: "7126",
          modId: "255",
        },
      ],
      messages: [{ code: "0", message: "OK" }],
    };

    mockFetch.mockResolvedValueOnce(mockResponse);
    const service = new FileMakerAPI(config, mockFetch);
    const result = await service.getArrestDateMinus10(token);

    expect(result).toHaveProperty("dataInfo");
    expect(result.data[0].fieldData).toHaveProperty("MaxArrestDateMinus10_cu");
    expect(result.messages).toEqual([{ code: "0", message: "OK" }]);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://${config.auServername}/fmi/data/v1/databases/${config.auDatabase}/layouts/popup_XML_FOD_Justitie_Arrest/records?_offset=1&_limit=1`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    expect(result).toEqual(mockResponse);
  });

  it("findPublicaties should return correctly structured data and make proper API call", async () => {
    const mockResponse = {
      expires: "09:51:15",
      totalRecordCount: 21,
      foundCount: 21,
      returnedCount: 21,
      jaarverslagen: [
        {
          filename: "jvra-2023.pdf",
          _k1_Jaarverslag_id: 21,
          title_n: "Jaarverslag 2023",
          title_f: "Rapport annuel 2023",
          offline: "",
        },
        {
          filename: "jvra-2022.pdf",
          _k1_Jaarverslag_id: 20,
          title_n: "Jaarverslag 2022",
          title_f: "Rapport annuel 2022",
          offline: "",
        },
      ],
    };

    mockFetch.mockResolvedValue(mockResponse);
    const FileMakerAPI = new FileMakerAPI(config, mockFetch);
    const response = await FileMakerAPI.getPublicaties_Jaarverslagen(
      "testToken"
    );

    expect(response).toHaveProperty("foundCount");
    expect(response).toMatchObject({
      expires: expect.any(String),
      totalRecordCount: expect.any(Number),
      foundCount: expect.any(Number),
      returnedCount: expect.any(Number),
      jaarverslagen: expect.arrayContaining([
        {
          filename: expect.any(String),
          _k1_Jaarverslag_id: expect.any(Number),
          title_n: expect.any(String),
          title_f: expect.any(String),
          offline: expect.any(String),
        },
      ]),
    });
    expect(response.jaarverslagen).toBeInstanceOf(Array);
    expect(response.jaarverslagen.length).toBeGreaterThan(0);

    // Test that fetch was called with correct parameters ?
  });
});

// http://0.0.0.0:3001/api/getArrestDateMinus10

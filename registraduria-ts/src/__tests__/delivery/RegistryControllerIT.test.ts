import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../../app";

describe("RegistryController (IT – HTTP)", () => {
  const app = createApp();

  it("shouldRegisterValidPerson", async () => {
    const res = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({ name: "Ana", id: 100, age: 30, gender: "FEMALE", alive: true });

    expect(res.status).toBe(200);
    expect(res.text).toBe("VALID");
  });

  it("shouldReturnUnderageForMinor", async () => {
    const res = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({ name: "Menor", id: 200, age: 16, gender: "MALE", alive: true });

    expect(res.status).toBe(200);
    expect(res.text).toBe("UNDERAGE");
  });

  it("shouldReturnDeadForDeceasedPerson", async () => {
    const res = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({
        name: "Difunto",
        id: 300,
        age: 40,
        gender: "MALE",
        alive: false,
      });

    expect(res.status).toBe(200);
    expect(res.text).toBe("DEAD");
  });

  it("shouldReturnDuplicatedForSameId", async () => {
    const app2 = createApp();
    await request(app2)
      .post("/register")
      .send({
        name: "Primero",
        id: 400,
        age: 25,
        gender: "FEMALE",
        alive: true,
      });

    const res = await request(app2)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({
        name: "Segundo",
        id: 400,
        age: 25,
        gender: "FEMALE",
        alive: true,
      });

    expect(res.status).toBe(200);
    expect(res.text).toBe("DUPLICATED");
  });

  it("shouldReturnInvalidForZeroId", async () => {
    const res = await request(app)
      .post("/register")
      .set("Content-Type", "application/json")
      .send({ name: "Invalid", id: 0, age: 30, gender: "MALE", alive: true });

    expect(res.status).toBe(200);
    expect(res.text).toBe("INVALID");
  });
});

describe("VoterController (IT – HTTP)", () => {
  const app = createApp();

  it("shouldRegisterValidVoter", async () => {
    const res = await request(app)
      .post("/api/v1/voters/register")
      .set("Content-Type", "application/json")
      .send({
        documentId: "7744287142",
        fullName: "Camilo Rodríguez",
        age: 21,
        gender: "M",
        cityCode: "13001",
        address: "Calle 63 #29-9",
        phone: "3768040250",
        email: "camilo@mail.com",
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("registrationId", "7744287142");
    expect(res.body.status).toBe("REGISTERED");
  });

  it("shouldReturnAlreadyRegisteredForDuplicate", async () => {
    const app2 = createApp();
    const payload = {
      documentId: "9999000001",
      fullName: "Test User",
      age: 30,
      gender: "F",
      cityCode: "11001",
      address: "Calle 1",
      phone: "3000000000",
      email: "test@mail.com",
    };

    await request(app2).post("/api/v1/voters/register").send(payload);
    const res = await request(app2)
      .post("/api/v1/voters/register")
      .set("Content-Type", "application/json")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ALREADY_REGISTERED");
    expect(res.body).toHaveProperty("registrationId");
  });

  it("shouldReturn422ForUnderage", async () => {
    const res = await request(app)
      .post("/api/v1/voters/register")
      .set("Content-Type", "application/json")
      .send({
        documentId: "0000000001",
        fullName: "Niño Test",
        age: 15,
        gender: "M",
        cityCode: "11001",
        address: "Calle Test",
        phone: "3000000001",
        email: "nino@mail.com",
      });

    expect(res.status).toBe(422);
    expect(res.body.error).toBe("UNDERAGE");
  });
});

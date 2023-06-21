import { PrismaClient, Prisma } from "@prisma/client";
import request from "supertest";
import app from "../../app";

async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}

describe("POST /auth", () => {
    const user = {
      name: "John",
      email: "john@example.com",
      password: "insecure",
    };
  
    beforeAll(async () => {
      await cleanupDatabase();
    });
  
    afterAll(async () => {
      await cleanupDatabase();
    });

    it("with access token being returned", async () => {
      await request(app)
        .post("/users")  
        .send(user)
        .set("Accept", "application/json");
  
      const response = await request(app)
        .post("/auth")
        .send(user)
        .set("Accept", "application/json");
      expect(response.statusCode).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

  it("with wrong email", async() =>{
    const user = {
        name: "John",
        email: "john@example.com",
        password: "insecure",
    }
    await request(app)
    .post("/users")
    .send(user)
    .set("Accept", "application/json")

    const testuser = {
        email: "jon@example.com",
        password: "insecure" 
    }
    const response = await request(app)
    .post("/auth")
    .send(testuser)
    .set("Accept", "application/json")

    expect(response.status).toBe(401)
    expect(response.body.accessToken).toBeFalsy()
  })

  it("with wrong password", async() =>{
    const user = {
        name: "John",
        email: "john@example.com",
        password: "insecure",
    }
    await request(app)
    .post("/users")
    .send(user)
    .set("Accept", "application/json")

    const testuser = {
        email: "john@example.com",
        password: "insecures" 
    }
    const response = await request(app)
    .post("/auth")
    .send(testuser)
    .set("Accept", "application/json")

    expect(response.status).toBe(401)
    expect(response.body.accessToken).toBeFalsy()
  })
})
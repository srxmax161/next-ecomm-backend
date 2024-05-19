// Why test? Detect and prevent bugs in early stages. More code means high chance of bugs and issues to mess up code. 
// Spend more time to debug. If tests pass we are reassured that the code works as expected
// This is test is to ensure refactoring is done correctly. 
// Done by giving data to the endpoint and hard code the outcome while ensuring they match
// Make sure to test for happy path (successful outcomes) and unhappy path (failed outcomes)
import { PrismaClient, Prisma } from "@prisma/client";
import request from "supertest";
import app from "../../app";

// Creating a function to clean test database
async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name); //Retrieve all schema models

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany()) //Delete all records
  );
}

// Declaring which endpoint we are using
describe("POST /users", () => {
  const user = {
    name: "John",
    email: "john@example.com",
    password: "insecure",
  };

  // Clearing test database before testing
  beforeAll(async () => {
    await cleanupDatabase();
  });

  // Clearing test database after testing
  afterAll(async () => {
    await cleanupDatabase();
  });

  // Running test case
  it("with valid data should return 200", async () => { //stating test name
    const response = await request(app) //make http request
      .post("/users") 
      .send(user) //send object as payload
      .set('Accept', 'application/json') //expecting json respond
    
    // Expects response to what we hard code
    expect(response.statusCode).toBe(200); //expect status to be 200
    expect(response.body.id).toBeTruthy; //expect id to be not false/not undefinded/not null
    expect(response.body.name).toBe(user.name); // to be name
    expect(response.body.email).toBe(user.email); // to be email
    expect(response.body.password).toBe(undefined); //we don't want password to be returned, so we set as undefined
  });

  // So test by send data to endpoint, returns with the outcome, 
  // hard code the expected outcome and make sure the outcome matches the expected

  // it("with same email should fail", async () => {
  //   const response = await request(app)
  //     .post("/users")
  //     .send(user)
  //     .set("Accept", "application/json");
  //   expect(response.statusCode).toBe(500);
  //   expect(response.body.error).toBeTruthy;
  //   expect(response.body.error.email).toBe("already taken");
  // });

  // it("with invalid password should fail", async () => {
  //   user.email = "unique@example.com";
  //   user.password = "short";
  //   const response = await request(app)
  //     .post("/users")
  //     .send(user)
  //     .set("Accept", "application/json");
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body.error).toBeTruthy;
  //   expect(response.body.error.password).toBe(
  //     "should be at least 8 characters"
  //   );

  // });

  // it("with invalid email should fail", async () => {
  //   user.email = "_com_";
  //   const response = await request(app)
  //     .post("/users")
  //     .send(user)
  //     .set("Accept", "application/json");
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body.error).toBeTruthy;
  //   expect(response.body.error.email).toBe("is invalid");
  // });

  // it("with name is blank", async () => {
  //   user.name = "";
  //   const response = await request(app)
  //     .post("/users")
  //     .send(user)
  //     .set("Accept", "application/json");
  //   expect(response.statusCode).toBe(400);
  //   expect(response.body.error).toBeTruthy;
  //   expect(response.body.error.name).toBe("cannot be blank");
  // });
});

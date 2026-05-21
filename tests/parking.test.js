process.env.NODE_ENV = "test";

const request = require("supertest");

const mongoose = require("mongoose");

const app = require("../server");

describe("SpaceSync API Tests", () => {

    let token;

    // TEST 1 → get parking slots
    test("GET /parking/slots", async () => {

        const res = await request(app)
            .get("/parking/slots");

        expect(res.statusCode).toBe(200);

    });

    // TEST 2 → register user
    test("POST /auth/register", async () => {

        const res = await request(app)

            .post("/auth/register")

            .send({
                username: "testuser",
                password: "123456"
            });

        // allow both:
        // 201 → newly created
        // 400 → already exists

        expect(
            [201, 400]
                .includes(res.statusCode)
        ).toBe(true);

    });

    // TEST 3 → login user
    test("POST /auth/login", async () => {

        const res = await request(app)

            .post("/auth/login")

            .send({
                username: "testuser",
                password: "123456"
            });

        expect(res.statusCode).toBe(200);

        token = res.body.token;

    });

    // TEST 4 → protected park route
    test("POST /parking/park", async () => {

        const res = await request(app)

            .post("/parking/park?vehicle=TEST123")

            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(res.statusCode).toBe(200);

    });

    // TEST 5 → protected exit route
    test("DELETE /parking/exit/:vehicle", async () => {

        const res = await request(app)

            .delete("/parking/exit/TEST123")

            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(res.statusCode).toBe(200);

    });

    // TEST 6 → SSR page
    test("GET /ssr", async () => {

        const res = await request(app)
            .get("/ssr");

        expect(res.statusCode).toBe(200);

    });

    // TEST 7 → session protected route
    test("GET /parking/slots-session", async () => {

        const res = await request(app)
            .get("/parking/slots-session");

        expect(res.statusCode).toBe(401);

    });

});

// close DB connection
afterAll(async () => {

    await mongoose.connection.close();

});
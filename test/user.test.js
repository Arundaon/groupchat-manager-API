import supertest from "supertest";
import { web } from "../server/application/web.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-utils.js";
import bcrypt from "bcrypt";

describe("POST /api/users", () => {
    afterEach(async () => {
        await removeTestUser();
    });

    it("should able to register user", async () => {
        const result = await supertest(web).post("/api/users").send({
            username: "test",
            password: "test",
        });
        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
    });

    it("should reject invalid input", async () => {
        const result = await supertest(web).post("/api/users").send({
            username: "test",
            password: "",
        });
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject exist username", async () => {
        await supertest(web).post("/api/users").send({
            username: "test",
            password: "test",
        });

        const result = await supertest(web).post("/api/users").send({
            username: "test",
            password: "test",
        });

        expect(result.status).toBe(409);
        expect(result.body.errors).toBeDefined();
    });
});

describe("POST /api/users/login", () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
    });

    it("should able to login user", async () => {
        const result = await supertest(web).post("/api/users/login").send({
            username: "test",
            password: "test",
        });
        expect(result.status).toBe(200);
        expect(result.body.data.token).toBeDefined();
    });
    it("should reject invalid input", async () => {
        const result = await supertest(web).post("/api/users/login").send({
            username: "test",
            password: "",
        });
        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
    it("should reject wrong username", async () => {
        const result = await supertest(web).post("/api/users/login").send({
            username: "testwrong",
            password: "test",
        });
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
    it("should reject wrong password", async () => {
        const result = await supertest(web).post("/api/users/login").send({
            username: "test",
            password: "testwrong",
        });
        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});
describe("GET /api/users/:username", () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
    });

    it("should be able get a user", async () => {
        const result = await supertest(web)
            .get("/api/users/test")
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test");
        expect(result.body.data.bio).toBe("test bio");
    });
    it("should reject if token invalid", async () => {
        const result = await supertest(web)
            .get("/api/users/test")
            .set("Authorization", "wrongtoken");

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
    it("should reject invalid username", async () => {
        const result = await supertest(web)
            .get("/api/users/t")
            .set("Authorization", "test");

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
    it("should reject nonexistent username", async () => {
        const result = await supertest(web)
            .get("/api/users/testtest")
            .set("Authorization", "test");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

describe("DELETE /api/users/logout", () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
    });

    it("should be able to logout current user", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "test");

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");

        const testUser = await getTestUser();
        expect(testUser.token).toBeNull();
    });
    it("should reject if token invalid", async () => {
        const result = await supertest(web)
            .delete("/api/users/logout")
            .set("Authorization", "wrongtoken");

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe("UPDATE /api/users/current", () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        await removeTestUser();
    });
    it("should able to update user password", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                password: "newpassword",
            });

        expect(result.status).toBe(200);

        const updatedUser = await getTestUser();
        expect(bcrypt.compareSync("newpassword", updatedUser.password)).toBe(
            true
        );
    });
    it("should able to update user bio", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "test")
            .send({
                bio: "newbio",
            });

        expect(result.status).toBe(200);
        const updatedUser = await getTestUser();
        expect(updatedUser.bio).toBe("newbio");
    });
    it("should reject if token invalid", async () => {
        const result = await supertest(web)
            .patch("/api/users/current")
            .set("Authorization", "testwrong")
            .send({
                bio: "newbio",
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

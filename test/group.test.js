import supertest from "supertest";
import { web } from "../server/application/web.js";
import {
    createTestGroups,
    createTestUser,
    createTestUsers,
    getTestGroups,
    removeTestGroup,
    removeTestGroups,
    removeTestUser,
    removeTestUsers,
} from "./test-utils.js";

describe("POST /api/groups/", () => {
    beforeEach(async () => {
        await createTestUser();
    });
    afterEach(async () => {
        // const group = await getTestGroup();
        await removeTestUser();
    });

    it("should allow user to create new group", async () => {
        const result = await supertest(web)
            .post("/api/groups")
            .set("Authorization", "test")
            .send({
                name: "testgroup",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("testgroup");
        await removeTestGroup();
        // const participant = await getAdmin(result.body.data.id);
        // expect(participant.role).toBe("ADMIN");
    });

    it("should reject invalid token", async () => {
        const result = await supertest(web)
            .post("/api/groups")
            .set("Authorization", "testwrong")
            .send({
                name: "testgroup",
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject invalid data", async () => {
        const result = await supertest(web)
            .post("/api/groups")
            .set("Authorization", "test")
            .send({
                name: "",
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

// Here, the test cases will include 3 users and 2 groups
// group 1 : user1 (admin), user3 (member)
// group 2 : user2 (admin), user3 (member)

describe("POST /api/groups/:groupId", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
    });
    afterEach(async () => {
        await removeTestGroups();
        await removeTestUsers();
    });

    it("should be able to get group information if a member", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .get("/api/groups/" + groups[0].id)
            .set("Authorization", "test1");

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("testgroup1");
        expect(result.body.data.description).toBe("testdescription");
    });

    it("should reject invalid token", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .get("/api/groups/" + groups[0].id)
            .set("Authorization", "testwrong");

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if user not a member of the group", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .get("/api/groups/" + groups[1].id)
            .set("Authorization", "test1");

        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });
});

describe("PUT /api/groups/:groupId", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
    });
    afterEach(async () => {
        await removeTestGroups();
        await removeTestUsers();
    });

    it("should allow admin to update a group informations", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .put("/api/groups/" + groups[0].id)
            .set("Authorization", "test1")
            .send({
                name: "new_group_name",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.name).toBe("new_group_name");
    });
    it("should deny member to update a group informations", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .put("/api/groups/" + groups[0].id)
            .set("Authorization", "test3")
            .send({
                name: "new_group_name",
            });

        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });
    it("should deny non group members", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .put("/api/groups/" + groups[0].id)
            .set("Authorization", "test2")
            .send({
                name: "new_group_name",
            });

        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject if invalid token", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .get("/api/groups/" + groups[0].id)
            .set("Authorization", "testwrong")
            .send({
                name: "new_group_name",
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/groups", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
    });
    afterEach(async () => {
        await removeTestGroups();
        await removeTestUsers();
    });

    it("should allow user to list groups that they joined in", async () => {
        const result = await supertest(web)
            .get("/api/groups")
            .set("Authorization", "test3");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(2);
    });

    it("should reject if token invalid", async () => {
        const result = await supertest(web)
            .get("/api/groups")
            .set("Authorization", "testwrong");

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});

describe("POST /api/groups/:groupId/members", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
    });
    afterEach(async () => {
        await removeTestGroups();
        await removeTestUsers();
    });

    it("should allow an admin to add a new member", async () => {
        const groups = await getTestGroups();

        const result = await supertest(web)
            .post("/api/groups/" + groups[0].id + "/members")
            .set("Authorization", "test1")
            .send({
                username: "test2",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("test2");
        expect(result.body.data.role).toBe("MEMBER");
    });

    it("should reject a member to add a new member", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .post("/api/groups/" + groups[0].id + "/members")
            .set("Authorization", "test3")
            .send({
                username: "test2",
            });

        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject already joined member", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .post("/api/groups/" + groups[0].id + "/members")
            .set("Authorization", "test1")
            .send({
                username: "test3",
            });

        expect(result.status).toBe(409);
        expect(result.body.errors).toBeDefined();
    });
});

describe("DELETE /api/groups/:groupId/members/:membersId", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
    });
    afterEach(async () => {
        await removeTestGroups();
        await removeTestUsers();
    });

    it("should allow an admin to remove a member", async () => {
        const groups = await getTestGroups();

        const result = await supertest(web)
            .delete("/api/groups/" + groups[0].id + "/members/test3")
            .set("Authorization", "test1");

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");
    });

    it("should reject a member to remove another member", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .delete("/api/groups/" + groups[0].id + "/members/test1")
            .set("Authorization", "test3");

        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });

    it("should reject nonexistent member", async () => {
        const groups = await getTestGroups();
        const result = await supertest(web)
            .delete("/api/groups/" + groups[0].id + "/members/usernotexist")
            .set("Authorization", "test1");

        expect(result.status).toBe(404);
        expect(result.body.errors).toBeDefined();
    });
});

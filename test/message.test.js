import supertest from "supertest";
import {
    createTestUsers,
    createTestGroups,
    removeTestUsers,
    removeTestGroups,
    getTestGroups,
    removeTestMessage,
    createTestMessages,
    removeTestMessages,
    getTestMessages,
} from "./test-utils.js";
import { web } from "../server/application/web.js";

describe("POST /api/groups/:groupId/messages", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
    });
    afterEach(async () => {
        await removeTestMessage();
        await removeTestGroups();
        await removeTestUsers();
    });
    it("should allow an admin  to send a message", async () => {
        const groups = await getTestGroups();

        const result = await supertest(web)
            .post("/api/groups/" + groups[0].id + "/messages")
            .set("Authorization", "test1")
            .send({
                body: "testmessage",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.body).toBe("testmessage");
    });
    it("should allow a member to send a message", async () => {
        const groups = await getTestGroups();

        const result = await supertest(web)
            .post("/api/groups/" + groups[0].id + "/messages")
            .set("Authorization", "test3")
            .send({
                body: "testmessage",
            });

        expect(result.status).toBe(200);
        expect(result.body.data.body).toBe("testmessage");
    });
    it("should reject non-member to send a message", async () => {
        const groups = await getTestGroups();

        const result = await supertest(web)
            .post("/api/groups/" + groups[0].id + "/messages")
            .set("Authorization", "test2")
            .send({
                body: "testmessage",
            });
        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });
});

describe("GET /api/groups/:groupId/messages", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
        await createTestMessages();
    });
    afterEach(async () => {
        await removeTestMessages();
        await removeTestGroups();
        await removeTestUsers();
    });

    it("should allow a user to list messages in a group", async () => {
        const groups = await getTestGroups();

        const result = await supertest(web)
            .get("/api/groups/" + groups[0].id + "/messages")
            .set("Authorization", "test1");

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(4);
    });

    it("should reject non-member to list messages", async () => {
        const groups = await getTestGroups();

        const result = await supertest(web)
            .get("/api/groups/" + groups[0].id + "/messages")
            .set("Authorization", "test2");

        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });
});

describe("DELETE /api/groups/:groupId/messages/:messageId", () => {
    beforeEach(async () => {
        await createTestUsers();
        await createTestGroups();
        await createTestMessages();
    });
    afterEach(async () => {
        await removeTestMessages();
        await removeTestGroups();
        await removeTestUsers();
    });

    it("should allow user to delete his own message", async () => {
        const groups = await getTestGroups();
        const messages = await getTestMessages();

        const result = await supertest(web)
            .delete(
                "/api/groups/" + groups[0].id + "/messages/" + messages[0].id
            )
            .set("Authorization", "test1");

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("OK");
    });
    it("should reject user to delete another user message", async () => {
        const groups = await getTestGroups();
        const messages = await getTestMessages();

        const result = await supertest(web)
            .delete(
                "/api/groups/" + groups[0].id + "/messages/" + messages[0].id
            )
            .set("Authorization", "test3");

        expect(result.status).toBe(403);
        expect(result.body.errors).toBeDefined();
    });
});

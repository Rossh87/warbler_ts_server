import { handleErrors, throwErr } from "./error";
import { CustomError } from "./types";
import request from "supertest";
import express from "express";

const app = express();

// Throw an error on any request
app.get("*", (req, res) => {
    throwErr("test error", 401);
});

app.use(handleErrors);

describe("Error handler", () => {
    it("sets res status to match err.status", (done) => {
        const response = request(app)
            .get("/")
            .expect(401, done);
    });

    it("responds with json of error", (done) => {
        const expected = JSON.stringify(new CustomError("test error", 401));

        request(app)
            .get("/")
            .end((err, res) => {
                expect(res.text).toEqual(expected);
                done();
            });
    });
});

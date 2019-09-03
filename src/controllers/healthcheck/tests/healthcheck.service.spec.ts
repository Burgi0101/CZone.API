import { HealthcheckService } from "../healthcheck.service";

describe("The HealthCheckService", () => {
    const healthCheckService = new HealthcheckService();

    describe("when checking the db connection", () => {
        it("should return a boolean", () => {
            expect(typeof healthCheckService.checkDbConnection()).toEqual("boolean");
        });
    });
});
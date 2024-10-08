"use strict";

/**
 * employee router
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

module.exports = createCoreRouter("api::employee.employee", {
  routes: [
    {
      method: "GET",
      path: "/employee/get-employee-by-user/:userId",
      handler: "employee.getEmployeeByUserId",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
});

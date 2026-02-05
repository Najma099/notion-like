"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const keystoreRepo_1 = require("./database/repository/keystoreRepo");
const index_1 = require("./database/index");
(0, index_1.connectDB)().then(() => {
    const keystore = (0, keystoreRepo_1.find)(1, "e802e1d023a3efbdd83108adfb258363dd50c0ccf9e8e732ceae4df99dd2562e2e7896ebd3b0b7f860e8ac1fb9175293ed78123cda8ccff14cb2feedaa48d226").then((data) => {
        console.log(data);
    });
});
//# sourceMappingURL=test.js.map
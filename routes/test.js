const express = require("express");
const testRouter = express.Router();
const testController = require("../controller/test/test");

testRouter.get("/", (req, res) => {
  res.send("test");
});

testRouter.get("/getAll", testController.getAllTest);
testRouter.get("/get-test-byId/:id", testController.getTestById);
testRouter.get("/bycategory/:id", testController.testListByCategory);
testRouter.get("/getAll-package", testController.getAllPackage);
testRouter.get("/getTestByHebbitId/:id", testController.getTestByHebbitId);
testRouter.get("/getTestByHealthRisk/:id",testController.getTestByHealthriskId);
// testRouter.get("/collection",testController.getcollection);
//testRouter.get("/parameter",testController.getconvertparameter);
testRouter.get("/get-featuredtest-by-Category/:id",testController.testListByfeaturedCategory);


module.exports = testRouter;

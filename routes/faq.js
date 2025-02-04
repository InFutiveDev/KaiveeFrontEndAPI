const express = require("express");
const faqRouter = express.Router();
const faqController = require("../controller/faq/faq");

faqRouter.get("/getAll",faqController.getAllFAQ);
faqRouter.get("/getBy-testID/:id",faqController.getFAQBytestId);
faqRouter.delete("/delete/:id",faqController.deleteFaq);

module.exports = faqRouter;
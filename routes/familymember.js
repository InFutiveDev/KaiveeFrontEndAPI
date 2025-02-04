const express = require("express");
const familyMemberRoute = express.Router();
const familyMemberController = require("../controller/familyMember/familyMember");


familyMemberRoute.get("/", (req, res) => {
  res.send("test");
});

familyMemberRoute.post("/add", familyMemberController.addMember);
familyMemberRoute.get("/get-member-byId", familyMemberController.getMemberById);
familyMemberRoute.put("/update/:id", familyMemberController.updateMember);
familyMemberRoute.delete("/delete/:id", familyMemberController.deleteMember);

module.exports = familyMemberRoute;

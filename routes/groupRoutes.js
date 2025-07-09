const express = require("express");
const {
  create,
  addMember,
  getGroups,
  groupDetail,
  updateGroups,
  deleteGroup,
  removeMember,
  changeRole,
  leaveGroup,
  joinGroup,
  sendMessage,
  getMessages,
} = require("../controllers/groupController");
const { authMiddleware } = require("../middleware/authMiddleware");
const router = express.Router();

// 1. Group Creation and Management Routes

router.post("/", authMiddleware,create);
router.get("/", getGroups);
router.get("/:groupId", groupDetail);
router.put("/:groupId", authMiddleware, updateGroups);
router.delete("/:groupId", authMiddleware, deleteGroup);

// 2. Member Management Routes

router.post("/:groupId/addMember", authMiddleware, addMember);
router.delete("/:groupId/removeMember", authMiddleware, removeMember);
router.patch("/:groupId/changeRole", authMiddleware, changeRole);
router.post("/:groupId/leave", authMiddleware, leaveGroup);
router.post("/:groupId/join", authMiddleware, joinGroup);


router.post("/:groupId/message", authMiddleware, sendMessage);
router.get("/:groupId/getMessage", authMiddleware, getMessages);


module.exports = router;

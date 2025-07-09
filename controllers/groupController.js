const { groupModel } = require("../models/group");

//  1. Group Creation and Management Routes

module.exports.create = async function (req, res) {
  const { name, description, userId } = req.body;
  const user = req.user.user._id
  try {
    const group = await groupModel.create({
      name,
      description,
      members: [{ userId : user, role: "admin" }],
    });
    res.status(201).json({ message: "Group created successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
};

module.exports.getGroups = async function (req, res) {
  const groups = await groupModel.find();
  res.status(200).json(groups);
};

module.exports.groupDetail = async function (req, res) {
  const { groupId } = req.params;
  const groupDetail = await groupModel
    .findById(groupId)
    .populate("members.userId");

  if (!groupDetail)
    return res.status(404).json({ message: "Group not found." });

  res.status(200).json({
    status: "Group fetched Successfully",
    data: groupDetail,
  });
};

module.exports.updateGroups = async function (req, res) {
  const { groupId } = req.params;
  const { name, description } = req.body;

  const group = await groupModel.findOneAndUpdate(
    { _id: groupId },
    { name, description },
    { new: true }
  );
  if (!group)
    return res.status(404).json({
      message: "Unable to Find Group",
    });

  res.status(200).json({
    status: "Success",
    message: "Successfully updated the group",
  });
};

module.exports.deleteGroup = async function (req, res) {
  const { groupId } = req.params;
  const deletedGroup = await groupModel.findOneAndDelete({ _id: groupId });

  res.status(200).json({
    status: "Success",
    message: "Group was successfully deleted",
  });
};


// 2. Member Management Routes

module.exports.addMember = async function (req, res) {
  const { groupId } = req.params;
  const { userId } = req.body;
  console.log(req.user);

  const group = await groupModel.findById(groupId);
  if (!group) return res.status(404).json({ message: "Group not found" });

  // Check if the request is made by an admin
  const isAdmin = group.members.find(
    (member) =>
      member.userId.toString() === req.user.user._id && member.role === "admin"
  );
  if (!isAdmin)
    return res.status(403).json({ message: "Only Admins can add members" });

  // Check if the user is already a member
  const isMember = group.members.find(
    (member) => member.userId.toString() === userId
  );
  if (isMember)
    return res.status(400).json({ message: "User is already a member" });

  // Add the new member
  group.members.push({ userId, role: "member" }); // New member role as "member"
  try {
    await group.save();
    res.status(200).json({ message: "Member added successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Error adding member", error });
  }
};

module.exports.removeMember = async function (req, res) {
  const { groupId } = req.params;
  const { userId } = req.body;

  const group = await groupModel.findById(groupId);
  if (!group)
    res.status(404).json({
      status: "Failed",
      message: "Group not found.",
    });

  // Check if the request is made by an admin
  const isAdmin = group.members.find(
    (member) =>
      member.userId.toString() === req.user.user._id && member.role === "admin"
  );
  if (!isAdmin)
    return res.status(403).json({ message: "Only Admins can remove members" });

  // Check if the user to be removed is part of the group
  const memberIndex = group.members.findIndex(
    (member) => member.userId.toString() === userId
  );
  if (memberIndex === -1) {
    return res.status(404).json({ message: "Member not found in the group" });
  }

  // Remove the member from the group
  group.members.splice(memberIndex, 1);
  await group.save();

  res.status(200).json({ message: "Member removed successfully", group });
};

module.exports.changeRole = async function(req,res){
  const { groupId } = req.params;
  const { userId, role } = req.body;

  const group = await groupModel.findById(groupId);
  if (!group)
    res.status(404).json({
      status: "Failed",
      message: "Group not found.",
    });

  // Check if the request is made by an admin
  const isAdmin = group.members.find(
    (member) =>
      member.userId.toString() === req.user.user._id && member.role === "admin"
  );
  if (!isAdmin)
    return res.status(403).json({ message: "Only Admins can change members roles" });

  // Find the member and change their role
  const memberIndex = group.members.findIndex(
    (member) => member.userId.toString() === userId
  );
  if (memberIndex === -1) {
    return res.status(404).json({ message: "Member not found in the group" });
  }
  group.members[memberIndex].role = role;
  await group.save();

  res.status(200).json({ message: "Member role changed successfully", group });
}


module.exports.leaveGroup = async function(req,res){
  let {groupId} = req.params;
  const userId = req.user.user._id;// Auth Id

  try {
    
  let group = await groupModel.findById(groupId);
  if (!group) {
    return res.status(404).json({ message: "Group not found" });
  }

  const memberIndex = group.members.findIndex(
    (member) => member.userId.toString() === userId.toString()
  )
  if (memberIndex === -1) {
    return res.status(400).json({ message: "You are not a member of this group" });
  };

  // Remove the member from the group
  group.members.splice(memberIndex, 1);

  await group.save();
  res.status(200).json({ message: "You have left the group successfully" });

  } catch (error) {
     console.error("Error leaving group:", error);
    res.status(500).json({ message: "Error leaving the group", error });
  }
};

module.exports.joinGroup = async function (req, res) {
  const { groupId } = req.params;
  const userId = req.user.user._id; // Authenticated user's ID

  try {
    // Find the group by ID
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if the user is already a member of the group
    const isMember = group.members.some(
      (member) => member.userId.toString() === userId.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: "You are already a member of this group" });
    }

    // Add the user to the group as a "member"
    group.members.push({ userId, role: "member" });

    // Save the group with the new member
    await group.save();

    res.status(200).json({ message: "You have successfully joined the group", group });
  } catch (error) {
    console.error("Error joining group:", error);
    res.status(500).json({ message: "Error joining the group", error });
  }
};

// Send a message to a group
module.exports.sendMessage = async function (req, res) {
  const { groupId } = req.params;
  const { content } = req.body;
  const userId = req.user.user._id;

  try {
    // Find the group by ID
    const group = await groupModel.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Create a message object
    const message = {
      sender: userId,
      content,
      timestamp: new Date(),
    };

    // Push the message into the group's messages array
    group.messages.push(message);
    await group.save();

    // Emit new message to the group
    req.io.to(groupId).emit("newMessage", message);

    res.status(201).json({ message: "Message sent successfully", data: message });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message", error });
  }
};

// Get all messages of a group
module.exports.getMessages = async function (req, res) {
  const { groupId } = req.params;

  try {
    // Find the group by ID
    const group = await groupModel.findById(groupId).populate("messages.sender", "username"); // Assuming user details are populated
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Return the messages array
    res.status(200).json({ messages: group.messages });
  } catch (error) {
    console.error("Error retrieving messages:", error);
    res.status(500).json({ message: "Error retrieving messages", error });
  }
};


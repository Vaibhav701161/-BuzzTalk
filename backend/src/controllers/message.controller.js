import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import  cloudinary  from "../lib/cloudinary.js";


export const getUsersForSidebar= async(req,res)=>{

 try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({_id: {$ne:loggedInUserId}}).select("-password");

    res.status(200).json
 } catch (error) {
    console.error("Error in getUsersForSidebar controller", error.message);
    res.status(500).json({message:"internal server error"});
 }

};

export const getMessages = async(req,res)=>{

  try {
    const {id:userToChatId} = req.params;
    const senderId = req.user._id;
    const messages = await Message.find({
      $or: [
        {senderId: senderId, receiverId: userToChatId},
        {senderId: userToChatId, receiverId: senderId},
      ],
    }).sort({createdAt: 1});

    res.status(200).json({messages});
  } catch (error) {
    console.error("Error in getMessages controller", error.message);
    res.status(500).json({message:"internal server error"});
    
  }

};

export const sendMessage = async(req,res)=>{
  try {
    const {id:receiverId} = req.params;
    const senderId = req.user._id;
    const {text, image} = req.body;
    
    let imageUrl;
    if(image){
      const uploadResponse =  await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
    }


    const newMessage = new Message({
      senderId,
      userToChatId:receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    res.status(201).json({newMessage});
  } catch (error) {
    console.error("Error in sendMessage controller", error.message);
    res.status(500).json({message:"internal server error"});
  }

}
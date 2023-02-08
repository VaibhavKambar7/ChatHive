import React, { useState,useEffect } from 'react'
import axios from 'axios'

const Chatpage = () => {

  const [chats,setChats] = useState([]);

  const fetchChats = async () => {

    const {data} = await axios.get('/api/chat')//bec if you remember in server.js we send chat json file to /api/chat
    setChats(data);

  }

    useEffect(() => {

      fetchChats();

      
    }, [])
    

  return (
    <div>{chats.map(chat => <div key={chat._id}>{chat.chatName}</div>)}</div>
  )
}

export default Chatpage
import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import { GiftedChat, InputToolbar, Composer, Send, Bubble } from 'react-native-gifted-chat';
import messageApi from '../api/messageApi';
import { MaterialIcons } from '@expo/vector-icons'; // Import the desired icon library
import userApi from '../api/userApi';
// import CustomMessage from './CustomMessage'; // Import the CustomMessage component

const SendMessageScreen = ({ route }) => {
  const { senderId, receiverId } = route.params;
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [sender, setSender] = useState(null)

  useEffect(() => {
    const loadMessageHistory = async () => {
      try {
        const receiverInfo = await userApi.getUserInfo(receiverId);
        const senderInfo = await userApi.getUserInfo(senderId)
        setReceiver(receiverInfo);
        setSender(senderInfo)
        const history = await messageApi.getThread(senderId, receiverId);
        const formattedHistory = history.map((msg) => ({
          _id: msg._id,
          text: msg.text,
          createdAt: new Date(msg.createdAt),
          user: {
            _id: msg.sender,
            name: receiverInfo.username,
            avatar: receiverInfo.profilePic
          },
          position: msg.sender === senderId ? 'right' : 'left',
        }));

        setMessages(formattedHistory.reverse());
      } catch (error) {
        console.error('Error loading message history:', error);
      }
    };

    loadMessageHistory();
  }, [senderId, receiverId]);

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    try {
      await messageApi.sendMessage({
        sender: senderId,
        receiver: receiverId,
        text: message.text,
      });

      // Ensure that the user object for the new message includes the 'avatar' property
      const updatedMessages = newMessages.map(msg => ({
        ...msg,
        user: {
          ...msg.user,
          // // avatar: sender.profilePic, // Assuming receiver.profilePic is the avatar URL
          // name: sender.username
        },
      }));

      setMessages(previousMessages => GiftedChat.append(previousMessages, updatedMessages));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [senderId, receiverId, receiver]);

  const renderBubble = (props) => {
    const { currentMessage, previousMessage } = props;
  
    // Check if the message position is 'left' (receiver's message)
    if (currentMessage.position === 'left') {
      // Check if the previous message is from the same user
      const isSameUser = previousMessage
        && previousMessage.user
        && previousMessage.user._id === currentMessage.user._id;
  
      // If it's the same user, don't render the avatar again
      if (isSameUser) {
        return <Bubble {...props} />;
      }
  
      return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Display the receiver's profile image */}
        
          <Bubble {...props} />
        </View>
      );
    }
  
    // For messages from the sender (on the right), only display the message bubble
    return <Bubble {...props} />;
  };
  

  const renderSend = (props) => (
    <Send {...props}>
      <View style={styles.sendButton}>
        <MaterialIcons name="send" size={24} color="white" />
      </View>
    </Send>
  );

  return (
    <View style={styles.container}>
      {receiver && (
        <View style={styles.receiverContainer}>
          <Image source={{ uri: receiver.profilePic }} style={styles.profilePic} />
          <Text>{receiver.username}</Text>
        </View>
      )}
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: senderId,
          // avatar: receiver.profilePic
        }}
        renderInputToolbar={(props) => (
          <InputToolbar
            {...props}
            containerStyle={{ backgroundColor: 'white' }}
          />
        )}
        renderComposer={(props) => (
          <Composer
            {...props}
            textInputStyle={{ color: 'black', backgroundColor: 'white' }}
            placeholder="Type a message..."
          />
        )}
        renderSend={renderSend}
        // Customize renderBubble to include the avatar inside the message bubble
        renderBubble={renderBubble}
        timeFormat='LT'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sendButton: {
    marginRight: 10,
    marginBottom: 5,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  receiverContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profilePic: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default SendMessageScreen;

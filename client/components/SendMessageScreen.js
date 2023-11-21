import React, { useState, useCallback, useEffect } from 'react';
import { GiftedChat, InputToolbar, Composer, Send, Bubble } from 'react-native-gifted-chat';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import messageApi from '../api/messageApi';

const SendMessageScreen = ({ route }) => {
  const { sender, receiver } = route.params;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessageHistory = async () => {
      try {
        const history = await messageApi.getMessageHistory(sender);
        const formattedHistory = history.map((msg) => {
          const userId = sender;
          const senderId = msg.sender;
          console.log('UserId: ', userId);
          console.log('SenderId: ', senderId);
        
          const isSender = senderId === userId;
        
          return {
            _id: msg._id,
            text: msg.text,
            createdAt: new Date(msg.createdAt),
            user: {
              _id: msg.sender,
              // name: msg.sender.username,
            },
            // Assigning the correct position based on the sender
            position: isSender ? 'right' : 'left',
          };
        });
        setMessages(formattedHistory);
      } catch (error) {
        console.error('Error loading message history:', error);
      }
    };

    loadMessageHistory();
  }, [sender]);

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    try {
      await messageApi.sendMessage({
        sender: message.user._id,
        receiver,
        text: message.text,
      });
     // Append the new message to the existing messages array
     setMessages((previousMessages) => previousMessages.concat(message));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [receiver]);

  const renderSend = (props) => (
    <Send {...props}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        {/* Customize the Send button if needed */}
      </View>
    </Send>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <GiftedChat
        messages={messages.reverse()}
        onSend={onSend}
        user={{
          _id: sender,
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
            textInputStyle={{ color: 'black', backgroundColor: 'lightgray' }}
            placeholder="Type a message..."
          />
        )}
        renderSend={renderSend}
        renderBubble={(props) => (
          <Bubble
            {...props}
            wrapperStyle={{
              right: { backgroundColor: '#007AFF' }, // Sender's messages (right)
              left: { backgroundColor: '#ededed' }, // Receiver's messages (left)
            }}
          />
        )}
      />
    </KeyboardAvoidingView>
  );
};

export default SendMessageScreen;

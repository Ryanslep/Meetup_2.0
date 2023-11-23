// components/ChatScreen.js

import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat, InputToolbar, Composer, Send, Bubble } from 'react-native-gifted-chat';
import messageApi from '../api/messageApi';

const SendMessageScreen = ({ route }) => {
  const { senderId, receiverId } = route.params;
  console.log(senderId, receiverId)

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadMessageHistory = async () => {
      try {
        const history = await messageApi.getThread(senderId, receiverId);
        const formattedHistory = history.map((msg) => {
          return {
            _id: msg._id,
            text: msg.text,
            createdAt: new Date(msg.createdAt),
            user: {
              _id: msg.sender,
              name: msg.sender.username,
            },
            position: msg.sender === senderId ? 'right' : 'left',
          };
        });

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

      setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [senderId, receiverId]);

  const renderSend = (props) => (
    <Send {...props}>
      <View style={{ marginRight: 10, marginBottom: 5 }}>
        {/* Customize the Send button if needed */}
      </View>
    </Send>
  );

  return (
    <View style={styles.container}>
      <GiftedChat
        messages={messages}
        onSend={onSend}
        user={{
          _id: senderId,
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
              right: { backgroundColor: '#007AFF' },
              left: { backgroundColor: '#ededed' },
            }}
          />
        )}
        parsePatterns={(linkStyle) => [
          {
            pattern: /#(\w+)/,
            style: { color: 'orange', textDecorationLine: 'underline' },
            onPress: (props) => alert(`Pressed on hashtag: ${props.text}`),
          },
        ]}
        
        timeFormat='LT'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SendMessageScreen;
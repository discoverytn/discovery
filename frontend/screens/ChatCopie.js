import React from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';

const StatusBar = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', maxWidth: 324 }}>
    <View style={{ fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#333333' }}>
      <Text>9:41</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
    </View>
  </View>
);

const MessageBubble = ({ isUser, children, time }) => (
  <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 14, marginTop: 1, backgroundColor: isUser ? '#E5F6FF' : '#F2F2F2', borderRadius: 0 }}>
    <View style={{ flex: 1, fontSize: 14, lineHeight: 20, color: '#333333' }}>
      <Text>{children}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'flex-start', fontSize: 12, lineHeight: 16, color: '#828282', whiteSpace: 'nowrap' }}>
      <Text>{time}</Text>
    </View>
  </View>
);

const ChatInput = () => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 35, paddingVertical: 30, marginTop: 160, width: '100%', fontSize: 16, letterSpacing: 0.8, lineHeight: 20, color: '#828282', backgroundColor: '#F2F2F2', borderRadius: 20, maxWidth: 275 }}>
    <TextInput
      placeholder="Type your message"
      style={{ flex: 1, alignSelf: 'center' }}
    />
  </View>
);

const ChatCopie = () => {
  const messages = [
    { id: 1, text: "Hello!", time: "9:24", isUser: true },
    { id: 2, text: "Thank you very much for your traveling, we really like the apartments. We will stay here for another 5 days...", time: "9:25", isUser: true },
    { id: 3, text: "Hello!", time: "9:34", isUser: false },
    { id: 4, text: "I'm very glad you like it👍", time: "9:35", isUser: false },
    { id: 5, text: "We are arriving today at 01:45, will someone be at home?", time: "9:37", isUser: false },
    { id: 6, text: "I will be at home", time: "9:39", isUser: true },
  ];

  return (
    <ScrollView>
      <View style={{ paddingHorizontal: 25, paddingTop: 15, paddingBottom: 10, marginLeft: 12.5, maxWidth: 480, backgroundColor: '#FFFFFF', borderRadius: 30 }}>
        <StatusBar />
        <View style={{ alignSelf: 'stretch', marginTop: 30, width: '100%', borderWidth: 2, borderColor: '#F2F2F2', borderStyle: 'solid', aspectRatio: 100, stroke: 1.5, strokeColor: '#F2F2F2' }} />
        <View style={{ flexDirection: 'row', marginTop: 25, maxWidth: 335 }}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', alignSelf: 'flex-start' }}>
            <View style={{ marginLeft: 30, fontSize: 16, fontWeight: '600', textAlign: 'center', color: '#333333' }}>
              <Text>Sajib Rahman</Text>
            </View>
            <View style={{ justifyContent: 'center', alignSelf: 'center', padding: 3.5, paddingTop: 5, marginTop: 40, fontSize: 14, lineHeight: 16, textAlign: 'center', color: '#828282', whiteSpace: 'nowrap', backgroundColor: '#F2F2F2', borderRadius: 15 }}>
              <Text>Today</Text>
            </View>
            {messages.map((message) => (
              <MessageBubble key={message.id} isUser={message.isUser} time={message.time}>
                {message.text}
              </MessageBubble>
            ))}
          </View>
        </View>
        <ChatInput />
        <View style={{ marginTop: 50, backgroundColor: '#333333', height: 5, borderRadius: 100, width: 134 }} />
      </View>
    </ScrollView>
  );
};

export default ChatCopie;

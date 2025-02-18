import React, { useState } from "react";
import {
  View,
  Text,
  Textinput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import axios from "axios";
import ChatBubble from "./ChatBubble";
import  { speak, isSpeakingAsync, stop } from "expo-speech";
import { TextInput } from "react-native-web";

const Chatbot = () => {
    const [chat,  setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const API_KEY = process.env.GEMINI_API_KEY; 

    const handleUserInput = async () => {
        // Add user input to chat
    
        let updatedChat = [
            ...chat,
            {
                role: "user",
                parts: [{ text: userInput }],
            },
        ];

        setLoading(true);

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContext?key=${API_KEY}`,

                {
                    contents: updatedChat,
                }
            )

            console.log("Gemini Pro API Response: ", response.data);

            const modelResponse = response.data?.candidates[0]?.parts[0]?.text || "";

            if (modelResponse) {
                // Add model response
                const updatedChatWithModel = [
                    ...updatedChat,
                    {
                        role: "model",
                        parts: [{ text: modelResponse }],
                    },
                ]

                setChat(updatedChatWithModel);
                setUserInput("");
            }
        } catch (error) {
            console.error("Error calling Gemini Pro API: ", error);
            console.error("Error response: ", error.response?.data);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSpeech = async (text) => {
        if (isSpeaking) {
            //If already spaking, stop the speech
            stop();
            setIsSpeaking(false);
        } else {
            // If no speaking, start the speech
            speak(text);
            setIsSpeaking(true);
        }
    }

    const renderChatItem = ({ item }) => (
        <ChatBubble role={item.role} parts={item.parts[0].text} onSpeech={handleSpeech(item.parts[0].text)} />
        
    )

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chatbot</Text>
            <FlatList
                data={chat}
                renderItem={renderChatItem}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.chatContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    value={userInput}
                    onChangeText={setUserInput}
                    placeholder="Type a message..."
                    placeholderTextColor="#aaa"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleUserInput}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>            
            </View>
            {loading && <ActivityIndicator style={styles.loading} color="#333" />}
            {error && <Text style={styles.error}>{error}</Text>}    
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        marginTop: 40,
        textAlign: "center",
    },
    chatContainer: {
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        maringtop: 140,
    },
    input: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        marginRight: 10,
        height: 50,
        borderColor: "#ccc",
        borderWidth: 1,
        color: "#333",
    },
    button: {
        padding: 10,
        backgroundColor: "#333",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        textAlign: "center",
    },
    loading: {
        marginTop: 20,
    },
    error: {
        color: "red",
        marginTop: 20,
    },
});

export default Chatbot;


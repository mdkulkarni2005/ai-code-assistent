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

const Chatbot = () => {
    const [chat,  setChat] = useState([]);
    const [userInput, setUserInput] = useState("");
    
}
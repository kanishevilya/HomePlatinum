import * as React from "react";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, View, Button } from "react-native";

import * as LocalAuth from "expo-local-authentication";
import { useUsers } from "../UsersContext";

const handleBiometricAuth = async () => {
  const hasHardware = await LocalAuth.hasHardwareAsync();

  const biometricsSupported =
    await LocalAuth.supportedAuthenticationTypesAsync();

  console.info(biometricsSupported.length);

  if (!hasHardware || biometricsSupported.length === 0) {
    Alert.alert("Ошибка", "Ваше устройство не поддерживает биометрию");
    return false;
  }

  const isEnrolled = await LocalAuth.isEnrolledAsync();
  if (!isEnrolled) {
    Alert.alert("Ошибка", "Биометрия не настроена");
    return false;
  }
  const result = await LocalAuth.authenticateAsync({
    promptMessage: "Authenticate",
    fallbackLabel: "Use Passcode",
  });

  if (result.success) {
    return true;
  } else {
    return false;
  }
};

export default handleBiometricAuth;

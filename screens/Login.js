import { View, Text, Image, Linking, Alert } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { TextInput, Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import { useAuth } from "../context/AuthContext";

const Login = ({ navigation }) => {
  const LoginFormSchema = Yup.object().shape({
    email: Yup.string().email().required("An email is required"),
    password: Yup.string()
      .required()
      .min(6, "Your password should have at least 6 characters"),
  });

  const { login, logInLoading } = useAuth();

  const [showPassword, setShowPassword] = React.useState(true);

  const showUserPassword = (showPassword) => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(false);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View>
        <View
          style={{
            marginTop: 70,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            source={icons.padlock}
            style={{
              height: 50,
              width: 50,
              tintColor: COLORS.lightBlueAccent,
            }}
          />
        </View>
        <View
          style={{
            marginTop: 30,
            marginHorizontal: SIZES.padding,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "700" }}>Please Login</Text>
        </View>

        {/* Input fields */}
        <View>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => {
              login(values.email, values.password);
            }}
            validationSchema={LoginFormSchema}
            validateOnMount={true}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              isValid,
              errors,
            }) => (
              <>
                <View
                  style={{
                    marginHorizontal: SIZES.padding,
                    marginVertical: 50,
                  }}
                >
                  <View>
                    <TextInput
                      style={{ marginTop: 10, marginBottom: 30 }}
                      mode="outlined"
                      label={errors.email ? errors.email : "Email"}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      activeOutlineColor={COLORS.lightBlueAccent}
                      error={
                        values.email.length < 1 ||
                        Validator.validate(values.email)
                          ? false
                          : true
                      }
                    />
                  </View>

                  <View>
                    <TextInput
                      mode="outlined"
                      label={errors.password ? errors.password : "Password"}
                      secureTextEntry={showPassword}
                      right={
                        <TextInput.Icon
                          name={showPassword ? "eye" : "eye-off"}
                          onPress={() => showUserPassword(showPassword)}
                        />
                      }
                      onChangeText={handleChange("password")}
                      onBlur={handleBlur("password")}
                      value={values.password}
                      activeOutlineColor={COLORS.lightBlueAccent}
                      error={
                        values.password.length < 1 ||
                        values.password.length >= 6
                          ? false
                          : true
                      }
                    />

                    <View>
                      <Text
                        style={{ marginTop: 5, color: COLORS.lightBlueAccent }}
                        onPress={() => navigation.push("ForgotPassword")}
                      >
                        Forgot Password?
                      </Text>
                    </View>
                  </View>
                </View>

                <View>
                  <Button
                    mode="contained"
                    uppercase={false}
                    onPress={handleSubmit}
                    style={{
                      marginHorizontal: SIZES.padding,
                      padding: 5,

                      justifyContent: "center",
                      elevation: 0,
                    }}
                    contentStyle={{ height: 40 }}
                    labelStyle={{ fontWeight: "bold", ...FONTS.h3 }}
                    color={isValid ? COLORS.lightBlueAccent : "#9ACAF7"}
                    loading={logInLoading}
                    disabled={logInLoading}
                  >
                    Continue
                  </Button>
                </View>
              </>
            )}
          </Formik>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          width: SIZES.width,
          justifyContent: "center",
          marginTop: 50,
        }}
      >
        <Text>Don't have a account? </Text>
        <TouchableOpacity onPress={() => navigation.push("Signup")}>
          <Text style={{ color: COLORS.lightBlueAccent }}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

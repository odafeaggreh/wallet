import { View, Text, Image, Linking, Alert } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { TextInput, Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Formik } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import { useAuth } from "../context/AuthContext";

const ForgotPassword = ({ navigation }) => {
  const ForgotPasswordFormSchema = Yup.object().shape({
    email: Yup.string().email().required("An email is required"),
  });

  const { resetPassword, loading } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <View>
        <View
          style={{
            marginTop: 150,
            marginHorizontal: SIZES.padding,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 30, fontWeight: "700" }}>
            Reset Password
          </Text>
        </View>

        {/* Input fields */}
        <View>
          <Formik
            initialValues={{ email: "", password: "" }}
            onSubmit={(values) => {
              resetPassword(values.email);
            }}
            validationSchema={ForgotPasswordFormSchema}
            validateOnMount={false}
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
                      style={{ marginTop: 10, marginBottom: 10 }}
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
                    loading={loading}
                    disabled={loading}
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

export default ForgotPassword;

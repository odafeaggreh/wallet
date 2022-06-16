import { View, Text } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { TextInput, Button } from "react-native-paper";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ErrorMessage, Formik, yupToFormErrors } from "formik";
import * as Yup from "yup";
import Validator from "email-validator";
import SignupAppBar from "../components/SignupAppBar";
import { db, auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const Signup = ({ navigation }) => {
  const SignupFormSchema = Yup.object().shape({
    email: Yup.string().email().required("An email is required"),
    password: Yup.string()
      .required()
      .min(6, "Your password should have at least 6 characters"),
    passwordConfirmation: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Passwords must match"
    ),
    country: Yup.string().required().min(2, "Please enter a country of origin"),
  });

  const [showPassword, setShowPassword] = React.useState(true);
  const [showPasswordconfirm, setShowPasswordConfirm] = React.useState(true);

  const showUserPassword = (showPassword) => {
    if (showPassword) {
      setShowPassword(false);
    } else {
      setShowPassword(true);
    }
  };

  const showUserPasswordConfirm = (showPassword) => {
    if (showPassword) {
      setShowPasswordConfirm(false);
    } else {
      setShowPasswordConfirm(true);
    }
  };

  const { signup, signInLoading } = useAuth();

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <SignupAppBar title="New Account" navigation={navigation} />
      <View>
        {/* Input fields */}
        <View>
          <Formik
            initialValues={{
              email: "",
              password: "",
              passwordConfirmation: "",
              country: "",
            }}
            onSubmit={(values) =>
              signup(values.email, values.password, values.country)
            }
            validationSchema={SignupFormSchema}
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
                      style={{ marginTop: 10, marginBottom: 30 }}
                      mode="flat"
                      label={errors.email ? errors.email : "Email"}
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values.email}
                      activeUnderlineColor={COLORS.lightBlueAccent}
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
                      style={{ marginTop: 10, marginBottom: 30 }}
                      mode="flat"
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
                      activeUnderlineColor={COLORS.lightBlueAccent}
                      error={
                        values.password.length < 1 ||
                        values.password.length >= 6
                          ? false
                          : true
                      }
                    />
                  </View>

                  <View>
                    <TextInput
                      style={{ marginTop: 10, marginBottom: 30 }}
                      mode="flat"
                      label={
                        errors.passwordConfirmation
                          ? errors.passwordConfirmation
                          : "Confirm password"
                      }
                      secureTextEntry={showPasswordconfirm}
                      right={
                        <TextInput.Icon
                          name={showPasswordconfirm ? "eye" : "eye-off"}
                          onPress={() =>
                            showUserPasswordConfirm(showPasswordconfirm)
                          }
                        />
                      }
                      onChangeText={handleChange("passwordConfirmation")}
                      onBlur={handleBlur("passwordConfirmation")}
                      value={values.passwordConfirmation}
                      activeUnderlineColor={COLORS.lightBlueAccent}
                      error={
                        values.password !== values.passwordConfirmation
                          ? true
                          : false
                      }
                    />
                  </View>

                  <View>
                    <TextInput
                      mode="flat"
                      label={errors.country ? errors.country : "Country"}
                      onChangeText={handleChange("country")}
                      onBlur={handleBlur("country")}
                      value={values.country}
                      activeUnderlineColor={COLORS.lightBlueAccent}
                      error={
                        values.country.length < 1 || values.country.length >= 2
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
                    loading={signInLoading}
                    disabled={signInLoading}
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
        <Text>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.push("Login")}>
          <Text style={{ color: COLORS.lightBlueAccent }}>Log in</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;

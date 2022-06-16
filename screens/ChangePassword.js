import { View, Text } from "react-native";
import React, { useState } from "react";
import { SIZES, COLORS, FONTS, dummyData, icons } from "../constants";
import { TextInput, Button } from "react-native-paper";
import { Formik } from "formik";
import * as Yup from "yup";
import { useAuth } from "../context/AuthContext";
import SignupAppBar from "../components/SignupAppBar";
import { auth } from "../firebase";

const ChangePassword = ({ navigation }) => {
  const [showNewPassword, setShowNewPassword] = React.useState(true);
  const theUser = auth.currentUser;

  const showUserNewPassword = (showNewPassword) => {
    setShowNewPassword(!showNewPassword);
  };

  const updatePasswordSchema = Yup.object().shape({
    newPassword: Yup.string()
      .required()
      .min(6, "Your password should have at least 6 characters"),
  });

  const { upDateUserPassword, loading, currentUser } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <SignupAppBar title="Change Password" navigation={navigation} />
      <View>
        <View
          style={{
            marginTop: 40,
            marginHorizontal: SIZES.padding,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 30, ...FONTS.body3, color: COLORS.lightGray3 }}
          >
            Enter your current password. Then enter and confirm your new
            password.
          </Text>
        </View>

        {/* Input fields */}
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={(values) => {
            upDateUserPassword(theUser, values.newPassword);
          }}
          validationSchema={updatePasswordSchema}
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
                    mode="outlined"
                    label="New Password"
                    secureTextEntry={showNewPassword}
                    right={
                      <TextInput.Icon
                        name={showNewPassword ? "eye" : "eye-off"}
                        onPress={() => showUserNewPassword(showNewPassword)}
                      />
                    }
                    onChangeText={handleChange("newPassword")}
                    onBlur={handleBlur("newPassword")}
                    value={values.newPassword}
                    activeOutlineColor={COLORS.lightBlueAccent}
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
                  Update password
                </Button>
              </View>
            </>
          )}
        </Formik>
      </View>
    </View>
  );
};

export default ChangePassword;

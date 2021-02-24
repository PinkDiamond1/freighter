import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";

import { ROUTES } from "popup/constants/routes";

import { AppDispatch } from "popup/App";
import { navigateTo } from "popup/helpers/navigate";

import { SubviewHeader, SubviewWrapper } from "popup/basics/AccountSubview";

import {
  ApiErrorMessage,
  Error,
  Form,
  FormRow,
  TextField,
  SubmitButton,
} from "popup/basics/Forms";

import {
  addAccount,
  authErrorSelector,
  clearApiError,
} from "popup/ducks/authServices";

interface FormValues {
  password: string;
}

const initialValues: FormValues = {
  password: "",
};

export const AddAccount = () => {
  interface FormValues {
    password: string;
  }

  const dispatch: AppDispatch = useDispatch();
  const authError = useSelector(authErrorSelector);

  const handleSubmit = async (values: FormValues) => {
    const { password } = values;

    const res = await dispatch(addAccount(password));

    if (addAccount.fulfilled.match(res)) {
      navigateTo(ROUTES.account);
    }
  };

  const clearAddAccountError = (e: React.ChangeEvent<any>) => {
    if (authError && e.target.value === "") {
      dispatch(clearApiError());
    }
  };

  return (
    <>
      <SubviewWrapper>
        <SubviewHeader headerText="Add a new Stellar address" />
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ dirty, handleChange, isSubmitting, isValid }) => (
            <Form>
              <FormRow>
                <TextField
                  autoComplete="off"
                  name="password"
                  onChange={(e: React.ChangeEvent) => {
                    clearAddAccountError(e);
                    handleChange(e);
                  }}
                  placeholder="Enter password"
                  type="password"
                />
                <Error name="password" />
                <ApiErrorMessage error={authError}></ApiErrorMessage>
              </FormRow>
              <FormRow>
                <SubmitButton
                  dirty={dirty}
                  isSubmitting={isSubmitting}
                  isValid={isValid}
                >
                  Add New Address
                </SubmitButton>
              </FormRow>
            </Form>
          )}
        </Formik>
      </SubviewWrapper>
    </>
  );
};
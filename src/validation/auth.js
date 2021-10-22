import * as Yup from "yup";

export const UserCreateSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  name: Yup.string().required(),
  password: Yup.string().required(),
});

export const UserLoginSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

export const RefreshTokenSchema = Yup.object().shape({
  refresh_token: Yup.string().required(),
});

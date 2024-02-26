import {
  Paper,
  TextInput,
  PasswordInput,
  Checkbox,
  Button,
  Title,
  Text,
  Anchor,
  Center,
  Image,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import classes from "./loginPage.module.css";
import imgsrc from "../assets/images/logos/sticker_03-m7V8PpjovvU5RyGN.avif";
import useApiRequest from "../hooks/useApiRequest";
import { useElementSize } from "@mantine/hooks";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/user";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function LoginPage() {
  const { sendRequest, resultData, error, loading } = useApiRequest();
  const { ref, width } = useElementSize();
  const navigate = useNavigate();
  const location = useLocation()

  const dispatch = useDispatch();

  interface Values {
    email: string;
    password: string;
    keepMeLoggedIn: boolean;
  }

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      keepMeLoggedIn: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  const handleSumbit = (values: Values) => {
    console.log(values);
    sendRequest("post", "/auth/token/", {
      email: values.email,
      password: values.password,
    });
  };

  useEffect(() => {
    if (resultData != null) {
      localStorage.setItem("accessToken", resultData.access);
      dispatch(login(resultData.access));
      console.log("Loggin in", login(resultData.access));

      console.log("Location from", location.state)
      navigate(location.state?.from ? location.state.from : "/");
    }
  }, [resultData]);

  if (!resultData) {
    return (
      <div className={classes.wrapper}>
        <div
          style={{
            height: "100%",
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <Center style={{ width: "100%", height: "100%" }}>
            <Paper className={classes.form} radius={15} p={"xl"}>
              <LoadingOverlay
                visible={loading}
                zIndex={1000}
                overlayProps={{ radius: "15", blur: 0.5 }}
              />
              <Title
                order={2}
                className={classes.title}
                ta="center"
                mt="md"
                mb={50}
                style={{ display: "inline-block" }}
              >
                Welcome back to
                <Image src={imgsrc} />
              </Title>
              <form
                ref={ref}
                onSubmit={form.onSubmit((values) => handleSumbit(values))}
              >
                <TextInput
                  label="Email address"
                  placeholder="hello@gmail.com"
                  size="md"
                  {...form.getInputProps("email")}
                />
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  mt="md"
                  size="md"
                  {...form.getInputProps("password")}
                />
                {error && (
                  <Text
                    size="xs"
                    c="red.5"
                    inline={true}
                    style={{ maxWidth: width, textAlign: "center" }}
                  >
                    {error}
                  </Text>
                )}
                <Checkbox
                  label="Keep me logged in"
                  mt="xl"
                  size="md"
                  {...form.getInputProps("keepMeLoggedIn")}
                />
                <Button type="submit" fullWidth mt="xl" size="md">
                  Login
                </Button>
              </form>
              <Text ta="center" mt="md">
                Don&apos;t have an account?{" "}
                <Anchor<"a">
                  href="#"
                  fw={700}
                  onClick={(event) => event.preventDefault()}
                >
                  Register
                </Anchor>
              </Text>
            </Paper>
          </Center>
        </div>
      </div>
    );
  }
}

"use client";
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useDebounceCallback, useDebounceValue } from "usehooks-ts";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signupSchema";
import axios from "axios";
import { Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
function page() {
  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [usernameMessage, setUsernameMessage] = React.useState("");
  const [isCheckingUsername, setIsCheckingUsername] = React.useState(false);
  const [password, setPassword] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const router = useRouter();
  const debounced = useDebounceCallback(setUsername, 500);
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const checkUsernameUniqueness = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const res = await axios.get(
            `/api/check-unique-username?username=${username}`
          );
          setUsernameMessage(res.data.message);
          console.log(usernameMessage)
          console.log(res.data.message)
        } catch (error) {
          console.log(error);
          setUsernameMessage("Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }

      console.log("checking username", username);
    };
    checkUsernameUniqueness();
  }, [username]);
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post("/api/sign-up", data);
      console.log(data)
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (e){

      console.log("Error signing up",e);
      setIsSubmitting(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sign Up to Anonify</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Username "
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>

                  {isCheckingUsername && (
                    <Loader2 className="animate-spin h-4 w-4 ml-2 inline-block" />
                  )}
                  <p>
                    {usernameMessage && (
                      <span
                        className={`text-sm ${usernameMessage.includes("available") ? "text-green-600" : "text-red-600"}`}
                      >
                        {usernameMessage}
                      </span>
                    )}
                  </p>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email " {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>password</FormLabel>
                  <FormControl>
                    <Input placeholder="Password " {...field} type="password" />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default page;

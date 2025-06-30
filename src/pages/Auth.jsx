import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSignin = async (e) => {
    e.preventDefault();
    console.log("reached");

    const apiBaseUrl = import.meta.env.VITE_API_URL;

    if (!apiBaseUrl) {
      console.error("API URL is not defined in .env file!");
      enqueueSnackbar("Internal error: API URL not found", {
        variant: "error",
      });
      return;
    }

    try {
      const response = await axios.post(`${apiBaseUrl}/api/v1/drive/signin`, {
        username,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      enqueueSnackbar("Signin successful", { variant: "success" });

      setTimeout(() => {
        navigate("/create-drive");
      }, 1000);
    } catch (err) {
      console.error("Signin error:", err);
      enqueueSnackbar(
        "Failed to sign in. Please check your credentials and try again.",
        {
          variant: "error",
        }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <div className="flex justify-center mb-6">
          <img src="/Images/BIET-Jhansi-Logo.webp" alt="Logo" className="h-24 w-auto" />
        </div>
        <h1 className="text-2xl font-bold mb-6 text-center">TPC (BIET-JHS) - Coorporate Relations</h1>
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSignin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Email
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 font-medium">
              Password
            </label>
            <input
              type="password" // FIXED type
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700 transition duration-200"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;

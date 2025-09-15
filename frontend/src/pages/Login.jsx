import React, { useState } from "react";
import api, { setAuthToken } from "../api";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password] = useState("password"); // default password
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setAuthToken(res.data.token);
      onLogin(res.data.token);
    } catch (err) {
      alert("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
      <div className="w-full max-w-md">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-1 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="bg-gray-800 p-8 rounded-xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Welcome Back
                </h2>
                <p className="text-gray-400 mt-2">Sign in to continue</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      value={password}
                      readOnly
                      className="w-full px-4 py-3 focus:outline-none rounded-lg bg-gray-700 border border-gray-600 text-white opacity-80 cursor-not-allowed"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <span className="text-xs text-blue-400 bg-blue-900 bg-opacity-30 px-2 py-1 rounded">
                        Default
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Using default password for demo purposes
                  </p>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 ${
                    isLoading 
                      ? 'bg-blue-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 shadow-lg hover:shadow-blue-500/25'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Logging in...
                    </div>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
              
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-500">
                  Password is default set • Just enter your email
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-gray-600">
            Secure authentication system
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
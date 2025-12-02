"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthService } from "../../application/services/auth-service";
import { HttpAuthRepository } from "../../infrastructure/repositories/http-auth-repository";

export default function RegisterPage() {
  const router = useRouter();
  const authService = new AuthService(new HttpAuthRepository());
  
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    farmId: 1, // Default to 1 for now as per requirements
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await authService.register({
        ...formData,
        role: "USER", // Default role
      });
      // Redirect to login on success
      router.push("/login?registered=true");
    } catch (err) {
      setError("Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/80 p-8 shadow-xl backdrop-blur-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-emerald-900">AgroPulse</h1>
          <p className="mt-2 text-emerald-600">Create your account</p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-rose-50 p-4 text-sm text-rose-600 border border-rose-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-emerald-900">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 placeholder-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Choose a username"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-emerald-900">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 placeholder-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="name@example.com"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-emerald-900">
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full rounded-xl border border-emerald-100 bg-white px-4 py-3 text-emerald-900 placeholder-emerald-300 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white transition-all hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/20 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-emerald-600">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-emerald-800 hover:text-emerald-900 hover:underline">
            Sign in here
          </Link>
        </div>
      </div>
    </div>
  );
}

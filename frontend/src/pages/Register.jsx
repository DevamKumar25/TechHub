import { useState } from "react";
import { registerUser } from "../services/authService";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await registerUser(form);
      if (res.data?.token && res.data?.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.16),transparent_35%),linear-gradient(135deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-4xl border border-slate-200 bg-white/85 shadow-[0_25px_80px_-20px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="hidden w-1/2 flex-col justify-between bg-linear-to-br from-violet-700 via-indigo-700 to-sky-700 p-10 text-white md:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold backdrop-blur">
              AT
            </div>
            <div>
              <p className="text-lg font-semibold">ABC Tech</p>
              <p className="text-sm text-sky-100">Operations Hub</p>
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight">
              Start your account and unlock a better workflow.
            </h1>
            <p className="max-w-md text-sm leading-7 text-sky-100">
              Create a secure account to manage projects, clients, and your team more efficiently.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm font-semibold">Stay ahead with ABC Tech</p>
            <p className="mt-1 text-sm text-sky-100">
              Organized • Modern • Built for growth
            </p>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200"
          >
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 text-lg font-bold text-sky-700">
                AT
              </div>
              <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
              <p className="mt-2 text-sm text-slate-500">
                Join ABC Tech and simplify operations
              </p>
            </div>

            <div className="space-y-4">
              <Input
                placeholder="Full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />

              <Input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <Button className="mt-6" isLoading={isSubmitting} disabled={isSubmitting}>
              Create account
            </Button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Already have an account?{" "}
              <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
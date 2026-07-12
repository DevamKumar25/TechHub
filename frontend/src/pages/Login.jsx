import { useState, useContext } from "react";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import Input from "../components/Input";
import Button from "../components/Button";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await loginUser(form);
    login(res.data.token, res.data.user);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_35%),linear-gradient(135deg,#f8fbff_0%,#eef4ff_100%)] px-4 py-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-6xl overflow-hidden rounded-4xl border border-slate-200 bg-white/85 shadow-[0_25px_80px_-20px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="hidden w-1/2 flex-col justify-between bg-linear-to-br from-sky-700 via-indigo-700 to-violet-700 p-10 text-white md:flex">
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
              Manage your business with clarity and speed.
            </h1>
            <p className="max-w-md text-sm leading-7 text-sky-100">
              Keep clients, projects, and team progress aligned in one polished workspace.
            </p>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/10 p-4 backdrop-blur">
            <p className="text-sm font-semibold">Trusted by ambitious teams</p>
            <p className="mt-1 text-sm text-sky-100">
              Fast onboarding • Clear visibility • Secure access
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
              <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue to ABC Tech
              </p>
            </div>

            <div className="space-y-4">
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

            <Button className="mt-6">Sign in</Button>

            <p className="mt-6 text-center text-sm text-slate-600">
              Don’t have an account?{" "}
              <Link className="font-semibold text-sky-600 hover:text-sky-700" to="/register">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
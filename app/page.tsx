'use client';
import { useRouter } from "next/navigation";

export default function Home() {


  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <button title="login" type="button" onClick={() => router.push('/login')}>Login</button>
      <a>Register</a>
    </div>
  );
}

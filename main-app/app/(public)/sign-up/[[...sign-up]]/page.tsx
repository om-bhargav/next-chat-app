import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex py-20 items-center justify-center">
      <SignUp />
    </div>
  );
}
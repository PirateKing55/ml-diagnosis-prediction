import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import MedicalPredictionForm from "./components/form";

export default function App() {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <SignedOut>
        <div className="w-full min-h-screen flex items-center justify-center">
          <SignInButton>
            <button className="px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition">
              Sign In to Continue
            </button>
          </SignInButton>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="w-full min-h-screen flex flex-col gap-20">
          {/* Header with UserButton in top right */}
          <header className="w-full p-4 flex justify-end bg-white shadow">
            <UserButton showName={true} />
          </header>

          {/* Main content */}
          <main className="w-full flex justify-center px-4">
            <div className="w-full max-w-2xl">
              <MedicalPredictionForm />
            </div>
          </main>
        </div>
      </SignedIn>
    </div>
  );
}

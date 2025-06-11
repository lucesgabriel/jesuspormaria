import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-purple-800">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Biblia Jerusalén Católica
          </h1>
          <p className="text-purple-200">
            Crea tu cuenta para comenzar tu estudio bíblico
          </p>
        </div>
        <SignUp 
          routing="path" 
          path="/sign-up"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-purple-200",
              socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
              formFieldInput: "bg-white/10 border border-white/20 text-white placeholder:text-purple-200",
              formButtonPrimary: "bg-purple-600 hover:bg-purple-700",
              footerActionLink: "text-purple-300 hover:text-purple-200"
            }
          }}
        />
      </div>
    </div>
  )
} 
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-blue-800">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Biblia Jerusalén Católica
          </h1>
          <p className="text-blue-200">
            Inicia sesión para acceder a todas las funcionalidades
          </p>
        </div>
        <SignIn 
          routing="path" 
          path="/sign-in"
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-white/10 backdrop-blur-md border border-white/20 shadow-xl",
              headerTitle: "text-white",
              headerSubtitle: "text-blue-200",
              socialButtonsBlockButton: "bg-white/10 border border-white/20 text-white hover:bg-white/20",
              formFieldInput: "bg-white/10 border border-white/20 text-white placeholder:text-blue-200",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700",
              footerActionLink: "text-blue-300 hover:text-blue-200"
            }
          }}
        />
      </div>
    </div>
  )
} 
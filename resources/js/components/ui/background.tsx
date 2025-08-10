import { useUserStore } from "@/store/useUserStore"

const Background = () => {
  const { roles, background } = useUserStore()

  const isStudent = roles.includes("student")

  if (!isStudent || !background) return null

  return (
    <div
      className="absolute inset-0 -z-10 min-h-screen" 
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.5,
      }}
    />
  )
}

export default Background

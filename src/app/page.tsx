"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { Loader2 } from "lucide-react"
// @ts-ignore
import confetti from "canvas-confetti"

export default function Home() {
  const [error, setError] = useState("")
  const [memeUrl, setMemeUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!error.trim()) {
      toast({
        title: "Error",
        description: "Please enter an error message",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/meme", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate meme")
      }

      const data = await response.json()
      setMemeUrl(data.memeUrl)

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      toast({
        title: "Success!",
        description: "Your meme has been generated",
      })
    } catch (err) {
      console.error("Error generating meme:", err)
      toast({
        title: "Error",
        description: "Oops, meme machine broke!",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadMeme = () => {
    if (!memeUrl) return

    const link = document.createElement("a")
    link.href = memeUrl
    link.download = "bug2meme.jpg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const surpriseErrors = [
    'TypeError: undefined is not a function',
    'NullPointerException at line 69',
    'Segmentation Fault 💀',
    'npm ERR! code ERESOLVE',
    '403 Forbidden... again?'
  ];

  const handleSurprise = () => {
    const random = surpriseErrors[Math.floor(Math.random() * surpriseErrors.length)];
    setError(random);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-yellow-50 via-white to-yellow-100 flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-2xl space-y-10">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-indigo-700">
            🪲 BuggedIRL
          </h1>
          <p className="text-md md:text-lg text-gray-600">
            Turn your programming pain into meme-powered coping therapy
          </p>
        </div>

        <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <Textarea
                placeholder="Paste the error message that ruined your day..."
                className="min-h-[130px] rounded-xl border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-700 text-sm"
                value={error}
                onChange={(e) => setError(e.target.value)}
              />
              <div className="mt-4 flex gap-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-xl transition"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Meme...
                    </>
                  ) : (
                    "Generate Meme"
                  )}
                </Button>
                <button
                  onClick={handleSurprise}
                  className="px-4 py-2 text-sm font-medium text-purple-700 border border-purple-400 rounded-xl hover:bg-purple-50 transition"
                >
                  🎲 Surprise Me
                </button>
              </div>
              
            </form>
          </CardContent>
        </Card>

        {memeUrl && !loading && (
          <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
            <CardContent className="p-6 flex flex-col items-center gap-4">
              <Image
                src={memeUrl}
                alt="Generated meme"
                width={500}
                height={500}
                className="rounded-lg shadow-md w-full max-w-md"
              />
              <Button
                onClick={downloadMeme}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl"
              >
                Download Meme
              </Button>
            </CardContent>
          </Card>
        )}

        <footer className="text-center text-sm text-gray-500">
          Made by devs 💥 who cope through memes
        </footer>
      </div>
    </main>
  )
}
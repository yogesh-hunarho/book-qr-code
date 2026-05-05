import { Smartphone, Zap, Video, BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center px-4">
      <div className="w-full max-w-4xl space-y-12 py-20 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <p className="mx-auto max-w-2xl animate-in text-xl text-muted-foreground duration-1000 fade-in slide-in-from-bottom-12">
            Bridge the gap between physical books and digital content. Scan,
            watch, learn, and test your knowledge in seconds.
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid animate-in gap-6 text-left delay-300 duration-1000 fade-in zoom-in">
          <div className="glass-card group border-indigo-100 bg-linear-to-br from-indigo-50 to-transparent p-8 md:p-12">
            <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 transition-transform group-hover:scale-110">
                  <Smartphone className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="mb-2 text-3xl font-bold">Scan QR Code</h3>
                  <p className="text-lg text-muted-foreground">
                    Scan the QR code from your textbook or chapter and you&apos;ll land
                    directly in the right place to start learning.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground italic">
                  Ready to learn anytime, anywhere.
                </div>
              </div>

              <div className="grid w-full gap-6 sm:grid-cols-2 md:w-64 md:grid-cols-1">
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-indigo-100 p-1.5">
                    <Zap className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-900">Instant Sync</p>
                    <p className="text-xs text-muted-foreground">
                      Connect books to digital labs instantly.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-indigo-100 p-1.5">
                    <Video className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-900">Video Lessons</p>
                    <p className="text-xs text-muted-foreground">
                      Watch detailed explanations for each topic.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-lg bg-indigo-100 p-1.5">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-indigo-900">Interactive Quiz</p>
                    <p className="text-xs text-muted-foreground">
                      Test your knowledge after every scan.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

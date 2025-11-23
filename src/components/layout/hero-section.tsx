import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-sage-50 via-sage-100 to-sage-200 dark:from-sage-900 dark:via-sage-800 dark:to-sage-900">
        {/* Decorative organic shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sage-300/30 dark:bg-sage-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sage-400/20 dark:bg-sage-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sage-200/40 dark:bg-sage-800/30 rounded-full blur-3xl" />

        {/* Subtle pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-sage-900 dark:text-white mb-6 text-balance">
          Trova la tua
          <span className="block font-medium text-sage-700 dark:text-sage-200">
            Serenità Interiore
          </span>
        </h1>

        <p className="text-lg md:text-xl text-sage-700 dark:text-sage-200 mb-8 max-w-2xl mx-auto text-pretty">
          Unisciti alla nostra comunità di yoga e scopri un percorso di
          benessere, equilibrio e crescita personale in un ambiente accogliente
          e professionale.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            size="lg"
            className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 text-lg shadow-lg"
          >
            Inizia il tuo Percorso
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="border-sage-600 dark:border-sage-400 text-sage-700 dark:text-sage-200 hover:bg-sage-600 hover:text-white dark:hover:bg-sage-400 dark:hover:text-sage-900 px-8 py-3 text-lg bg-white/50 dark:bg-sage-800/50 backdrop-blur-sm"
          >
            <Play className="mr-2 w-5 h-5" />
            Guarda Video
          </Button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto">
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-sage-800 dark:text-white">
              500+
            </div>
            <div className="text-sage-600 dark:text-sage-300 text-sm">
              Studenti Felici
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-sage-800 dark:text-white">
              15+
            </div>
            <div className="text-sage-600 dark:text-sage-300 text-sm">
              Classi Settimanali
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-3xl font-bold text-sage-800 dark:text-white">
              5
            </div>
            <div className="text-sage-600 dark:text-sage-300 text-sm">
              Anni di Esperienza
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

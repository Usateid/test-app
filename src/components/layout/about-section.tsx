import { Button } from "@/components/ui/button";
import { Heart, Leaf, Users } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Benessere Olistico",
    description:
      "Curiamo corpo, mente e spirito attraverso pratiche antiche e moderne",
  },
  {
    icon: Leaf,
    title: "Ambiente Naturale",
    description:
      "Spazi progettati per creare armonia con elementi naturali e luce",
  },
  {
    icon: Users,
    title: "Comunità Accogliente",
    description:
      "Una famiglia di praticanti che si supportano nel percorso di crescita",
  },
];

export function AboutSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-light text-sage-900 mb-6">
              La Nostra Missione
            </h2>

            <p className="text-lg text-sage-600 mb-6 text-pretty">
              Da oltre 5 anni, Serenity Yoga è un punto di riferimento per chi
              cerca equilibrio e benessere attraverso la pratica dello yoga. La
              nostra missione è creare uno spazio sicuro dove ogni persona può
              esplorare il proprio potenziale.
            </p>

            <p className="text-sage-600 mb-8 text-pretty">
              Crediamo che lo yoga sia molto più di una pratica fisica: è un
              percorso di scoperta personale che porta pace interiore, forza e
              consapevolezza.
            </p>

            <Button className="bg-sage-600 hover:bg-sage-700 text-white">
              Scopri di Più
            </Button>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="/yoga-instructor-in-peaceful-meditation-pose.jpg"
              alt="Yoga instructor"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* Values */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="text-xl font-medium text-sage-900 mb-2">
                  {value.title}
                </h3>
                <p className="text-sage-600 text-pretty">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

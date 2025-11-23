import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star } from "lucide-react";

const classes = [
  {
    name: "Hatha Yoga",
    description:
      "Perfetto per principianti, focus su posture base e respirazione",
    duration: "60 min",
    level: "Principiante",
    participants: "12",
    rating: "4.9",
    image: "/peaceful-hatha-yoga-class.jpg",
  },
  {
    name: "Vinyasa Flow",
    description: "Sequenze dinamiche che collegano movimento e respiro",
    duration: "75 min",
    level: "Intermedio",
    participants: "15",
    rating: "4.8",
    image: "/dynamic-vinyasa-yoga-flow.jpg",
  },
  {
    name: "Yin Yoga",
    description:
      "Pratica meditativa con posture tenute a lungo per il rilassamento",
    duration: "90 min",
    level: "Tutti i livelli",
    participants: "10",
    rating: "5.0",
    image: "/relaxing-yin-yoga-session.jpg",
  },
];

export function ClassesSection() {
  return (
    <section className="py-16 md:py-24 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-sage-900 mb-4">
            Le Nostre Classi
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto text-pretty">
            Scopri la varietà delle nostre classi, progettate per ogni livello e
            obiettivo di benessere
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {classes.map((yogaClass, index) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-video overflow-hidden">
                <img
                  src={yogaClass.image || "/placeholder.svg"}
                  alt={yogaClass.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl text-sage-900">
                    {yogaClass.name}
                  </CardTitle>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-sage-600">
                      {yogaClass.rating}
                    </span>
                  </div>
                </div>
                <CardDescription className="text-sage-600">
                  {yogaClass.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex justify-between items-center mb-4 text-sm text-sage-600">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{yogaClass.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>Max {yogaClass.participants}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-sage-700 bg-sage-100 px-2 py-1 rounded">
                    {yogaClass.level}
                  </span>
                  <Button size="sm" className="bg-sage-600 hover:bg-sage-700">
                    Prenota
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

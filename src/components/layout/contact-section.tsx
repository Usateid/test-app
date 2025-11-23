import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const contactInfo = [
  {
    icon: MapPin,
    title: "Indirizzo",
    details: ["Via della Serenità 123", "20100 Milano, Italia"],
  },
  {
    icon: Phone,
    title: "Telefono",
    details: ["+39 02 1234 5678", "+39 345 678 9012"],
  },
  {
    icon: Mail,
    title: "Email",
    details: ["info@serenityyoga.it", "prenotazioni@serenityyoga.it"],
  },
  {
    icon: Clock,
    title: "Orari",
    details: ["Lun-Ven: 7:00-21:00", "Sab-Dom: 8:00-19:00"],
  },
];

export function ContactSection() {
  return (
    <section className="py-16 md:py-24 bg-sage-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-sage-900 mb-4">
            Contattaci
          </h2>
          <p className="text-lg text-sage-600 max-w-2xl mx-auto text-pretty">
            Siamo qui per rispondere alle tue domande e aiutarti a iniziare il
            tuo percorso di benessere
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <Card key={index} className="border-sage-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center space-x-3 text-sage-900">
                      <div className="w-10 h-10 bg-sage-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-sage-600" />
                      </div>
                      <span>{info.title}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sage-600">
                        {detail}
                      </p>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Contact Form */}
          <Card className="border-sage-200">
            <CardHeader>
              <CardTitle className="text-sage-900">
                Invia un Messaggio
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">
                    Nome
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-sage-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                    placeholder="la-tua-email@esempio.it"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">
                  Oggetto
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="Di cosa vorresti parlare?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-sage-700 mb-1">
                  Messaggio
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 border border-sage-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sage-500"
                  placeholder="Scrivi il tuo messaggio qui..."
                />
              </div>

              <Button className="w-full bg-sage-600 hover:bg-sage-700 text-white">
                Invia Messaggio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

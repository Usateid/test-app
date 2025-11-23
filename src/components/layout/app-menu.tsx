import ScrollableCards from "@/components/common/scrollable-cards";
import DogTag from "@/components/common/scrollable-cards/dog-tag";
import Image from "next/image";
import Link from "next/link";

export default function AppMenu() {
  const items = [
    {
      title: "I nostri centri",
      href: "/centers",
      className: "bg-cyan-200",
      image: "/center_1.jpg",
    },
    {
      title: "Le nostre attività",
      href: "/activities",
      image: "/center_1.jpg",
    },
    {
      title: "Le nostre lezioni",
      href: "/lessons",
      image: "/center_1.jpg",
    },
    {
      title: "I nostri insegnanti",
      href: "/teachers",
      image: "/center_1.jpg",
    },
  ];
  return (
    <div>
      <ScrollableCards>
        {items.map((item) => (
          <DogTag key={item.title} className="h-28 w-64 p-0 relative">
            <Link href={item.href}>
              <Image
                src={item.image}
                alt={item.title}
                fill={true}
                className="w-full h-full object-cover"
              />
            </Link>

            <span className="absolute inset-0 flex items-center justify-center text-white text-lg font-bold text-center">
              {item.title}
            </span>
          </DogTag>
        ))}
      </ScrollableCards>
    </div>
  );
}

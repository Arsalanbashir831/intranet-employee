import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

interface TeamsCardProps {
  image: string;
  name: string;
  designation: string;
  description: string;
}

export default function TeamsCard({
  image,
  name,
  designation,
  description,
}: TeamsCardProps) {
  return (
    <Card className="m-5 w-[310px] h-[370px] overflow-hidden !rounded-none shadow-md">
      {/* Top half: Image */}
      <div className="w-[310px] h-[230px] relative">
        <Image src={image} alt={name} fill className="object-cover" />
      </div>

      {/* Bottom half: Details */}
      <CardContent className="h-[140px] px-4 flex flex-col">
        <h2 className="text-xl font-semibold text-[#D64575]">{name}</h2>
        <h3 className="text-sm text-[#49A2A6] mb-2">{designation}</h3>
        <p className="text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

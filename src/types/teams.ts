/**
 * Teams component types
 */

// Team Member type (for team-section component)
export type TeamMember = {
  id: number;
  name: string;
  role: "Manager" | "Team";
  image?: string;
};

// Branch type (simplified for branches-section component)
export type BranchCard = {
  id: number;
  name: string;
  employeeCount: number;
};

// Teams Card component types
export type TeamsCardProps = {
  image: string;
  name: string;
  designation: string;
  role?: string;
  branches?: string[];
  departments?: string[];
  href?: string;
  className?: string;
  topClassName?: string; // image wrapper
  imgClassName?: string; // <Image> fit
};

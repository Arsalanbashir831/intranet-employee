import { PageHeader } from "@/components/common/page-header";
import { EmployeeProfileCard } from "@/components/profile/profile-card";
import { OrgChartForm } from "@/components/profile/profile-form";
import { ROUTES } from "@/constants/routes";

export default function Home() {
  return (
    <div>
      {/* <h1>Home</h1> */}
      <PageHeader title="Profile" crumbs={[{ label: "Pages" }, { label: "Profile", href: ROUTES.DASHBOARD.PROFILE }]} />
      <EmployeeProfileCard/>
      <OrgChartForm />
    </div>
  );
}
import DocumentCard from "@/components/documents/document-card";
import TeamsCard from "@/components/teams/teams-card";
import FeatureCard from "@/components/common/feature-card";

export default function Home() {
  return (
    <div className="bg-gray-100">
      {/* <h1>Home</h1> */}
      {/* <PageHeader title="Profile" crumbs={[{ label: "Pages" }, { label: "Profile", href: ROUTES.DASHBOARD.PROFILE }]} />
      <EmployeeProfileCard/>
      */}

      {/* <OrgChartForm />  */}
      <div className="flex flex-row">
        <DocumentCard />

        <FeatureCard
          title="Policy 1"
          description="Delightful remarkably mr on announcing themselves entreaties favourable."
        />
        <FeatureCard
          image="/images/office-work.png"
          title="New technology awarness."
          description="Delightful remarkably mr on announcing themselves entreaties favourable."
          badgeLines={["30", "Nov", "2021"]}
          width={320}
          height={500}
        />

        <TeamsCard
          image="/images/team-member-1.png"
          name="Jocelyn Schleifer"
          designation="Manager"
          description="There are many variations of passages of Lorem Ipsum available."
        />
      </div>
        <TeamsCard
          image="/images/team-member-2.png"
          name="Martin Donin"
          designation="Lead"
          description="There are many variations of passages of Lorem Ipsum available."
        />
    </div>
  );
}

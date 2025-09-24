import PolicyCard from "@/components/common/feature-card";
import DocumentCard from "@/components/documents/document-card";

export default function Home() {
  return (
    <div>
      {/* <h1>Home</h1> */}
      {/* <PageHeader title="Profile" crumbs={[{ label: "Pages" }, { label: "Profile", href: ROUTES.DASHBOARD.PROFILE }]} />
      <EmployeeProfileCard/>
      <OrgChartForm /> */}
      <div className="flex flex-row">
        <DocumentCard />

        <PolicyCard
          title="Policy 1"
          description="Delightful remarkably mr on announcing themselves entreaties favourable."
        />
        <PolicyCard
          image="/images/office-work.png"
          title="New technology awarness."
          description="Delightful remarkably mr on announcing themselves entreaties favourable."
          badgeLines={[
            "3",
            { front: "O", back: "No" }, 
            { front: "v", back: "202" }, 
            "1",
          ]}
          width={320}
          height={500}
        />
      </div>
    </div>
  );
}

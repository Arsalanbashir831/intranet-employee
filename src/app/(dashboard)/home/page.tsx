import Checklist from "@/components/common/checklist";
import { EmployeeProfileCard } from "@/components/profile/profile-card";

export default function Home() {
  return (
    <div className=" min-h-screen">
      {/* <PageHeader title="Profile" crumbs={[{ label: "Pages" }, { label: "Profile", href: ROUTES.DASHBOARD.PROFILE }]} />
      <OrgChartForm /> 
      <EmployeeProfileCard/>
      */}
      {/* <BannerSection /> */}
      {/* <div className="flex flex-row">
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
      </div> */}
       <Checklist
        title="Task Checklist"
        viewMoreLink="/tasks"
        tasks={[
          "Follow the instructions and report everything properly",
          "Complete all assigned tasks on time",
          "Attend the scheduled team meeting promptly",
          "Update the documentation as per guidelines",
          "Submit the weekly report before Friday",
        ]}
      />
      <Checklist
        title="Training Checklist"
        viewMoreLink="/tasks"
        tasks={[]}
      /> 
    </div>
  );
}

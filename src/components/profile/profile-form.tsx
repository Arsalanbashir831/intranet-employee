"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dropzone } from "@/components/common/dropzone";
import {
  SelectableTags,
  createSelectableItems,
} from "@/components/common/selectable-tags";
import { RichTextEditor } from "@/components/common/rich-text-editor";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";
import { toast } from "sonner";
import { Card } from "../ui/card";

export type OrgChartInitialValues = {
  first_name?: string;
  last_name?: string;
  address?: string;
  city?: string;
  phone?: string;
  email?: string;
  departmentIds?: string[];
  branch?: string;
  profileImageUrl?: string;
  qualificationAndEducation?: string;
  job_title?: string;
  emp_role?: string;
  join_date?: string;
};

const departments = [
  { id: 1, name: "Department 1" },
  { id: 2, name: "Department 2" },
  { id: 3, name: "Department 3" },
];

const locations = [
  { id: 1, name: "Location 1" },
  { id: 2, name: "Location 2" },
  { id: 3, name: "Location 3" },
];

export function OrgChartForm({
  initialValues,
  onRegisterSubmit,
  isEdit = false,
  employeeId,
}: {
  initialValues?: OrgChartInitialValues;
  onRegisterSubmit?: (submit: () => void) => void;
  isEdit?: boolean;
  employeeId?: string;
}) {
  const [selectedDepartmentId, setSelectedDepartmentId] = React.useState<
    string | undefined
  >(initialValues?.departmentIds?.[0]);
  const [selectedLocationId, setSelectedLocationId] = React.useState<
    string | undefined
  >(initialValues?.branch);
  const [qualificationHtml, setQualificationHtml] = React.useState<
    string | undefined
  >(initialValues?.qualificationAndEducation);

  const router = useRouter();
  const formRef = React.useRef<HTMLFormElement | null>(null);

  React.useEffect(() => {
    if (onRegisterSubmit) {
      onRegisterSubmit(() => {
        formRef.current?.requestSubmit();
      });
    }
  }, [onRegisterSubmit]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Form submitted ✅");
  };

  return (
    <Card
      className="flex m-5 items-center justify-center bg-white shadow-md"
      style={{ width: 1374, height: 985 }}
    >
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="grid gap-6 overflow-y-auto"
        style={{ width: 1326, height: 850 }}
      >
        {/* First Name */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Name:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <Input
              name="name"
              defaultValue={initialValues?.first_name}
              placeholder="Name"
              className="border-[#E2E8F0]"
            />
          </div>
        </div>
        {/* Address */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Address:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <Input
              name="address"
              defaultValue={initialValues?.address}
              placeholder="Address"
              className="border-[#E2E8F0]"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            City:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <Input
              name="user_city"
              defaultValue={initialValues?.city}
              placeholder="City"
              className="border-[#E2E8F0]"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Phone Number:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <Input
              name="phone_number"
              defaultValue={initialValues?.phone}
              placeholder="Phone Number"
              className="border-[#E2E8F0]"
            />
          </div>
        </div>

        <div className="grid grid-cols-12 items-center gap-4">
        
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Email Id:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <Input
              name="email"
              defaultValue={initialValues?.email}
              placeholder="Email Id"
              type="email"
              className="border-[#E2E8F0]"
            />
          </div>
        </div>
 
        {/* Department */}
        <div className="grid grid-cols-12 items-center gap-4 border-t border-[#E9EAEB] pt-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Department:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <SelectableTags
              items={createSelectableItems(
                departments.map((d) => ({ ...d, id: String(d.id) }))
              )}
              selectedItems={selectedDepartmentId ? [selectedDepartmentId] : []}
              onSelectionChange={(ids: string[]) =>
                setSelectedDepartmentId(ids.at(-1))
              }
              searchPlaceholder="Search departments..."
              emptyMessage="No departments found."
            />
          </div>
        </div>
         
          <div className="grid grid-cols-12 items-center gap-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Role/Position:
          </Label>
          <div className="col-span-12 md:col-span-10">
            {" "}
            <Input
              name="emp_role"
              defaultValue={initialValues?.emp_role}
              placeholder="Role/Position"
              className="border-[#E2E8F0]"
            />
          </div>
        </div>

        {/* Location */}
        <div className="grid grid-cols-12 items-center gap-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Branch/Location:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <SelectableTags
              items={createSelectableItems(
                locations.map((l) => ({ ...l, id: String(l.id) }))
              )}
              selectedItems={selectedLocationId ? [selectedLocationId] : []}
              onSelectionChange={(ids: string[]) =>
                setSelectedLocationId(ids.at(-1))
              }
              searchPlaceholder="Search locations..."
              emptyMessage="No locations found."
            />
          </div>
        </div>
        {/* Profile Picture */}
        <div className="grid grid-cols-12 items-start gap-4 border-t border-[#E9EAEB] pt-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Profile Picture:
          </Label>
          <div className="col-span-12 md:col-span-10">
            <Dropzone
              onFileSelect={(files) => console.log("Files selected:", files)}
              accept="image/*"
              maxSize={800 * 400}
              initialPreviewUrls={
                initialValues?.profileImageUrl
                  ? [initialValues.profileImageUrl]
                  : []
              }
            />
          </div>
        </div>
        {/* Qualification */}
        <div className="grid grid-cols-12 items-start gap-4">
          <Label className="col-span-12 md:col-span-2 text-sm ">
            Qualification and Education
          </Label>
          <div className="col-span-12 md:col-span-10">
            <RichTextEditor
              content={qualificationHtml}
              placeholder="Write Qualification and Education"
              minHeight="200px"
              maxHeight="400px"
              onChange={(html) => setQualificationHtml(html)}
            />
          </div>
        </div>
      </form>
    </Card>
  );
}

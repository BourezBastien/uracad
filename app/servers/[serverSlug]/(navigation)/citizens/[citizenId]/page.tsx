import type { PageParams } from "@/types/next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Layout,
  LayoutContent,
  LayoutDescription,
  LayoutHeader,
  LayoutTitle,
} from "@/features/page/layout";
import CheckPermission from "../../permissions/check-permissions";
import { CreateMedicalRecordForm } from "../_components/create-medical-record-form";
import { DeleteRecordModal } from "../ems/records/delete-record-modal";
import { EditRecordModal } from "../ems/records/edit-record-modal";

function ActionsCheck({ children }: { children: React.ReactNode }) {
  return (
    <CheckPermission permissions={["EDIT_EMS", "DELETE_EMS"]} mode="OR">
      {children}
    </CheckPermission>
  );
}

export default async function CitizenPage({
  params,
}: PageParams<{ citizenId: string; serverSlug: string }>) {
  const citizenId = (await params).citizenId;
  const serverSlug = (await params).serverSlug;

  const citizen = await prisma.citizen.findUnique({
    where: { id: citizenId },
    include: {
      medicalRecords: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!citizen) {
    notFound();
  }

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>
          {citizen.name} {citizen.surname}
        </LayoutTitle>
        <LayoutDescription>
          SSN: {citizen.socialSecurityNumber ?? "N/A"} • Born{" "}
          {new Date(citizen.dateOfBirth).toLocaleDateString()} •{" "}
          {citizen.gender}
        </LayoutDescription>
      </LayoutHeader>

      <LayoutContent>
        <div className="grid gap-6">
          {/* Info de base */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                {citizen.image && (
                  <img
                    src={citizen.image}
                    alt={`${citizen.name} ${citizen.surname}`}
                    className="h-32 w-32 rounded-lg object-cover"
                  />
                )}
                <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                  <div>
                    <div className="text-muted-foreground font-medium">
                      Address
                    </div>
                    <div>{citizen.address}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-medium">Age</div>
                    <div>
                      {new Date().getFullYear() -
                        new Date(citizen.dateOfBirth).getFullYear()}{" "}
                      years old
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-medium">
                      Weight
                    </div>
                    <div>{citizen.weight ? `${citizen.weight} kg` : "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-medium">
                      Height
                    </div>
                    <div>{citizen.height ? `${citizen.height} cm` : "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-medium">
                      Hair Color
                    </div>
                    <div>{citizen.hairColor ?? "N/A"}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground font-medium">
                      Eye Color
                    </div>
                    <div>{citizen.eyeColor ?? "N/A"}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dossiers médicaux */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Medical Records</CardTitle>
              <CheckPermission permissions={["CREATE_EMS"]}>
                <CreateMedicalRecordForm citizen={citizen} />
              </CheckPermission>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead className="w-[200px]">Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Blood Group</TableHead>
                    <ActionsCheck>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </ActionsCheck>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {citizen.medicalRecords.map((record) => ( 
                    <TableRow 
                      key={record.id} 
                      className="cursor-pointer hover:bg-muted/50"
                    >
                      <TableCell>
                        <Link 
                          href={`/servers/${serverSlug}/citizens/${citizenId}/ems/${record.id}`}
                          className="hover:underline block w-full h-full"
                        >
                          {record.type}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[150px] truncate">
                        <Link 
                          href={`/servers/${serverSlug}/citizens/${citizenId}/ems/${record.id}`}
                          className="hover:underline block w-full h-full"
                        >
                          {record.title}
                        </Link>
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        <Link 
                          href={`/servers/${serverSlug}/citizens/${citizenId}/ems/${record.id}`}
                          className="hover:underline block w-full h-full"
                        >
                          {record.description}
                        </Link>
                      </TableCell>
                      <TableCell>
                        <Link 
                          href={`/servers/${serverSlug}/citizens/${citizenId}/ems/${record.id}`}
                          className="hover:underline block w-full h-full"
                        >
                          A+
                        </Link>
                      </TableCell>
                      <ActionsCheck>
                        <TableCell>
                          <div className="flex gap-2 z-10 relative">
                            <EditRecordModal record={{
                              id: record.id,
                              type: record.type as "CARE" | "INJURY" | "TRAUMA" | "PSYCHOLOGY" | "DEATH",
                              title: record.title,
                              description: record.description,
                              isConfidential: record.isConfidential,
                              isPoliceVisible: record.isPoliceVisible,
                              restrictedAccess: record.restrictedAccess,
                            }} />
                            <DeleteRecordModal record={record} />
                          </div>
                        </TableCell>
                      </ActionsCheck>
                    </TableRow>
                  ))}
                  {citizen.medicalRecords.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-muted-foreground text-center"
                      >
                        No medical records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Licenses */}
          <Card>
            <CardHeader>
              <CardTitle>Licenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
                <div>
                  <div className="text-muted-foreground font-medium">
                    Driver's License
                  </div>
                  <div>{citizen.driversLicense ?? "None"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-medium">
                    Pilot License
                  </div>
                  <div>{citizen.pilotLicense ?? "None"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-medium">
                    Water License
                  </div>
                  <div>{citizen.waterLicense ?? "None"}</div>
                </div>
                <div>
                  <div className="text-muted-foreground font-medium">
                    Firearms License
                  </div>
                  <div>{citizen.firearmsLicense ?? "None"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </LayoutContent>
    </Layout>
  );
}

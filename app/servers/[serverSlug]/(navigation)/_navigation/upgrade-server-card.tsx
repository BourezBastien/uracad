import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useCurrentServer } from "../../use-current-server";


export const UpgradeCard = () => {
  const server = useCurrentServer();

  if (!server) return null;

  if (server.subscription) return null;

  return (
    <Card className="">
      <CardHeader className="">
        <CardTitle>Upgrade to PRO</CardTitle>
        <CardDescription>
          Unlock all features and get unlimited access to our app.
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <Link
          href={`/servers/${server.slug}/settings/billing`}
          className={buttonVariants({ className: "w-full" })}
        >
          Upgrade
        </Link>
      </CardContent>
    </Card>
  );
};

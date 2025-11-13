import { getServerSession } from "@/hooks/server-session";
import { getUserActiveSubscriptions } from "@/db/query/user-subscriptions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import Link from "next/link";
import { UserCircle2, Edit, Settings } from "lucide-react";
// import UserHeader from "@/components/profile/user/header";
import UserPicture from "@/components/profile/user/picture";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "@/components/common/language-switcher";
import { ModeToggle } from "@/components/theme-toggle";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import LastActivities from "@/components/profile/user/last-activities";

export default async function ProfilePage() {
  const { isAuthenticated, userInfo, session } = await getServerSession();
  const t = await getTranslations("profile");

  if (!isAuthenticated || !userInfo || !userInfo.userId) {
    redirect("/login");
  }

  return (
    <div>
      <div>
        {/* Header */}
        {/* <UserHeader userInfo={userInfo} /> */}
        <div className="flex justify-center h-80 relative bg-[url('/w-bg.jpg')] bg-cover bg-center">
          <div className="flex justify-center items-center space-x-4">
            {/* <Edit className="size-6" /> */}
            <div className="flex flex-col items-center justify-center space-y-6">
              <UserPicture />
              <div className="flex flex-col items-center text-white">
                <span className="text-2xl font-bold">
                  {userInfo.firstName} {userInfo.lastName}
                </span>
                <span className="text-sm">{session?.user?.email}</span>
              </div>
            </div>
            {/* <Link href="/dashboard/profile/edit">
              <Settings className="size-6" />
            </Link> */}
          </div>
        </div>
        <div className="relative w-full">
          <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="bg-white px-6 py-5 shadow-xl">
              <div className="flex items-center space-x-4 h-5">
                <div className="flex flex-col">
                  <span className="font-bold">0</span>
                  <span className="text-muted-foreground text-sm">lessons</span>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col">
                  <span className="font-bold">0</span>
                  <span className="text-muted-foreground text-sm">
                    subscriptions
                  </span>
                </div>
                <Separator orientation="vertical" />
                <div className="flex flex-col">
                  <span className="font-bold">0</span>
                  <span className="text-muted-foreground text-sm">lessons</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Basic Information */}
        <div className="mt-12 mx-4">
          <LastActivities userId={userInfo.userId} />
        </div>
        {/* <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Mail className="size-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Email
                </p>
                <p className="text-sm mt-1">{userInfo.email}</p>
              </div>
            </div>
            {userInfo.phoneNumber && (
              <div className="flex items-start gap-3">
                <Phone className="size-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Phone Number
                  </p>
                  <p className="text-sm mt-1">{userInfo.phoneNumber}</p>
                </div>
              </div>
            )}
          </div>
        </div> */}

        {/* Contact Information */}
        {/* {(userInfo.address ||
          userInfo.city ||
          userInfo.state ||
          userInfo.zipCode ||
          userInfo.country) && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Address</h2>
            <div className="flex items-start gap-3">
              <MapPin className="size-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                {userInfo.address && (
                  <p className="text-sm">{userInfo.address}</p>
                )}
                <p className="text-sm">
                  {[
                    userInfo.city,
                    userInfo.state,
                    userInfo.zipCode,
                    userInfo.country,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
          </div>
        )} */}

        {/* {(userInfo.birthDate || userInfo.taxCode) && (
          <div className="rounded-lg border bg-card p-6">
            <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {userInfo.birthDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Date of Birth
                    </p>
                    <p className="text-sm mt-1">
                      {formatDate(userInfo.birthDate)}
                    </p>
                  </div>
                </div>
              )}
              {userInfo.taxCode && (
                <div className="flex items-start gap-3">
                  <FileText className="size-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Tax Code
                    </p>
                    <p className="text-sm mt-1">{userInfo.taxCode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Subscriptions */}
        {/* <div className="rounded-lg border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="size-5" />
            {t("mySubscriptions")}
          </h2>
          {userSubscriptions.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="size-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Non hai ancora nessun abbonamento attivo
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {userSubscriptions.map((subscription) => {
                const isExpired = new Date(subscription.expiresAt) < new Date();
                const isActive = subscription.status === "active" && !isExpired;

                return (
                  <div
                    key={subscription.id}
                    className="flex items-start justify-between p-4 border rounded-lg"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{subscription.name}</h3>
                        <Badge variant={isActive ? "default" : "secondary"}>
                          {isActive ? "Attivo" : "Scaduto"}
                        </Badge>
                        <Badge variant="outline">{subscription.center}</Badge>
                      </div>
                      {subscription.description && (
                        <p className="text-sm text-muted-foreground">
                          {subscription.description}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>
                            Attivato:{" "}
                            {new Date(
                              subscription.activatedAt
                            ).toLocaleDateString("it-IT")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>
                            Scade:{" "}
                            {new Date(
                              subscription.expiresAt
                            ).toLocaleDateString("it-IT")}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {subscription.entriesPerDay} ingressi/giorno •{" "}
                        {subscription.entriesPerWeek} ingressi/settimana
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div> */}

        {/* Empty State */}
        {!userInfo.phoneNumber &&
          !userInfo.address &&
          !userInfo.birthDate &&
          !userInfo.taxCode && (
            <div className="rounded-lg border bg-card p-12 text-center">
              <UserCircle2 className="size-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Complete Your Profile
              </h3>
              <p className="text-muted-foreground mb-4">
                Add more information to your profile to get the most out of your
                account.
              </p>
              <Link href="profile/edit">
                <Edit className="size-4 mr-2" />
                Add Information
              </Link>
            </div>
          )}

        {/* <Card>
          <CardHeader>
            <CardTitle>{t("settings.title")}</CardTitle>
            <CardDescription>
              <div className="flex flex-col gap-2">
                <div>
                  <Label className="text-sm font-medium my-2">
                    {t("settings.language")}
                  </Label>
                  <LanguageSwitcher showDropdown={false} />
                </div>
                <div>
                  <Label className="text-sm font-medium my-2">
                    {t("settings.theme")}
                  </Label>
                  <ModeToggle showDropdown={false} />
                </div>
              </div>
            </CardDescription>
          </CardHeader>
        </Card> */}
      </div>
    </div>
  );
}

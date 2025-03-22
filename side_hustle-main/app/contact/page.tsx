"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/router";

function Contact() {
  const router = useRouter();

  const navigateToHome = () => {
    router.navigate("/");
  };

  return (
    <div className="p-10">
      <h1 className="text-4xl mb-4 font-bold">
        Woohoo! You&apos;re on the Contact page!
      </h1>

      <h2 className="text-xl mb-6">
        Looks like the redirect worked! (You came here from the notification)
      </h2>

      <Button onClick={navigateToHome}>
        Go back to Home
      </Button>
    </div>
  );
}

export default Contact;

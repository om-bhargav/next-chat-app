import {
    MessageSquare,
    Users,
    ShieldCheck,
} from "lucide-react";

import Heading from "@/components/elements/Heading";
import Paragraph from "@/components/elements/Paragraph";
import SubHeading from "@/components/elements/SubHeading";

import {
    Card,
    CardContent,
} from "@/components/ui/card";

const features = [
    {
        title: "Instant Messaging",
        description:
            "Exchange messages in real-time with fast delivery and seamless conversations.",
        icon: MessageSquare,
        badge: "Real-time",
    },
    {
        title: "Group Chats",
        description:
            "Create groups, collaborate with teams, and stay connected with everyone in one place.",
        icon: Users,
        badge: "Unlimited Members",
    },
    {
        title: "Secure Platform",
        description:
            "Protected with modern authentication, encryption, and privacy-focused architecture.",
        icon: ShieldCheck,
        badge: "Enterprise Grade",
    },
];

export default function Features() {
    return (
        <section className="py-24">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-14 flex flex-col items-center text-center">
                    <SubHeading>
                        Features
                    </SubHeading>

                    <Heading
                        as="h2"
                        className="mt-2"
                    >
                        Everything You Need
                    </Heading>

                    <Paragraph className="mt-3 max-w-2xl">
                        Built with performance, security, and simplicity
                        in mind for modern communication.
                    </Paragraph>
                </div>

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <Card
                                key={feature.title}
                                className="group h-full transition-all duration-300 hover:-translate-y-1"
                            >
                                <CardContent className="flex h-full flex-col p-6">
                                    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border bg-muted">
                                        <Icon className="h-5 w-5" />
                                    </div>

                                    <div className="mb-3">
                                        <span className="rounded-full border px-2.5 py-1 text-xs font-medium">
                                            {feature.badge}
                                        </span>
                                    </div>

                                    <Heading
                                        as="h4"
                                        className="mb-3 text-xl"
                                    >
                                        {feature.title}
                                    </Heading>

                                    <Paragraph className="flex-1 text-sm">
                                        {feature.description}
                                    </Paragraph>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
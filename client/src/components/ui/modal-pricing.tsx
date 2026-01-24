"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlanOption {
    id: string;
    name: string;
    price: string;
    description: string;
    features: string[];
}

const plansSample: PlanOption[] = [
    {
        id: "basic",
        name: "Basic",
        price: "$9",
        description: "Perfect for side projects",
        features: ["5 projects", "Basic analytics", "24h support"],
    },
    {
        id: "pro",
        name: "Pro",
        price: "$19",
        description: "For professional developers",
        features: [
            "Unlimited projects",
            "Advanced analytics",
            "Priority support",
        ],
    },
];

function ModalPricing({
    plans = plansSample,
}: {
    plans: PlanOption[];
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState("pro");

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    onClick={() => setIsOpen(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                >
                    Upgrade Plan
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[900px] bg-zinc-50 dark:bg-zinc-950 p-8">
                <DialogHeader className="mb-8">
                    <DialogTitle className="text-3xl font-bold text-zinc-900 dark:text-white">
                        Choose Your Plan
                    </DialogTitle>
                    <p className="text-zinc-500 dark:text-zinc-400">
                        Select the perfect plan for your needs. Upgrade or
                        downgrade at any time.
                    </p>
                </DialogHeader>

                <div className="grid gap-6 md:grid-cols-2">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={cn(
                                "relative rounded-xl border-2 p-6 transition-all duration-200 cursor-pointer hover:border-zinc-500",
                                selectedPlan === plan.id
                                    ? "border-zinc-900 bg-zinc-50/50 dark:border-white dark:bg-zinc-900/50"
                                    : "border-transparent bg-zinc-100 dark:bg-zinc-900"
                            )}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-zinc-900 dark:text-white">
                                        {plan.name}
                                    </h3>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        {plan.description}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-zinc-900 dark:text-white">
                                        {plan.price}
                                    </span>
                                    <span className="text-zinc-500 dark:text-zinc-400">
                                        /mo
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center text-sm text-zinc-600 dark:text-zinc-300"
                                    >
                                        <Check className="mr-2 h-4 w-4 text-zinc-900 dark:text-white" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {selectedPlan === plan.id && (
                                <div className="absolute top-4 right-4">
                                    <div className="h-6 w-6 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center">
                                        <Check className="h-3 w-3 text-white dark:text-zinc-900" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <DialogFooter className="mt-8">
                    <Button
                        onClick={() => setIsOpen(false)}
                        className="w-full bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
                    >
                        Confirm Selection
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}


export { ModalPricing, type PlanOption }

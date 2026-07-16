"use client";

import * as React from "react";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageGalleryDialogProps {
    images: string[];
    children: React.ReactNode;
    initialIndex?: number;
}

export function ImageGalleryDialog({
    images,
    children,
    initialIndex = 0,
}: ImageGalleryDialogProps) {
    const [open, setOpen] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(initialIndex);

    React.useEffect(() => {
        if (open) {
            setActiveIndex(initialIndex);
        }
    }, [open, initialIndex]);

    if (!images.length) return <>{children}</>;

    const previous = () => {
        setActiveIndex((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
        );
    };

    const next = () => {
        setActiveIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
        );
    };

    const thumbnails = images.slice(0, 5);
    const remaining = images.length - 5;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="h-screen  w-full! max-w-screen! rounded-none border-0 p-0">
                <div className="relative flex h-full flex-col bg-black">

                    {/* Main Image */}
                    <div className="relative flex flex-1 items-center justify-center overflow-hidden px-20 py-8">
                        <Image
                            src={images[activeIndex]}
                            alt={`Image ${activeIndex + 1}`}
                            fill
                            unoptimized
                            className="object-contain"
                        />

                        {/* Previous */}
                        {images.length > 1 && (
                            <Button
                                size="icon-lg"
                                variant="secondary"
                                onClick={previous}
                                className="absolute left-6 z-20 rounded-full"
                            >
                                <ChevronLeft className="size-6" />
                            </Button>
                        )}

                        {/* Next */}
                        {images.length > 1 && (
                            <Button
                                size="icon-lg"
                                variant="secondary"
                                onClick={next}
                                className="absolute right-6 z-20 rounded-full"
                            >
                                <ChevronRight className="size-6" />
                            </Button>
                        )}
                    </div>

                    {/* Thumbnails */}
                    {images.length > 1 && (
                        <div className="flex justify-center gap-3 overflow-x-auto border-t border-white/10 bg-black/90 p-5">
                            {thumbnails.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={cn(
                                        "relative h-20 w-28 overflow-hidden rounded-lg border-2 transition-all",
                                        activeIndex === index
                                            ? "border-white"
                                            : "border-transparent opacity-70 hover:opacity-100"
                                    )}
                                >
                                    <Image
                                        src={image}
                                        alt=""
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />

                                    {index === 4 && remaining > 0 && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-lg font-semibold text-white">
                                            +{remaining}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
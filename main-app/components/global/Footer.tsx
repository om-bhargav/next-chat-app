import { SITE_NAME } from '@/config'
import { Separator } from '@/components/ui/separator';


export default function Footer() {
    return (
        <footer className="border-t">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid gap-10 md:grid-cols-4">
                    <div>
                        <h3 className="mb-3 text-xl font-bold">
                            {SITE_NAME}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                            Modern communication platform built for
                            seamless conversations.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-3 font-semibold">
                            Product
                        </h4>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Home</p>
                            <p>Features</p>
                            <p>Testimonials</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 font-semibold">
                            Company
                        </h4>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>About</p>
                            <p>Contact</p>
                        </div>
                    </div>

                    <div>
                        <h4 className="mb-3 font-semibold">
                            Legal
                        </h4>

                        <div className="space-y-2 text-sm text-muted-foreground">
                            <p>Privacy Policy</p>
                            <p>Terms of Service</p>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <p className="text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
                </p>
            </div>
        </footer>
    )
}

import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

export default function Contact() {
    return (
        <section
            id="contact"
            className="bg-muted/40 py-24"
        >
            <div className="max-w-7xl mx-auto px-4">
                <Card>
                    <CardContent className="space-y-6 pt-6">
                        <div>
                            <h2 className="text-3xl font-bold">
                                Contact Us
                            </h2>

                            <p className="text-muted-foreground">
                                We'd love to hear from you.
                            </p>
                        </div>

                        <Input placeholder="Your Name" />

                        <Input placeholder="Your Email" />

                        <Textarea
                            rows={6}
                            placeholder="Your Message"
                        />

                        <Button className="w-full">
                            Send Message
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}

import {auth} from "@/lib/auth"
import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/db"
import {User} from "@/lib/models/User"
import {Notification} from "@/lib/models/Notification"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function Dashboard() {
    const session = await auth();

    if(!session){
        redirect("auth/signin")
    }

    await connectToDatabase()

    const user = await User.findById(session.user.id)
    const notification = await Notification.countDocuments({
        userId: session.user.id,
        read: false
    })

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Welcome, {user?.name || 'User'}!</CardTitle>
                    <CardDescription>Your notifications</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>You have {notification} unread notifications.</p>
                </CardContent>
            </Card>
            <Link href="/notifications">
                <Button>View Notifications</Button>
            </Link>
        </div>
    )
}
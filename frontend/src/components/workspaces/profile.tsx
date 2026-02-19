"use client";
import { useAuth } from "@/hooks/useAuth"


export default function Profile() {
    const { user } = useAuth();
    
    return (
        <div>
            <div>
                <div className="w-4 h-4 rounded-3xl">
                    {user?.name[0].toUpperCase()}
                </div>
            </div>
        </div>
    )
}
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function urlAllowed(url: string) {
    const allowed = await prisma.whitelist.count({
        where: {
            url: {
                contains: url
            }
        }
    }) 
    return allowed > 0
}